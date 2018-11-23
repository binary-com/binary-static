const Dropdown          = require('@binary-com/binary-style').selectDropdown;
const TradingAnalysis   = require('./analysis');
const commonTrading     = require('./common');
const cleanupChart      = require('./charts/webtrader_chart').cleanupChart;
const displayCurrencies = require('./currency');
const Defaults          = require('./defaults');
const TradingEvents     = require('./event');
const Price             = require('./price');
const Process           = require('./process');
const ViewPopup         = require('../user/view_popup/view_popup');
const Client            = require('../../base/client');
const Header            = require('../../base/header');
const BinarySocket      = require('../../base/socket');
const isEuCountry       = require('../../common/country_base').isEuCountry;
const Guide             = require('../../common/guide');
const localize          = require('../../../_common/localize').localize;
const State             = require('../../../_common/storage').State;
const createElement     = require('../../../_common/utility').createElement;
const getPropertyValue  = require('../../../_common/utility').getPropertyValue;

const TradePage = (() => {
    let events_initialized = 0;
    State.remove('is_trading');

    const onLoad = () => {
        BinarySocket.wait('authorize').then(() => {
            init();
        });
    };

    const init = () => {
        State.set('is_trading', true);
        Price.clearFormId();
        if (events_initialized === 0) {
            events_initialized = 1;
            TradingEvents.init();
        }

        BinarySocket.wait('authorize').then(() => {
            Header.displayAccountStatus();
            if (Client.get('is_virtual')) {
                Header.upgradeMessageVisibility(); // To handle the upgrade buttons visibility
            }
            Client.activateByClientType('trading_socket_container');
            BinarySocket.send({ payout_currencies: 1 }).then(() => {
                displayCurrencies();
                Dropdown('#currency', true);
                if (document.getElementById('multiplier_currency').tagName === 'SELECT') {
                    Dropdown('#multiplier_currency', true);
                }
                Process.processActiveSymbols();

                const $currency = $('.currency');

                // if currency symbol is span, restore back from custom dropdown
                if ($currency.is('span') && $currency.parent('div.select').length) {
                    $currency.parent().replaceWith(() => {
                        const curr_element = $currency;
                        return curr_element;
                    });
                    if ($currency.next().attr('id') === $currency.attr('id')) $currency.next().eq(0).remove();
                }
            });

            const is_logged_in = Client.isLoggedIn();
            const required_api_calls = ['website_status', 'landing_company'];
            if (is_logged_in) {
                required_api_calls.push('get_account_status');
            }
            
            BinarySocket.wait(...required_api_calls).then((response) => {
                if (isEuCountry()) {
                    const isMaltainvest = () => Client.get('landing_company_shortcode') === 'maltainvest';
                    const account_status = (getPropertyValue(response, ['get_account_status', 'status']) || []);
                    const isProfessional = () => account_status.includes('professional');
                    const hasRequestedProfessional = () => account_status.includes('professional_requested');
                    // show MFSA message to MF non-professional clients or logged out EU clients
                    if (!is_logged_in || (isMaltainvest() && !isProfessional())) {
                        const mfsa_message = $('.mfsa_message');
                        if (hasRequestedProfessional()) {
                            const div_container = createElement('div', { class: 'notice-msg center-text gr-parent gr-child' });
                            const p_notice = createElement('p', { text: localize('Your application to be treated as a professional client is being processed.') });
                            div_container.appendChild(p_notice);
                            mfsa_message.html(div_container.outerHTML);
                        }
                        mfsa_message
                            .removeClass('container')
                            .addClass('margin-bottom-40')
                            .slideDown(300);
                    }
                }
            });
        });

        if (document.getElementById('websocket_form')) {
            commonTrading.addEventListenerForm();
        }

        // Walk-through Guide
        Guide.init({
            script: 'trading',
        });
        TradingAnalysis.bindAnalysisTabEvent();

        ViewPopup.viewButtonOnClick('#contract_confirmation_container');
    };

    const reload = () => {
        sessionStorage.removeItem('underlying');
        window.location.reload();
    };

    const onUnload = () => {
        if (!/trading/.test(window.location.href)) {
            Header.hideNotification('MF_RETAIL_MESSAGE');
        }
        State.remove('is_trading');
        events_initialized = 0;
        Process.forgetTradingStreams();
        BinarySocket.clear();
        Defaults.clear();
        cleanupChart();
        commonTrading.clean();
        BinarySocket.clear('active_symbols');
        TradingAnalysis.onUnload();
    };

    const onDisconnect = () => {
        commonTrading.showPriceOverlay();
        commonTrading.showFormOverlay();
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

module.exports = TradePage;
