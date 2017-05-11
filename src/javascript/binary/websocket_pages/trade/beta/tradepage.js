const TradingAnalysis_Beta      = require('./analysis');
const TradingEvents_Beta        = require('./event');
const Price_Beta                = require('./price');
const Process_Beta              = require('./process');
const commonTrading             = require('../common');
const chartFrameCleanup         = require('../charts/chart_frame').chartFrameCleanup;
const displayCurrencies         = require('../currency');
const Defaults                  = require('../defaults');
const BinarySocket              = require('../../socket');
const PortfolioInit             = require('../../user/account/portfolio/portfolio.init');
const ViewPopup                 = require('../../user/view_popup/view_popup');
const BinaryPjax                = require('../../../base/binary_pjax');
const State                     = require('../../../base/storage').State;
const jpClient                  = require('../../../common_functions/country_base').jpClient;
const Guide                     = require('../../../common_functions/guide');
const ResizeSensor              = require('../../../../lib/resize-sensor');

const TradePage_Beta = (() => {
    'use strict';

    let events_initialized = 0;
    State.remove('is_beta_trading');

    const onLoad = () => {
        const is_jp_client = jpClient();
        if (is_jp_client) {
            BinaryPjax.load('multi_barriers_trading');
            return;
        }
        State.set('is_beta_trading', true);
        Price_Beta.clearFormId();
        if (events_initialized === 0) {
            events_initialized = 1;
            TradingEvents_Beta.init();
        }

        BinarySocket.send({ payout_currencies: 1 }).then(() => {
            displayCurrencies();
            Process_Beta.processActiveSymbols_Beta();
        });

        if (document.getElementById('websocket_form')) {
            commonTrading.addEventListenerForm();
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

    const adjustAnalysisColumnHeight = () => {
        let sum_height = 0;
        if (window.innerWidth > 767) {
            $('.col-left').children().each(function() {
                if ($(this).is(':visible')) sum_height += $(this).outerHeight(true);
            });
        } else {
            sum_height = 'auto';
        }
        $('#trading_analysis_content').height(sum_height);
    };

    const moreTabsHandler = ($ul) => {
        if (!$ul) $ul = $('#analysis_tabs');
        const see_more_class  = 'see-more';
        const more_tabs_class = 'more-tabs';
        const max_width       = $ul.outerWidth();
        let total_width = 0;

        // add seeMore tab
        let $see_more = $ul.find(`li.${see_more_class}`);
        if ($see_more.length === 0) {
            $see_more = $('<li/>', { class: `tm-li ${see_more_class}` }).append($('<a/>', { class: 'tm-a', href: `${'java'}${'script:;'}` })
                .append($('<span/>', { class: 'caret-down' })));
            $ul.append($see_more);
        }
        $see_more.removeClass('active');

        // add moreTabs container
        let $more_tabs = $ul.find(`.${more_tabs_class}`);
        if ($more_tabs.length === 0) {
            $more_tabs = $('<div/>', { class: more_tabs_class }).appendTo($see_more);
        } else {
            $more_tabs.find('>li').each((index, tab) => {
                $(tab).insertBefore($see_more);
            });
        }
        $more_tabs.css('top', $ul.find('li:visible').outerHeight() - 1).unbind('click').click(() => { hideDropDown('fast'); });

        // move additional tabs to moreTabs
        const $visible_tabs = $ul.find('>li:visible');
        $visible_tabs.each((index, tab) => {
            total_width += $(tab).outerWidth(true);
        });
        let result_width = total_width;
        while (result_width >= max_width) {
            const $thisTab = $ul.find(`>li:not(.${see_more_class}):visible`).last();
            result_width -= $thisTab.outerWidth(true);
            $thisTab.prependTo($more_tabs);
        }

        if ($more_tabs.children().length === 0) {
            $see_more.hide();
            return;
        }

        $see_more.show();
        if ($more_tabs.find('>li.active').length > 0) {
            $see_more.addClass('active');
        }

        // drop down behaviour
        const showDropDown = () => {
            $more_tabs.slideDown();
            if ($see_more.find('.over').length === 0) {
                $('<div/>', { class: 'over' }).insertBefore($see_more.find('>a'));
                $see_more.find('.over').width($see_more.width());
            }
            $see_more.addClass('open');
        };
        const hideDropDown = (duration) => {
            $more_tabs.slideUp(duration || 400, () => {
                $see_more.removeClass('open');
            });
        };
        let timeout;
        $see_more.find('> a').unbind('click').on('click', (e) => {
            e.stopPropagation();
            if ($more_tabs.is(':visible')) {
                hideDropDown();
                clearTimeout(timeout);
            } else {
                clearTimeout(timeout);
                showDropDown();
                timeout = setTimeout(() => {
                    hideDropDown();
                    clearTimeout(timeout);
                }, 3000);
            }
        });
        $(document).unbind('click').on('click', () => { hideDropDown(); });

        $more_tabs.mouseenter(() => {
            clearTimeout(timeout);
        });

        $more_tabs.mouseleave(() => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                hideDropDown();
            }, 1000);
        });
    };

    const reload = () => {
        sessionStorage.removeItem('underlying');
        window.location.reload();
    };

    const onUnload = () => {
        State.remove('is_beta_trading');
        events_initialized = 0;
        Process_Beta.forgetTradingStreams_Beta();
        BinarySocket.clear();
        Defaults.clear();
        PortfolioInit.onUnload();
        chartFrameCleanup();
        commonTrading.clean();
        BinarySocket.clear('active_symbols');
    };

    const onDisconnect = () => {
        commonTrading.showPriceOverlay();
        commonTrading.showFormOverlay();
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
