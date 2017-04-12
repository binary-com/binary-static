const commonTrading    = require('../common');
const AssetIndexUI     = require('../../resources/asset_index/asset_index.ui');
const TradingTimesUI   = require('../../resources/trading_times/trading_times.ui');
const PortfolioInit    = require('../../user/account/portfolio/portfolio.init');
const Client           = require('../../../base/client');
const getLanguage      = require('../../../base/language').get;
const State            = require('../../../base/storage').State;
const Url              = require('../../../base/url');
const elementInnerHtml = require('../../../common_functions/common_functions').elementInnerHtml;
const jpClient         = require('../../../common_functions/country_base').jpClient;

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

const TradingAnalysis_Beta = (() => {
    'use strict';

    const requestTradeAnalysis = () => {
        let form_name = State.get('is_mb_trading') ? $('#category').val() : $('#contract_form_name_nav').find('.a-active').attr('id');
        if (form_name === 'matchdiff') {
            form_name = 'digits';
        }
        $('#tab_explanation').find('a').attr('href',  Url.urlFor('trade/bet_explanation_beta', `underlying_symbol=${$('#underlying').val()}&form_name=${form_name}`));
        if (/(digits|overunder|evenodd)/.test(form_name)) {
            $('#tab_last_digit').removeClass('invisible');
        } else {
            $('#tab_last_digit').addClass('invisible');
        }
        sessionStorage.setItem('currentAnalysisTab_Beta', getActiveTab());
        loadAnalysisTab();
    };

    /*
     * This function bind event to link elements of bottom content
     * navigation
     */
    const bindAnalysisTabEvent = () => {
        if (Client.isLoggedIn()) {
            $('#tab_portfolio').removeClass('invisible');
        }
        if (!jpClient()) {
            $('#tab_asset_index').removeClass('invisible');
            $('#tab_trading_times').removeClass('invisible');
        }

        const $analysis_tabs = $('#trading_analysis_content').find('#analysis_tabs');
        if ($analysis_tabs.length) {
            $analysis_tabs.find('li a').click(function(e) {
                e.preventDefault();
                const $li = $(this).parent();
                sessionStorage.setItem('currentAnalysisTab_Beta', $li.attr('id'));
                if (!$li.hasClass('active')) {
                    loadAnalysisTab();
                }
            });
        }
    };

    /*
     * This function handles all the functionality on how to load
     * tab according to current paramerted
     */
    const loadAnalysisTab = () => {
        const current_tab = getActiveTab();
        const current_link = document.querySelector(`#${current_tab} a`);
        const content_id = document.getElementById(`${current_tab}-content`);

        const analysis_nav_element = document.querySelector('#trading_analysis_content #analysis_tabs');
        commonTrading.toggleActiveNavMenuElement_Beta(analysis_nav_element, current_link.parentElement);
        toggleActiveAnalysisTabs();

        switch (current_tab) {
            case 'tab_graph':
                commonTrading.showHighchart();
                break;
            case 'tab_portfolio':
                PortfolioInit.onLoad();
                break;
            case 'tab_last_digit': {
                const underlying = $('[name=underlying] option:selected').val() || $('#underlying').find('option:selected').val();
                const tick = $('[name=tick_count]').val() || 100;
                BinarySocket.send({ ticks_history: underlying, end: 'latest', count: tick.toString(), req_id: 1 });
                break;
            }
            case 'tab_asset_index':
                AssetIndexUI.onLoad({ framed: true });
                $('#tab_asset').find('index-content').find('h1').hide();
                break;
            case 'tab_trading_times':
                TradingTimesUI.onLoad({ framed: true });
                $('#tab_trading').find('times-content').find('h1').hide();
                break;
            default: {
                const url = current_link.getAttribute('href');
                $.ajax({
                    method: 'GET',
                    url   : url,
                }).done((data) => {
                    elementInnerHtml(content_id, data);
                    if (current_tab === 'tab_explanation') {
                        showExplanation(current_link.href);
                    }
                });
                break;
            }
        }
    };

    /*
     * function to toggle the active element for analysis menu
     */
    const toggleActiveAnalysisTabs = () => {
        const current_tab = getActiveTab();
        const analysis_container = document.getElementById('analysis_content');

        if (analysis_container) {
            const child_elements = analysis_container.children;
            const current_tab_element = document.getElementById(`${current_tab}-content`);
            const classes = current_tab_element.classList;

            for (let i = 0, len = child_elements.length; i < len; i++) {
                child_elements[i].classList.remove('selectedTab');
                child_elements[i].classList.add('invisible');
            }

            classes.add('selectedTab');
            classes.remove('invisible');
        }
    };

    /*
     * get the current active tab if its visible i.e allowed for current parameters
     */
    const getActiveTab = () => {
        let selected_tab = sessionStorage.getItem('currentAnalysisTab_Beta') || (State.get('is_mb_trading') ? 'tab_portfolio' : window.chartAllowed ? 'tab_graph' : 'tab_explanation');
        const selected_element = document.getElementById(selected_tab);

        if (selected_element && selected_element.classList.contains('invisible')) {
            selected_tab = window.chartAllowed ? 'tab_graph' : 'tab_explanation';
            sessionStorage.setItem('currentAnalysisTab_Beta', selected_tab);
        }

        return selected_tab;
    };

    /*
     * handle the display of proper explanation based on parameters
     */
    const showExplanation = (href) => {
        const options = Url.paramsHash(href);
        const form_name    = options.form_name || 'risefall';
        const show_image   = options.show_image   ? options.show_image   > 0 : true;
        const show_winning = options.show_winning ? options.show_winning > 0 : true;
        const show_explain = true;
        const hidden_class = 'invisible';
        const $container   = $('#tab_explanation-content');

        if (show_winning) {
            $container.find(`#explanation_winning, #winning_${form_name}`).removeClass(hidden_class);
        }

        if (show_explain) {
            $container.find(`#explanation_explain, #explain_${form_name}`).removeClass(hidden_class);
        }

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
        };

        if (show_image && images.hasOwnProperty(form_name)) {
            const language = getLanguage().toLowerCase();
            const image_path = Url.urlForStatic(`images/pages/trade-explanation/${(language === 'ja' ? `${language}/` : '')}`);
            $container.find('#explanation_image_1').attr('src', image_path + images[form_name].image1);
            $container.find('#explanation_image_2').attr('src', image_path + images[form_name].image2);
            $container.find('#explanation_image').removeClass(hidden_class);
        }
    };

    return {
        request             : requestTradeAnalysis,
        getActiveTab        : getActiveTab,
        bindAnalysisTabEvent: bindAnalysisTabEvent,
    };
})();

module.exports = TradingAnalysis_Beta;
