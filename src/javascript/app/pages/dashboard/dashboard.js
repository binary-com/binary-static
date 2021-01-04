const React        = require('react');
const ReactDOM     = require('react-dom');
const Client       = require('../../base/client');
const BinarySocket = require('../../base/socket');
const ServerTime   = require('../../../_common/base/server_time');
const getLanguage  = require('../../../_common/language').get;
const urlForStatic = require('../../../_common/url').urlForStatic;

const Dashboard = (() => {
    let el_shadow_dom_dashboard;

    const onLoad = () => require.ensure([], (require) => renderDashboard(require('@deriv/dashboard')), 'dashboard');
    
    const onUnload = () => ReactDOM.unmountComponentAtNode(el_shadow_dom_dashboard);

    const renderDashboard = (module) => {
        const el_loading = document.getElementById('loading_dashboard');
        const el_dashboard_container = document.getElementById('binary_dashboard');

        el_shadow_dom_dashboard = el_dashboard_container.attachShadow({ mode: 'open' });

        const el_main_css = document.createElement('style');
        // These are styles that are to be injected into the Shadow DOM, so they are in JS and not stylesheets
        // They are to be applied to the `:host` selector
        el_main_css.innerHTML = `@import url(${urlForStatic('css/dashboard.min.css')}); :host { --hem: 10px; }`;
        el_main_css.rel = 'stylesheet';

        const language = getLanguage().toLowerCase();
        const dashboard_props = {
            client: {
                is_logged_in: Client.get('currency'),
                loginid     : Client.get('residence'),
            },
            config: {
                asset_path     : '/dashboard/assets',
                has_router     : false,
                is_deriv_crypto: false,
                routes         : {
                    home     : `/${language}/dashboard/overview.html`,
                    about_us : `/${language}/dashboard/about-us.html`,
                    resources: `/${language}/dashboard/resources.html`,
                    explore  : `/${language}/dashboard/explore.html`,
                },
            },
            ui: {
                is_dark_mode_on: false,
                language,
                components     : {
                    LoginPrompt: null, // eslint-disable-line
                    Page404    : null, // eslint-disable-line
                },
            },
            server_time: ServerTime,
            ws         : BinarySocket,
        };

        ReactDOM.render(React.createElement(module, dashboard_props), el_shadow_dom_dashboard);
        el_shadow_dom_dashboard.prepend(el_main_css);
        el_loading.parentNode.removeChild(el_loading);
        el_shadow_dom_dashboard.host.classList.remove('invisible');
    };

    return {
        onLoad,
        onUnload,
    };
})();

module.exports = Dashboard;
