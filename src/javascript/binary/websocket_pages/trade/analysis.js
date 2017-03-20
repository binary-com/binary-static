const DigitInfoWS                = require('./charts/digit_infows').DigitInfoWS;
const JapanPortfolio             = require('../../../binary_japan/trade_japan/portfolio').JapanPortfolio;
const State                      = require('../../base/storage').State;
const getLanguage                = require('../../base/language').get;
const toggleActiveNavMenuElement = require('./common').toggleActiveNavMenuElement;
const showHighchart              = require('./common').showHighchart;
const Url                        = require('../../base/url');
const elementInnerHtml           = require('../../common_functions/common_functions').elementInnerHtml;

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

const TradingAnalysis = (function() {
    const trading_digit_info = new DigitInfoWS();

    const requestTradeAnalysis = function() {
        let formName = State.get('is_mb_trading') ? $('#category').val() :
                                                    $('#contract_form_name_nav').find('.a-active').attr('id');
        if (formName === 'matchdiff') {
            formName = 'digits';
        }
        if (formName === 'callput') {
            formName = 'higherlower';
        }
        $('#tab_explanation').find('a').attr('href',  Url.urlFor('trade/bet_explanation', 'underlying_symbol=' + $('#underlying').val() + '&form_name=' + formName));
        if (formName === 'digits' || formName === 'overunder' || formName === 'evenodd') {
            $('#tab_last_digit').removeClass('invisible');
        } else {
            $('#tab_last_digit').addClass('invisible');
        }
        sessionStorage.setItem('currentAnalysisTab', getActiveTab());
        loadAnalysisTab();
    };

    /*
     * This function bind event to link elements of bottom content
     * navigation
     */
    const bindAnalysisTabEvent = function() {
        'use strict';

        const analysisNavElement = document.querySelector('#trading_bottom_content #betsBottomPage');
        if (analysisNavElement) {
            analysisNavElement.addEventListener('click', function(e) {
                if (e.target && e.target.nodeName === 'A') {
                    e.preventDefault();

                    const clickedLink = e.target,
                        clickedElement = clickedLink.parentElement,
                        isTabActive = clickedElement.classList.contains('active');

                    sessionStorage.setItem('currentAnalysisTab', clickedElement.id);

                    if (!isTabActive) {
                        loadAnalysisTab();
                    }
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
            currentLink = document.querySelector('#' + currentTab + ' a'),
            contentId = document.getElementById(currentTab + '-content');

        const analysisNavElement = document.querySelector('#trading_bottom_content #betsBottomPage');
        toggleActiveNavMenuElement(analysisNavElement, currentLink.parentElement);
        toggleActiveAnalysisTabs();

        JapanPortfolio.init();
        if (currentTab === 'tab_portfolio') {
            JapanPortfolio.show();
        } else {
            JapanPortfolio.hide();
            if (currentTab === 'tab_graph') {
                showHighchart();
            } else if (currentTab === 'tab_last_digit') {
                const underlying = $('[name=underlying] option:selected').val() || $('#underlying').find('option:selected').val();
                const tick = $('[name=tick_count]').val() || 100;
                BinarySocket.send({
                    ticks_history: underlying,
                    count        : tick + '',
                    end          : 'latest',
                    req_id       : 1,
                });
            } else {
                $.ajax({
                    method: 'GET',
                    url   : currentLink.getAttribute('href'),
                })
                    .done(function(data) {
                        elementInnerHtml(contentId, data);
                        if (currentTab === 'tab_explanation') {
                            showExplanation(currentLink.href);
                        }
                    });
            }
        }
    };

    /*
     * function to toggle the active element for analysis menu
     */
    const toggleActiveAnalysisTabs = function() {
        'use strict';

        const currentTab = getActiveTab(),
            analysisContainer = document.getElementById('bet_bottom_content');

        if (analysisContainer) {
            const childElements = analysisContainer.children,
                currentTabElement = document.getElementById(currentTab + '-content'),
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
        let selectedTab = sessionStorage.getItem('currentAnalysisTab') || (State.get('is_mb_trading') ? 'tab_portfolio' : window.chartAllowed ? 'tab_graph' : 'tab_explanation');
        const selectedElement = document.getElementById(selectedTab);

        if (selectedElement && selectedElement.classList.contains('invisible') &&
            !(selectedTab === 'tab_portfolio' && JapanPortfolio.isActive())) {
            selectedTab = window.chartAllowed ? 'tab_graph' : 'tab_explanation';
            sessionStorage.setItem('currentAnalysisTab', selectedTab);
        }

        return selectedTab;
    };

    /*
     * handle the display of proper explanation based on parameters
     */
    const showExplanation = function(href) {
        const options = Url.paramsHash(href);
        const form_name    = options.formname || 'risefall';
        const show_image   = options.show_image   ? options.show_image   > 0 : true;
        const show_winning = options.show_winning ? options.show_winning > 0 : true;
        const show_explain = true;
        const hidden_class = 'invisible';
        const $Container   = $('#tab_explanation-content');

        if (show_winning) {
            $Container.find('#explanation_winning, #winning_' + form_name).removeClass(hidden_class);
        }

        if (show_explain) {
            $Container.find('#explanation_explain, #explain_' + form_name).removeClass(hidden_class);
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
            const image_path = Url.urlForStatic('images/pages/trade-explanation/' + (getLanguage() === 'JA' ? 'ja/' : ''));
            $Container.find('#explanation_image_1').attr('src', image_path + images[form_name].image1);
            $Container.find('#explanation_image_2').attr('src', image_path + images[form_name].image2);
            $Container.find('#explanation_image').removeClass(hidden_class);
        }
    };

    return {
        request   : requestTradeAnalysis,
        digit_info: function() {
            return trading_digit_info;
        },
        getActiveTab        : getActiveTab,
        bindAnalysisTabEvent: bindAnalysisTabEvent,
    };
})();

module.exports = {
    TradingAnalysis: TradingAnalysis,
};
