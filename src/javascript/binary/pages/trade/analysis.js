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

var TradingAnalysis = (function() {
    var trading_digit_info, tab_japan_info;

    var requestTradeAnalysis = function() {
        var contentId = document.getElementById('trading_bottom_content');
        var formName = $('#contract_form_name_nav').find('.a-active').attr('id');
        if (formName === 'matchdiff') {
          formName = 'digits';
        }
        contentId.innerHTML =
          '<div class="content-tab-container page-section">' +
            '<div class="tab-menu">' +
              '<div class="tab-menu-wrap grd-container">' +
                '<ul id="betsBottomPage" class="tm-ul">' +
                  '<li id="tab_portfolio" class="tm-li invisible first">' +
                    '<a href="#tab_portfolio" class="tm-a first">' + text.localize('Portfolio') + '</a>' +
                  '</li>' +
                  '<li id="tab_graph" class="tm-li first">' +
                    '<a href="#tab_graph" class="tm-a first">' + text.localize('Chart') + '</a>' +
                  '</li>' +
                  '<li id="tab_explanation" class="tm-li active">' +
                    '<a href="' + page.url.url_for('trade/bet_explanation') + '&underlying_symbol=' + $('#underlying').val() +
                    '&form_name=' + formName +
                    '" class="tm-a">' + text.localize('Explanation') + '</a>' +
                  '</li>' +
                  '<li id="tab_last_digit" class="invisible tm-li">' +
                    '<a href="#" class="tm-a">' +
                    text.localize('Last Digit Stats') + '</a>' +
                  '</li>' +
                  '<li id="tab_japan_info" class="invisible tm-li last">' +
                    '<a href="#" class="tm-a">' + text.localize('Prices') + '</a>' +
                  '</li>' +
                '</ul>' +
              '</div>' +
            '</div>' +
            '<div class="tab-content grd-container">' +
              '<div class="tab-content-wrapper" id="bet_bottom_content">' +
                '<div id="tab_portfolio-content" class="toggle-content invisible "></div>' +
                '<div id="tab_graph-content" class="toggle-content invisible">' +
                  '<div id="trade_live_chart"></div>' +
                '</div>' +
                '<div id="tab_explanation-content" class="toggle-content selectedTab"></div>' +
                '<div id="tab_last_digit-content" class="toggle-content invisible "></div>' +
                '<div id="tab_japan_info-content" class="toggle-content invisible "></div>' +
              '</div>' +
            '</div>' +
          '</div>';
        if (formName === 'digits' || formName === 'overunder' || formName === 'evenodd') {
            $('#tab_last_digit').removeClass("invisible");
        }
        sessionStorage.setItem('currentAnalysisTab', getActiveTab());
        bindAnalysisTabEvent();
        loadAnalysisTab();
    };

    /*
     * This function bind event to link elements of bottom content
     * navigation
     */
    var bindAnalysisTabEvent = function() {
        'use strict';
        var analysisNavElement = document.querySelector('#trading_bottom_content #betsBottomPage');
        if (analysisNavElement) {
            analysisNavElement.addEventListener('click', function(e) {
                if (e.target && e.target.nodeName === 'A') {
                    e.preventDefault();

                    var clickedLink = e.target,
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
    var loadAnalysisTab = function() {
        'use strict';
        var currentTab = getActiveTab(),
            currentLink = document.querySelector('#' + currentTab + ' a'),
            contentId = document.getElementById(currentTab + '-content');

        var analysisNavElement = document.querySelector('#trading_bottom_content #betsBottomPage');
        toggleActiveNavMenuElement(analysisNavElement, currentLink.parentElement);
        toggleActiveAnalysisTabs();

        tab_japan_info = new BetAnalysis.JapanInfo();
        BetAnalysis.Portfolio.init();

        if(currentTab === 'tab_portfolio'){
            BetAnalysis.Portfolio.show();
        } else if (currentTab === 'tab_japan_info') {
            tab_japan_info.show();
        } else {
            BetAnalysis.Portfolio.hide();
            tab_japan_info.hide();
            if (currentTab === 'tab_graph') {
                if (document.getElementById('underlying')){
                    showHighchart();
                } else {
                    BetAnalysis.tab_live_chart.reset();
                    BetAnalysis.tab_live_chart.render(true);
                }
            } else {
                if (currentTab == 'tab_last_digit') {
                    var underlying = $('[name=underlying] option:selected').val() || $('#underlying option:selected').val();
                    var tick = $('[name=tick_count]').val() || 100;
                    trading_digit_info = TradingAnalysis.tab_last_digitws;
                    var request = JSON.parse('{"ticks_history":"'+ underlying +'",'+
                                              '"end": "latest",'+
                                              '"count": '+ tick +','+
                                              '"req_id": 1}');
                    BinarySocket.send(request);
                } else{
                    var url = currentLink.getAttribute('href') ;
                    $.ajax({
                        method: 'GET',
                        url: url,
                    })
                    .done(function(data) {
                        contentId.innerHTML = data;
                        if(currentTab === 'tab_explanation') {
                            showExplanation(currentLink.href);
                        } else if (currentTab == 'tab_last_digit') {
                            trading_digit_info = new BetAnalysis.DigitInfo();
                            trading_digit_info.on_latest();
                            trading_digit_info.show_chart(sessionStorage.getItem('underlying'));
                        }

                    });
                }
            }
        }

    };

    /*
     * function to toggle the active element for analysis menu
     */
    var toggleActiveAnalysisTabs = function() {
        'use strict';
        var currentTab = getActiveTab(),
            analysisContainer = document.getElementById('bet_bottom_content');

        if (analysisContainer) {
            trading_digit_info = undefined;
            var childElements = analysisContainer.children,
                currentTabElement = document.getElementById(currentTab + '-content'),
                classes = currentTabElement.classList;

            for (var i = 0, len = childElements.length; i < len; i++) {
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
    var getActiveTab = function() {
        var selectedTab = sessionStorage.getItem('currentAnalysisTab') || (isJapanTrading() ? 'tab_portfolio' : window.chartAllowed ? 'tab_graph' : 'tab_explanation'),
            selectedElement = document.getElementById(selectedTab);

        if (selectedElement && selectedElement.classList.contains('invisible') &&
            !(selectedTab === 'tab_portfolio' && BetAnalysis.Portfolio.isActive())) {
            selectedTab = window.chartAllowed ? 'tab_graph' : 'tab_explanation';
            sessionStorage.setItem('currentAnalysisTab', selectedTab);
        }

        return selectedTab;
    };

    /*
     * handle the display of proper explanation based on parameters
     */
    var showExplanation = function(href) {
        var options = new URL(href).params_hash();
        var form_name    = options.form_name || 'risefall',
            show_image   = options.show_image   ? options.show_image   > 0 : true,
            show_winning = options.show_winning ? options.show_winning > 0 : true,
            show_explain = true,
            hidden_class = 'invisible',
            $Container   = $('#tab_explanation-content');

        if(show_winning) {
            $Container.find('#explanation_winning, #winning_' + form_name).removeClass(hidden_class);
        }

        if(show_explain) {
            $Container.find('#explanation_explain, #explain_' + form_name).removeClass(hidden_class);
        }

        var images = {
            risefall : {
                image1: 'rise-fall-1.svg',
                image2: 'rise-fall-2.svg',
            },
            higherlower : {
                image1: 'higher-lower-1.svg',
                image2: 'higher-lower-2.svg',
            },
            touchnotouch : {
                image1: 'touch-notouch-1.svg',
                image2: 'touch-notouch-2.svg',
            },
            endsinout : {
                image1: 'in-out-1.svg',
                image2: 'in-out-2.svg',
            },
            staysinout : {
                image1: 'in-out-3.svg',
                image2: 'in-out-4.svg',
            },
            updown : {
                image1: 'up-down-1.svg',
                image2: 'up-down-2.svg',
            },
            spreads : {
                image1: 'spreads-1.svg',
                image2: 'spreads-2.svg',
            },
            evenodd : {
                image1: 'evenodd-1.svg',
                image2: 'evenodd-2.svg',
            },
            overunder : {
                image1: 'overunder-1.svg',
                image2: 'overunder-2.svg',
            },
        };

        if(show_image && images.hasOwnProperty(form_name)) {
            var image_path = page.url.url_for_static('images/pages/trade-explanation/');
            $Container.find('#explanation_image_1').attr('src', image_path + images[form_name].image1);
            $Container.find('#explanation_image_2').attr('src', image_path + images[form_name].image2);
            $Container.find('#explanation_image').removeClass(hidden_class);
        }
    };

    return {
        request: requestTradeAnalysis,
        digit_info: function() {
            return trading_digit_info;
        },
        // Should be removed with legacy trading.
        set_digit_info: function(obj) {
            trading_digit_info = obj;
        },
        japan_info: function() {
            return tab_japan_info;
        },
        tab_portfolio: function() {
            return tab_portfolio;
        },
        getActiveTab: getActiveTab
    };

})();
