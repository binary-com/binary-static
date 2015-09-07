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
function requestTradeAnalysis() {
    'use strict';
    $.ajax({
        method: 'POST',
        url: page.url.url_for('trade/trading_analysis'),
        data: {
            underlying: sessionStorage.getItem('underlying'),
            formname: sessionStorage.getItem('formname'),
            contract_category: Offerings.form(),
            barrier: Offerings.barrier()
        }
    })
    .done(function(data) {
        var contentId = document.getElementById('trading_bottom_content');
        contentId.innerHTML = data;
        sessionStorage.setItem('currentAnalysisTab', getActiveTab());
        bindAnalysisTabEvent();
        loadAnalysisTab();
    });
}

/*
 * This function bind event to link elements of bottom content
 * navigation
 */
function bindAnalysisTabEvent() {
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
}

/*
 * This function handles all the functionality on how to load
 * tab according to current paramerted
 */
function loadAnalysisTab() {
    'use strict';
    var currentTab = getActiveTab(),
        currentLink = document.querySelector('#' + currentTab + ' a'),
        contentId = document.getElementById(currentTab + '-content');

    var analysisNavElement = document.querySelector('#trading_bottom_content #betsBottomPage');
    toggleActiveNavMenuElement(analysisNavElement, currentLink.parentElement);
    toggleActiveAnalysisTabs();

    if (currentTab === 'tab_graph') {
        BetAnalysis.tab_live_chart.reset();
        BetAnalysis.tab_live_chart.render(true);
    } else {
        var url = currentLink.getAttribute('href');
        $.ajax({
            method: 'GET',
            url: url,
        })
        .done(function(data) {
            contentId.innerHTML = data;
        });
    }
}

/*
 * function to toggle the active element for analysis menu
 */
function toggleActiveAnalysisTabs() {
    'use strict';
    var currentTab = getActiveTab(),
        analysisContainer = document.getElementById('bet_bottom_content');

    if (analysisContainer) {
        var childElements = analysisContainer.children,
            currentTabElement = document.getElementById(currentTab + '-content'),
            classes = currentTabElement.classList;

        for (var i = 0, len = childElements.length; i < len; i++){
            childElements[i].classList.remove('selectedTab');
            childElements[i].classList.add('invisible');
        }

        classes.add('selectedTab');
        classes.remove('invisible');
    }
}

/*
 * get the current active tab if its visible i.e allowed for current parameters
 */
function getActiveTab() {
    var selectedTab = sessionStorage.getItem('currentAnalysisTab') || 'tab_explanation',
        selectedElement = document.getElementById(selectedTab);

    if (selectedElement && selectedElement.classList.contains('invisible')) {
        selectedTab = 'tab_explanation';
        sessionStorage.setItem('currentAnalysisTab', 'tab_explanation');
    }

    return selectedTab;
}
