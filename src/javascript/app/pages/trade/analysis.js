const showChart      = require('./charts/webtrader_chart').showChart;
const Defaults       = require('./defaults');
const getActiveTab   = require('./get_active_tab').getActiveTab;
const GetTicks       = require('./get_ticks');
const MBDefaults     = require('../mb_trade/mb_defaults');
const JapanPortfolio = require('../../japan/portfolio');
const getElementById = require('../../../_common/common_functions').getElementById;
const getLanguage    = require('../../../_common/language').get;
const State          = require('../../../_common/storage').State;
const TabSelector    = require('../../../_common/tab_selector');
const Url            = require('../../../_common/url');

/*
 * This file contains the code related to loading of trading page bottom analysis
 * content. It will contain jquery so as to compatible with old code and less rewrite
 *
 * Please note that this will be removed in near future
 */

/*
 * This function is called whenever we change market, form
 * or underlying to load bet analysis for that particular event
 */

const TradingAnalysis = (() => {
    // tabListener();
    const hidden_class    = 'invisible';
    const tab_selector_id = 'trade_analysis';

    let form_name, current_tab;

    const requestTradeAnalysis = () => {
        form_name = (State.get('is_mb_trading') ? MBDefaults.get('category') : Defaults.get('formname')) || 'risefall';

        const map_obj = { matchdiff: 'digits', callput: 'higherlower' };
        const regex   = new RegExp(Object.keys(map_obj).join('|'), 'gi');
        form_name     = form_name.replace(regex, matched => map_obj[matched]);

        $('#tab_last_digit').setVisibility(/digits|overunder|evenodd/.test(form_name));
        sessionStorage.setItem('currentAnalysisTab', getActiveTab());
        loadAnalysisTab();
    };

    /*
     * This function bind event to link elements of bottom content
     * navigation
     */
    const bindAnalysisTabEvent = () => {
        $('#trade_analysis').find('li a').on('click', (e) => {
            e.preventDefault();
            const li = e.target.parentElement;
            sessionStorage.setItem('currentAnalysisTab', li.id);
            if (!li.classList.contains('active')) {
                loadAnalysisTab(li.id);
            }
        });

        TabSelector.onChangeTab(changeTab);
    };

    /*
     * This function handles all the functionality on how to load
     * tab according to current paramerted
     */
    const loadAnalysisTab = (tab) => {
        current_tab = tab || getActiveTab();

        $('#trade_analysis').find('li').removeClass('active');
        $(`#${current_tab}`).addClass('active');
        toggleActiveAnalysisTabs();
        JapanPortfolio.init();
        if (State.get('is_mb_trading')) {
            showChart();
        }
        if (current_tab === 'tab_portfolio') {
            JapanPortfolio.show();
        } else {
            JapanPortfolio.hide();
            if (current_tab === 'tab_graph') {
                showChart();
            } else if (current_tab === 'tab_last_digit') {
                const $digit_underlying = $('#digit_underlying');
                const $underlying       = $('#underlying');
                const underlying        = $underlying.val();
                const underlying_text   = $underlying.attr('data-text');
                const tick              = $('#tick_count').val() || 100;

                if (underlying !== $digit_underlying.val() && $digit_underlying.val() !== null ) {
                    $digit_underlying.find(`option[value="${underlying}"]`).prop('selected', true).trigger('change');
                    const $digit_underlying_dropdown = $digit_underlying.next('div.select-dropdown');

                    // check if custom dropdown exists and sync with underlying dropdown
                    if ($digit_underlying_dropdown) {
                        const $digit_underlying_list = $digit_underlying_dropdown.next('ul.select-options').children('li');
                        $digit_underlying_dropdown.text(underlying_text);
                        $digit_underlying_list.not(this).each((idx, el) => {
                            el.classList.remove('selected');
                        });
                        $digit_underlying_list.filter(`[value='${underlying}']`).addClass('selected');
                    }
                }
                else {
                    GetTicks.request('', {
                        ticks_history: underlying,
                        count        : tick.toString(),
                        end          : 'latest',
                    });
                }
            } else if (current_tab === 'tab_explanation') {
                showExplanation();
            }
        }
        if (current_tab) {
            const el_to_show           = getElementById(current_tab);
            const el_mobile_tab_header = getElementById('tab_mobile_header');

            TabSelector.slideSelector(tab_selector_id, el_to_show);
            if (el_mobile_tab_header) {
                el_mobile_tab_header.innerHTML = el_to_show.firstChild.innerHTML;
            }
        }

        // workaround for underline during window resize
        window.addEventListener('resize', tabSlider);
    };

    const tabSlider = () => {
        TabSelector.slideSelector(tab_selector_id, getElementById(current_tab));
    };

    const changeTab = (options) => {
        const selector_array = Array.from(getElementById(options.selector).querySelectorAll('li.tm-li:not(.invisible):not(.tab-selector)'));
        const active_index = selector_array.findIndex((x) => x.id === getActiveTab());
        let index_to_show = active_index;
        if (options.direction) {
            const array_length = selector_array.length;
            if (options.direction === 'left') {
                index_to_show = active_index - 1;
                index_to_show = index_to_show < 0 ? array_length - 1 : index_to_show;
            } else {
                index_to_show = active_index + 1;
                index_to_show = index_to_show === array_length ? 0 : index_to_show;
            }
        }
        options.el_to_show = selector_array[index_to_show].id;
        if (!options.el_to_show || !options.selector) {
            return;
        }
        sessionStorage.setItem('currentAnalysisTab', options.el_to_show);
        if (!getElementById(options.el_to_show).classList.contains('active')) {
            loadAnalysisTab(options.el_to_show);
        }
    };

    /*
     * function to toggle the active element for analysis menu
     */
    const toggleActiveAnalysisTabs = () => {
        current_tab        = getActiveTab();

        const analysis_container  = getElementById('analysis_content');
        const child_elements      = analysis_container.children;
        const current_tab_element = getElementById(`${current_tab}-content`);
        const classes             = current_tab_element.classList;

        for (let i = 0, len = child_elements.length; i < len; i++) {
            child_elements[i].classList.remove('selectedTab');
            child_elements[i].classList.add(hidden_class);
        }

        classes.add('selectedTab');
        classes.remove(hidden_class);
    };

    /*
     * handle the display of proper explanation based on parameters
     */
    const showExplanation = () => {
        const $container = $('#tab_explanation-content');

        $container.find('#explanation_winning > div, #explanation_explain > div, #explanation_image').setVisibility(0);
        $container.find(`#explanation_winning, #winning_${form_name}, #explanation_explain, #explain_${form_name}`).setVisibility(1);

        const images = {
            risefall: {
                image1: 'rise-fall-1.svg',
                image2: 'rise-fall-2.svg',
            },
            higherlower: {
                image1: 'higher-lower-1.svg',
                image2: 'higher-lower-2.svg',
            },
            touchnotouch: {
                image1: 'touch-notouch-1.svg',
                image2: 'touch-notouch-2.svg',
            },
            endsinout: {
                image1: 'in-out-1.svg',
                image2: 'in-out-2.svg',
            },
            staysinout: {
                image1: 'in-out-3.svg',
                image2: 'in-out-4.svg',
            },
            updown: {
                image1: 'up-down-1.svg',
                image2: 'up-down-2.svg',
            },
            evenodd: {
                image1: 'evenodd-1.svg',
                image2: 'evenodd-2.svg',
            },
            overunder: {
                image1: 'overunder-1.svg',
                image2: 'overunder-2.svg',
            },
            lookbackhigh: {
                image1: 'close-high-image.svg',
            },
            lookbacklow: {
                image1: 'close-low-image.svg',
            },
            lookbackhighlow: {
                image1: 'high-low-image.svg',
            },
        };

        if (images[form_name]) {
            const image_path = Url.urlForStatic(`images/pages/trade-explanation/${(getLanguage() === 'JA' ? 'ja/' : '')}`);
            $container.find('#explanation_image_1').attr('src', image_path + images[form_name].image1);
            if (images[form_name].image2) {
                $container
                    .find('#explanation_image_2')
                    .attr('src', image_path + images[form_name].image2)
                    .parent()
                    .setVisibility(1);
            } else {
                $container.find('#explanation_image_2').parent().setVisibility(0);
            }
            $container.find('#explanation_image').setVisibility(1);
        }
    };

    const onUnload = () => {
        window.removeEventListener('resize', tabSlider);
    };

    return {
        bindAnalysisTabEvent,
        onUnload,
        request: requestTradeAnalysis,
    };
})();

module.exports = TradingAnalysis;
