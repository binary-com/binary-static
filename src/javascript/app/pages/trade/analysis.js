const showChart      = require('./charts/webtrader_chart').showChart;
const Defaults       = require('./defaults');
const getActiveTab   = require('./get_active_tab').getActiveTab;
const GetTicks       = require('./get_ticks');
const MBDefaults     = require('../mb_trade/mb_defaults');
const JapanPortfolio = require('../../japan/portfolio');
const getElementById = require('../../../_common/common_functions').getElementById;
const getLanguage    = require('../../../_common/language').get;
const State          = require('../../../_common/storage').State;
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
    const hidden_class = 'invisible';
    let form_name;

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
        $('#betsBottomPage').find('li a').on('click', (e) => {
            e.preventDefault();
            const li = e.target.parentElement;
            sessionStorage.setItem('currentAnalysisTab', li.id);
            if (!li.classList.contains('active')) {
                loadAnalysisTab(li.id);
            }
        });
    };

    /*
     * This function handles all the functionality on how to load
     * tab according to current paramerted
     */
    const loadAnalysisTab = (tab) => {
        const current_tab = tab || getActiveTab();
        $('#betsBottomPage').find('li').removeClass('active');
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
                const el_digit_underlying = $('#digit_underlying');
                const underlying = $('#underlying option:selected').val();
                const tick       = $('#tick_count').val() || 100;
                if (underlying !== el_digit_underlying.val() && el_digit_underlying.val() !== null ) {
                    el_digit_underlying.find(`option[value="${underlying}"]`).prop('selected', true).trigger('change');
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
    };

    /*
     * function to toggle the active element for analysis menu
     */
    const toggleActiveAnalysisTabs = () => {
        const current_tab        = getActiveTab();
        const analysis_container = getElementById('bet_bottom_content');

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

    return {
        bindAnalysisTabEvent,
        request: requestTradeAnalysis,
    };
})();

module.exports = TradingAnalysis;
