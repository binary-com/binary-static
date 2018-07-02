const MBContract          = require('./mb_contract');
const MBDisplayCurrencies = require('./mb_currency');
const MBDefaults          = require('./mb_defaults');
const MBTradingEvents     = require('./mb_event');
const MBPrice             = require('./mb_price');
const MBProcess           = require('./mb_process');
const cleanupChart        = require('../trade/charts/webtrader_chart').cleanupChart;
const BinaryPjax          = require('../../base/binary_pjax');
const Client              = require('../../base/client');
const BinarySocket        = require('../../base/socket');
const getDecimalPlaces    = require('../../common/currency').getDecimalPlaces;
const JapanPortfolio      = require('../../japan/portfolio');
const getElementById      = require('../../../_common/common_functions').getElementById;
const getLanguage         = require('../../../_common/language').get;
const localize            = require('../../../_common/localize').localize;
const State               = require('../../../_common/storage').State;
const urlFor              = require('../../../_common/url').urlFor;
const findParent          = require('../../../_common/utility').findParent;

const MBTradePage = (() => {
    let events_initialized = 0;
    State.remove('is_mb_trading');

    const onLoad = () => {
        State.set('is_mb_trading', true);
        BinarySocket.wait('authorize').then(init);
        if (!Client.isLoggedIn()) {
            BinarySocket.wait('website_status').then(() => {
                BinarySocket.send({ landing_company: State.getResponse('website_status.clients_country') });
            });
        }
    };

    const init = () => {
        if (/^(malta|iom)$/.test(Client.get('landing_company_shortcode'))) {
            if (getLanguage() === 'JA') {
                $('#content').empty().html($('<div/>', { class: 'container' }).append($('<p/>', { class: 'notice-msg center-text', text: localize('This page is not available in the selected language.') })));
            } else {
                BinaryPjax.load(urlFor('trading'));
            }
            return;
        }
        if (Client.isJPClient()) {
            disableTrading();
            $('#panel').remove();
        } else {
            MBDefaults.set('disable_trading', 0);
            $('#ja-panel').remove();
            showCurrency(Client.get('currency'));
        }

        BinarySocket.wait('landing_company', 'active_symbols').then(() => {
            if (events_initialized === 0) {
                events_initialized = 1;
                MBTradingEvents.init();
            }
        });

        BinarySocket.send({ payout_currencies: 1 }).then(() => {
            MBDisplayCurrencies();
            MBProcess.getSymbols();
        });

        State.set('is_chart_allowed', true);
        State.set('ViewPopup.onDisplayed', MBPrice.hidePriceOverlay);
        $('.container').css('max-width', '1200px');
    };

    const showCurrency = (currency) => {
        if (currency) {
            const el_payout_amount = getElementById('payout_amount');
            if (!new RegExp(currency).test(el_payout_amount.textContent)) {
                el_payout_amount.textContent += ` (${currency})`;
            }

            if (getDecimalPlaces(currency) > 2) {
                const el_category      = getElementById('category');
                const payout_wrapper   = findParent(el_payout_amount, '.gr-3');
                const category_wrapper = findParent(el_category, '.gr-9');
                if (payout_wrapper && category_wrapper) {
                    payout_wrapper.classList.remove('gr-3');
                    category_wrapper.classList.remove('gr-9');
                    payout_wrapper.classList.add('gr-4');
                    category_wrapper.classList.add('gr-8');
                }
            }
        }
    };

    const disableTrading = () => {
        MBDefaults.set('disable_trading', 1);
        $('#allow').removeClass('selected');
        $('#disallow').addClass('selected');
    };

    const reload = () => {
        window.location.reload();
    };

    const onUnload = () => {
        cleanupChart();
        State.set('is_chart_allowed', false);
        JapanPortfolio.hide();
        State.remove('is_mb_trading');
        events_initialized = 0;
        MBContract.onUnload();
        MBPrice.onUnload();
        MBProcess.onUnload();
        BinarySocket.clear('active_symbols');
        State.remove('ViewPopup.onDisplayed');
        $('.container').css('max-width', '');
    };

    const onDisconnect = () => {
        MBPrice.showPriceOverlay();
        cleanupChart();
        onLoad();
    };

    return {
        onLoad,
        reload,
        onUnload,
        onDisconnect,
    };
})();

module.exports = MBTradePage;
