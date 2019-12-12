const ReactDOM     = require('react-dom');
const React        = require('react');
const urlForStatic = require('../../../_common/url').urlForStatic;
const Client       = require('../../base/client');

const DP2P = (() => {

    const onLoad = () => {
        const is_svg = Client.get('landing_company_shortcode') === 'svg';
        if (is_svg) {
            import('@deriv/p2p').then((module) => {
                const el_dp2p_container = document.getElementById('binary-dp2p');
                const shadowed_el_dp2p = el_dp2p_container.attachShadow({ mode: 'closed' });

                // const el_head = document.querySelector('head');
                // const el_main_css = document.createElement('link');
                // el_main_css.href = urlForStatic('css/p2p.min.css');
                // el_main_css.rel = 'stylesheet';
                // el_main_css.type = 'text/css';
                // el_dp2p_container.innerHTML = module.default;

                const el_main_css = document.createElement('style');
                el_main_css.innerHTML = `
                @import url(${urlForStatic('css/p2p.min.css')});
                :host {
                    --hem:10px;
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
                `;
                el_main_css.rel = 'stylesheet';

                ReactDOM.render(
                    // eslint-disable-next-line no-console
                    React.createElement(module.default, { className: 'theme--light', websocket_api: { send(params) { console.log(params); return Promise.resolve(params); } }, lang: 'EN' }),
                    shadowed_el_dp2p
                );

                shadowed_el_dp2p.prepend(el_main_css);
            });
        } else {
            document.getElementById('message_cashier_unavailable').setVisibility(1);
        }
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
