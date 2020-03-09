const React               = require('react');
const ReactDOM            = require('react-dom');
const BinaryPjax          = require('../../base/binary_pjax');
const Client              = require('../../base/client');
const BinarySocket        = require('../../base/socket');
const ServerTime          = require('../../../_common/base/server_time');
const getLanguage         = require('../../../_common/language').get;
const urlFor              = require('../../../_common/url').urlFor;
const urlForStatic        = require('../../../_common/url').urlForStatic;
const SubscriptionManager = require('../../../_common/base/subscription_manager').default;

const DP2P = (() => {
    let shadowed_el_dp2p;

    const onLoad = () => {
        const is_svg = Client.get('landing_company_shortcode') === 'svg';
        const is_show_dp2p = /show_dp2p/.test(window.location.hash);

        if (is_show_dp2p) {
            if (is_svg) {
                require.ensure([], (require) => renderP2P(require('@deriv/p2p')), 'dp2p');
            } else {
                document.getElementById('message_cashier_unavailable').setVisibility(1);
            }
        } else {
            BinaryPjax.load(urlFor('cashier'));
        }

    };

    const renderP2P = (module) => {
        const el_loading = document.getElementById('loading_p2p');
        const el_dp2p_container = document.getElementById('binary_dp2p');
        shadowed_el_dp2p = el_dp2p_container.attachShadow({ mode: 'open' });

        const el_main_css = document.createElement('style');
        // These are styles that are to be injected into the Shadow DOM, so they are in JS and not stylesheets
        // They are to be applied to the `:host` selector
        el_main_css.innerHTML = `
                @import url(${urlForStatic('css/p2p.min.css')});
                :host {
                    --hem: 10px;
                }
                :host .theme--light {
                    --button-primary-default: #2e8836;
                    --button-primary-hover: #14602b;
                    --brand-red-coral: #2a3052;
                    --state-active: #2a3052;
                    --general-section-1: #f2f2f2;
                    --text-general: #333333;
                    --text-profit-success: #2e8836;
                    --text-loss-danger: #ff444f;
                }

                /* overrides components */
                .dc-list__item--selected .dc-list__item-text {
                    color: var(--text-colored-background);
                }
                .dc-button-menu__wrapper
                .dc-button-menu__button:not(.dc-button-menu__button--active) {
                    background-color: #f2f2f2 !important;
                }
                .dc-field-error {
                    color: var(--text-loss-danger);
                }
                .dc-input__field {
                    box-sizing:border-box;
                }
                .dc-button-menu__wrapper
                .dc-button-menu__button--active
                .btn__text {
                    color: #ffffff;
                }
                .dc-table__header {
                    border: none;
                    background: var(--general-section-1);
                }
                .dc-table__row {
                    padding: 0 calc(2.4*var(--hem));
                    border-bottom: 3px solid var(--general-section-1);
                }
                .dc-table__cell {
                    border-bottom: none;
                }
                .dc-tabs {
                    --tab-width: 150px !important;
                }
                .dc-tabs__list {
                    width: fit-content;
                    width: -moz-fit-content;
                }
                .link {
                    color: #e88024 !important;
                    font-weight: bold;
                    text-decoration: none;
                }
                .link:hover {
                    text-decoration: underline;
                    cursor: pointer;
                }

                /* override layouts */
                .deriv-p2p {
                    height: 800px;
                }
                .footer-actions {
                    bottom: calc(18*var(--hem));
                    flex-direction: row-reverse;
                }
                .footer-actions--bordered {
                    bottom: 0 !important;
                }

                /* overrides orders */
                .orders {
                    padding: calc(2.4*var(--hem)) 0;
                }
                .orders__table-row {
                    padding-left: 0;
                }

                /* overrides order-details */
                .order-details__wrapper--inner {
                    height: calc(36*var(--hem));
                    overflow-y: scroll;
                }

                /* overrides buy-sell */
                .buy-sell {
                    margin: 0;
                    padding: calc(1.6*var(--hem)) 0
                }
                .buy-sell__header {
                    padding: 0;
                    border: 1px solid var(--brand-red-coral);
                    border-radius: 5px;
                    margin: calc(0.8*var(--hem)) 0 calc(1.6*var(--hem));
                }
                .buy-sell__dialog {
                    z-index: 2;
                }

                /* overrides my-ads */
                .p2p-my-ads__form-error {
                    color: var(--text-loss-danger);
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
            custom_strings: { email_domain: 'binary.com' },
            lang          : getLanguage(),
            server_time   : ServerTime,
            websocket_api,
        };

        ReactDOM.render(
            React.createElement(module, dp2p_props),
            shadowed_el_dp2p
        );

        shadowed_el_dp2p.prepend(el_main_css);
        el_loading.parentNode.removeChild(el_loading);
        el_dp2p_container.classList.remove('invisible');
    };

    const onUnload = () => {
        ReactDOM.unmountComponentAtNode(shadowed_el_dp2p);
    };

    return {
        onLoad,
        onUnload,
    };
})();

module.exports = DP2P;
