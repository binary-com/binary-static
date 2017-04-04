const TradingAnalysis_Beta      = require('./analysis').TradingAnalysis_Beta;
const TradingEvents_Beta        = require('./event').TradingEvents_Beta;
const Message_Beta              = require('./message').Message_Beta;
const Price_Beta                = require('./price').Price_Beta;
const forgetTradingStreams_Beta = require('./process').forgetTradingStreams_Beta;
const addEventListenerForm      = require('../common').addEventListenerForm;
const chartFrameCleanup         = require('../common').chartFrameCleanup;
const showFormOverlay           = require('../common').showFormOverlay;
const showPriceOverlay          = require('../common').showPriceOverlay;
const displayCurrencies         = require('../currency').displayCurrencies;
const Defaults                  = require('../defaults').Defaults;
const Notifications             = require('../notifications').Notifications;
const Symbols                   = require('../symbols').Symbols;
const PortfolioInit             = require('../../user/account/portfolio/portfolio.init');
const ViewPopup                 = require('../../user/view_popup/view_popup');
const BinaryPjax                = require('../../../base/binary_pjax');
const State                     = require('../../../base/storage').State;
const jpClient                  = require('../../../common_functions/country_base').jpClient;
const Guide                     = require('../../../common_functions/guide');
const ResizeSensor              = require('../../../../lib/resize-sensor');

const TradePage_Beta = (function() {
    let events_initialized = 0;
    State.remove('is_beta_trading');

    const onLoad = function() {
        const is_jp_client = jpClient();
        if (is_jp_client) {
            BinaryPjax.load('multi_barriers_trading');
            return;
        }
        State.set('is_beta_trading', true);
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

        BinarySocket.send({ payout_currencies: 1 }).then(() => {
            displayCurrencies();
            Symbols.getSymbols(1);
        });

        if (document.getElementById('websocket_form')) {
            addEventListenerForm();
            if (!is_jp_client) {
                new ResizeSensor($('.col-left .content-tab-container, #contract_prices_container'), adjustAnalysisColumnHeight);
                new ResizeSensor($('.col-right'), moreTabsHandler);
            }
        }

        // Walktrough Guide
        Guide.init({
            script: 'trading',
        });
        TradingAnalysis_Beta.bindAnalysisTabEvent();

        ViewPopup.viewButtonOnClick('#contract_confirmation_container');
    };

    const adjustAnalysisColumnHeight = function() {
        let sumHeight = 0;
        if (window.innerWidth > 767) {
            $('.col-left').children().each(function() {
                if ($(this).is(':visible')) sumHeight += $(this).outerHeight(true);
            });
        } else {
            sumHeight = 'auto';
        }
        $('#trading_analysis_content').height(sumHeight);
    };

    const moreTabsHandler = function($ul) {
        if (!$ul) $ul = $('#analysis_tabs');
        const seeMoreClass  = 'see-more',
            moreTabsClass = 'more-tabs',
            maxWidth      = $ul.outerWidth();
        let totalWidth = 0;

        // add seeMore tab
        let $seeMore = $ul.find('li.' + seeMoreClass);
        if ($seeMore.length === 0) {
            $seeMore = $('<li class="tm-li ' + seeMoreClass + '"><a class="tm-a" href="javascript:;"><span class="caret-down"></span></a></li>');
            $ul.append($seeMore);
        }
        $seeMore.removeClass('active');

        // add moreTabs container
        let $moreTabs = $ul.find('.' + moreTabsClass);
        if ($moreTabs.length === 0) {
            $moreTabs = $('<div class="' + moreTabsClass + '" />').appendTo($seeMore);
        } else {
            $moreTabs.find('>li').each(function(index, tab) {
                $(tab).insertBefore($seeMore);
            });
        }
        $moreTabs.css('top', $ul.find('li:visible').outerHeight() - 1).unbind('click').click(function() { hideDropDown('fast'); });

        // move additional tabs to moreTabs
        const $visibleTabs = $ul.find('>li:visible');
        $visibleTabs.each(function(index, tab) {
            totalWidth += $(tab).outerWidth(true);
        });
        let resultWidth = totalWidth;
        while (resultWidth >= maxWidth) {
            const $thisTab = $ul.find('>li:not(.' + seeMoreClass + '):visible').last();
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
        const showDropDown = function() {
            $moreTabs.slideDown();
            if ($seeMore.find('.over').length === 0) {
                $('<div/>', { class: 'over' }).insertBefore($seeMore.find('>a'));
                $seeMore.find('.over').width($seeMore.width());
            }
            $seeMore.addClass('open');
        };
        const hideDropDown = function(duration) {
            $moreTabs.slideUp(duration || 400, function() {
                $seeMore.removeClass('open');
            });
        };
        let timeout;
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

    const reload = function() {
        sessionStorage.removeItem('underlying');
        window.location.reload();
    };

    const onUnload = function() {
        State.remove('is_beta_trading');
        events_initialized = 0;
        forgetTradingStreams_Beta();
        BinarySocket.clear();
        Defaults.clear();
        PortfolioInit.onUnload();
        chartFrameCleanup();
    };

    const onDisconnect = function() {
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

module.exports = TradePage_Beta;
