const DigitInfo_Beta                  = require('./charts/digit_info');
const showHighchart                   = require('../common').showHighchart;
const toggleActiveNavMenuElement_Beta = require('../common').toggleActiveNavMenuElement_Beta;
const AssetIndexUI                    = require('../../resources/asset_index/asset_index.ui');
const TradingTimesUI                  = require('../../resources/trading_times/trading_times.ui');
const PortfolioInit                   = require('../../user/account/portfolio/portfolio.init');
const Client                          = require('../../../base/client');
const getLanguage                     = require('../../../base/language').get;
const State                           = require('../../../base/storage').State;
const Url                             = require('../../../base/url');
const elementInnerHtml                = require('../../../common_functions/common_functions').elementInnerHtml;
const jpClient                        = require('../../../common_functions/country_base').jpClient;

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

const TradingAnalysis_Beta = (function() {
    const trading_digit_info = new DigitInfo_Beta();

    const requestTradeAnalysis = function() {
        let formName = State.get('is_mb_trading') ? $('#category').val() :
                                                    $('#contract_form_name_nav').find('.a-active').attr('id');
        if (formName === 'matchdiff') {
            formName = 'digits';
        }
        $('#tab_explanation').find('a').attr('href',  Url.urlFor('trade/bet_explanation_beta', `underlying_symbol=${$('#underlying').val()}&form_name=${formName}`));
        if (formName === 'digits' || formName === 'overunder' || formName === 'evenodd') {
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
    const bindAnalysisTabEvent = function() {
        'use strict';

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
    const loadAnalysisTab = function() {
        'use strict';

        const currentTab = getActiveTab(),
            currentLink = document.querySelector(`#${currentTab} a`),
            contentId = document.getElementById(`${currentTab}-content`);

        const analysisNavElement = document.querySelector('#trading_analysis_content #analysis_tabs');
        toggleActiveNavMenuElement_Beta(analysisNavElement, currentLink.parentElement);
        toggleActiveAnalysisTabs();

        switch (currentTab) {
            case 'tab_graph':
                showHighchart();
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
                const url = currentLink.getAttribute('href');
                $.ajax({
                    method: 'GET',
                    url   : url,
                })

                    .done(function (data) {
                        elementInnerHtml(contentId, data);
                        if (currentTab === 'tab_explanation') {
                            showExplanation(currentLink.href);
                        }
                    });
                break;
            }
        }
    };

    /*
     * function to toggle the active element for analysis menu
     */
    const toggleActiveAnalysisTabs = function() {
        'use strict';

        const currentTab = getActiveTab(),
            analysisContainer = document.getElementById('analysis_content');

        if (analysisContainer) {
            const childElements = analysisContainer.children,
                currentTabElement = document.getElementById(`${currentTab}-content`),
                classes = currentTabElement.classList;

            for (let i = 0, len = childElements.length; i < len; i++) {
                childElements[i].classList.remove('selectedTab');
                childElements[i].classList.add('invisible');
            }

            classes.add('selectedTab');
            classes.remove('invisible');
        }
    };

    /*
     * get the current active tab if its visible i.e allowed for current parameters
     */
    const getActiveTab = function() {
        let selectedTab = sessionStorage.getItem('currentAnalysisTab_Beta') || (State.get('is_mb_trading') ? 'tab_portfolio' : window.chartAllowed ? 'tab_graph' : 'tab_explanation');
        const selectedElement = document.getElementById(selectedTab);

        if (selectedElement && selectedElement.classList.contains('invisible')) {
            selectedTab = window.chartAllowed ? 'tab_graph' : 'tab_explanation';
            sessionStorage.setItem('currentAnalysisTab_Beta', selectedTab);
        }

        return selectedTab;
    };

    /*
     * handle the display of proper explanation based on parameters
     */
    const showExplanation = function(href) {
        const options = Url.paramsHash(href);
        const form_name    = options.form_name || 'risefall';
        const show_image   = options.show_image   ? options.show_image   > 0 : true;
        const show_winning = options.show_winning ? options.show_winning > 0 : true;
        const show_explain = true;
        const hidden_class = 'invisible';
        const $Container   = $('#tab_explanation-content');

        if (show_winning) {
            $Container.find(`#explanation_winning, #winning_${form_name}`).removeClass(hidden_class);
        }

        if (show_explain) {
            $Container.find(`#explanation_explain, #explain_${form_name}`).removeClass(hidden_class);
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
            spreads: {
                image1: 'spreads-1.svg',
                image2: 'spreads-2.svg',
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
            $Container.find('#explanation_image_1').attr('src', image_path + images[form_name].image1);
            $Container.find('#explanation_image_2').attr('src', image_path + images[form_name].image2);
            $Container.find('#explanation_image').removeClass(hidden_class);
        }
    };

    return {
        request     : requestTradeAnalysis,
        getActiveTab: getActiveTab,
        digit_info  : function() {
            return trading_digit_info;
        },
        bindAnalysisTabEvent: bindAnalysisTabEvent,
    };
})();

module.exports = {
    TradingAnalysis_Beta: TradingAnalysis_Beta,
};
