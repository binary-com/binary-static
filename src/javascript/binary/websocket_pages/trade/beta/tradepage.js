var TradingAnalysis_Beta = require('./analysis').TradingAnalysis_Beta;
var TradingEvents_Beta   = require('./event').TradingEvents_Beta;
var Message_Beta         = require('./message').Message_Beta;
var Price_Beta           = require('./price').Price_Beta;
var forgetTradingStreams_Beta = require('./process').forgetTradingStreams_Beta;
var displayCurrencies    = require('../currency').displayCurrencies;
var Defaults             = require('../defaults').Defaults;
var Notifications        = require('../notifications').Notifications;
var Symbols              = require('../symbols').Symbols;
var Content              = require('../../../common_functions/content').Content;
var Guide                = require('../../../common_functions/guide').Guide;
var japanese_client      = require('../../../common_functions/country_base').japanese_client;
var PortfolioWS          = require('../../user/account/portfolio/portfolio.init').PortfolioWS;
var ResizeSensor         = require('../../../../lib/resize-sensor');
var State                = require('../../../base/storage').State;
var url_for              = require('../../../base/url').url_for;
var showPriceOverlay     = require('../common').showPriceOverlay;
var showFormOverlay      = require('../common').showFormOverlay;
var addEventListenerForm = require('../common').addEventListenerForm;
var chartFrameCleanup    = require('../common').chartFrameCleanup;

var TradePage_Beta = (function() {
    var events_initialized = 0;
    State.remove('is_beta_trading');

    var onLoad = function() {
        var is_japanese_client = japanese_client();
        if (is_japanese_client && /\/trading(|_beta)\.html/i.test(window.location.pathname)) {
            window.location.href = url_for('multi_barriers_trading');
            return;
        } else if (!is_japanese_client && /\/multi_barriers_trading\.html/.test(window.location.pathname)) {
            window.location.href = url_for('trading');
            return;
        }
        State.set('is_beta_trading', true);
        if (sessionStorage.getItem('currencies')) {
            displayCurrencies();
        }
        BinarySocket.init({
            onmessage: function(msg) {
                Message_Beta.process(msg);
            },
            onopen: function() {
                Notifications.hide('CONNECTION_ERROR');
            },
        });
        Price_Beta.clearFormId();
        if (events_initialized === 0) {
            events_initialized = 1;
            TradingEvents_Beta.init();
        }
        Content.populate();

        if (sessionStorage.getItem('currencies')) {
            displayCurrencies();
            Symbols.getSymbols(1);
        } else {
            BinarySocket.send({ payout_currencies: 1 });
        }

        if (document.getElementById('websocket_form')) {
            addEventListenerForm();
            if (!is_japanese_client) {
                new ResizeSensor($('.col-left .content-tab-container, #contract_prices_container'), adjustAnalysisColumnHeight);
                new ResizeSensor($('.col-right'), moreTabsHandler);
            }
        }

        // Walktrough Guide
        Guide.init({
            script: 'trading',
        });
        TradingAnalysis_Beta.bindAnalysisTabEvent();
    };

    var adjustAnalysisColumnHeight = function() {
        var sumHeight = 0;
        if (window.innerWidth > 767) {
            $('.col-left').children().each(function() {
                if ($(this).is(':visible')) sumHeight += $(this).outerHeight(true);
            });
        } else {
            sumHeight = 'auto';
        }
        $('#trading_analysis_content').height(sumHeight);
    };

    var moreTabsHandler = function($ul) {
        if (!$ul) $ul = $('#analysis_tabs');
        var $visibleTabs  = $ul.find('>li:visible'),
            seeMoreClass  = 'see-more',
            moreTabsClass = 'more-tabs',
            maxWidth      = $ul.outerWidth(),
            totalWidth    = 0;

        // add seeMore tab
        var $seeMore = $ul.find('li.' + seeMoreClass);
        if ($seeMore.length === 0) {
            $seeMore = $('<li class="tm-li ' + seeMoreClass + '"><a class="tm-a" href="javascript:;"><span class="caret-down"></span></a></li>');
            $ul.append($seeMore);
        }
        $seeMore.removeClass('active');

        // add moreTabs container
        var $moreTabs = $ul.find('.' + moreTabsClass);
        if ($moreTabs.length === 0) {
            $moreTabs = $('<div class="' + moreTabsClass + '" />').appendTo($seeMore);
        } else {
            $moreTabs.find('>li').each(function(index, tab) {
                $(tab).insertBefore($seeMore);
            });
        }
        $moreTabs.css('top', $ul.find('li:visible').outerHeight() - 1).unbind('click').click(function() { hideDropDown('fast'); });

        // move additional tabs to moreTabs
        $visibleTabs = $ul.find('>li:visible');
        $visibleTabs.each(function(index, tab) {
            totalWidth += $(tab).outerWidth(true);
        });
        var resultWidth = totalWidth;
        while (resultWidth >= maxWidth) {
            var $thisTab = $ul.find('>li:not(.' + seeMoreClass + '):visible').last();
            resultWidth -= $thisTab.outerWidth(true);
            $thisTab.prependTo($moreTabs);
        }

        if ($moreTabs.children().length === 0) {
            $seeMore.hide();
            return;
        }

        $seeMore.show();
        if ($moreTabs.find('>li.active').length > 0) {
            $seeMore.addClass('active');
        }

        // drop down behaviour
        function showDropDown() {
            $moreTabs.slideDown();
            if ($seeMore.find('.over').length === 0) {
                $('<div/>', { class: 'over' }).insertBefore($seeMore.find('>a'));
                $seeMore.find('.over').width($seeMore.width());
            }
            $seeMore.addClass('open');
        }
        function hideDropDown(duration) {
            $moreTabs.slideUp(duration || 400, function() {
                $seeMore.removeClass('open');
            });
        }
        var timeout;
        $seeMore.find('>a').unbind('click').on('click', function(e) {
            e.stopPropagation();
            if ($moreTabs.is(':visible')) {
                hideDropDown();
                clearTimeout(timeout);
            } else {
                clearTimeout(timeout);
                showDropDown();
                timeout = setTimeout(function() {
                    hideDropDown();
                    clearTimeout(timeout);
                }, 3000);
            }
        });
        $(document).unbind('click').on('click', function() { hideDropDown(); });

        $moreTabs.mouseenter(function() {
            clearTimeout(timeout);
        });

        $moreTabs.mouseleave(function() {
            clearTimeout(timeout);
            timeout = setTimeout(function() {
                hideDropDown();
            }, 1000);
        });
    };

    var reload = function() {
        sessionStorage.removeItem('underlying');
        window.location.reload();
    };

    var onUnload = function() {
        State.remove('is_beta_trading');
        events_initialized = 0;
        forgetTradingStreams_Beta();
        BinarySocket.clear();
        Defaults.clear();
        PortfolioWS.onUnload();
        chartFrameCleanup();
    };

    var onDisconnect = function() {
        showPriceOverlay();
        showFormOverlay();
        chartFrameCleanup();
        onLoad();
    };

    return {
        onLoad      : onLoad,
        reload      : reload,
        onUnload    : onUnload,
        onDisconnect: onDisconnect,
    };
})();

module.exports = {
    TradePage_Beta: TradePage_Beta,
};
