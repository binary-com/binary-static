const React               = require('react');
const ReactDOM            = require('react-dom');
const Client              = require('../../base/client');
const BinarySocket        = require('../../base/socket');
const ServerTime          = require('../../../_common/base/server_time');
const getLanguage         = require('../../../_common/language').get;
const urlForStatic        = require('../../../_common/url').urlForStatic;
const SubscriptionManager = require('../../../_common/base/subscription_manager').default;

const DP2P = (() => {

    const onLoad = () => {
        const is_svg = Client.get('landing_company_shortcode') === 'svg';
        if (is_svg) {
            require.ensure([], (require) => renderP2P(require('@deriv/p2p')), 'dp2p');
        } else {
            document.getElementById('message_cashier_unavailable').setVisibility(1);
        }
    };

    const renderP2P = (module) => {
        const el_dp2p_container = document.getElementById('binary-dp2p');
        const shadowed_el_dp2p = el_dp2p_container.attachShadow({ mode: 'closed' });

        const el_main_css = document.createElement('style');
        // These are styles that are to be injected into the Shadow DOM, so they are in JS and not stylesheets
        // They are to be applied to the `:host` selector
        el_main_css.innerHTML = `
                @import url(${urlForStatic('css/p2p.min.css')});
                :host {
                    --hem:10px;
                }
                :host .theme--light {
                    --button-primary-default: #2e8836;
                    --button-primary-hover: #14602b;
                    --brand-red-coral: #2a3052;
                    --state-active: #2a3052;
                    --general-section-1: #ffffff;
                    --text-profit-success: #2e8836;
                }

                .dc-button-menu__wrapper
                .dc-button-menu__button:not(.dc-button-menu__button--active) {
                    background-color: #f2f2f2 !important;
                }

                .link {
                    color: #E88024 !important;
                }

                .dc-button-menu__wrapper
                .dc-button-menu__button--active
                .btn__text {
                    color: #ffffff;
                }

                .dc-input__field {
                    box-sizing:border-box;
                }
                .link {
                    color: var(--brand-red-coral);
                    font-weight: bold;
                    text-decoration: none;
                }
                .link:hover {
                    text-decoration: underline;
                    cursor: pointer;
                }
                .deriv-p2p {
                    height: 80vh;
                }
                `;
        el_main_css.rel = 'stylesheet';

        const p2pSubscribe = (request, cb) => {
            // Request object first key will be the msg_type
            const msg_type = Object.keys(request)[0];

            SubscriptionManager.subscribe(msg_type, request, cb);
            return {
                unsubscribe: () => SubscriptionManager.forget(msg_type),
            };
        };

        const websocket_api = {
            send: BinarySocket.send,
            wait: BinarySocket.wait,
            p2pSubscribe,
        };

        const dp2p_props = {
            className: 'theme--light',
            client   : {
                currency             : Client.get('currency'),
                is_virtual           : Client.get('is_virtual'),
                local_currency_config: Client.get('local_currency_config'),
                residence            : Client.get('residence'),
            },
            lang       : getLanguage(),
            server_time: ServerTime,
            websocket_api,
        };

        ReactDOM.render(
            // eslint-disable-next-line no-console
            React.createElement(module, dp2p_props),
            shadowed_el_dp2p
        );

        shadowed_el_dp2p.prepend(el_main_css);
    };

    const onUnload = () => {
        // TODO: Look into clearance
    };

    return {
        onLoad,
        onUnload,
    };
})();

module.exports = DP2P;
