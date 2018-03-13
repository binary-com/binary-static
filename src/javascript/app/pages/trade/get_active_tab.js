const Client = require('../../base/client');
const State  = require('../../../_common/storage').State;

/*
 * get the current active tab if its visible i.e allowed for current parameters
 */
const getActiveTab = (item) => {
    const tab              = item || 'currentAnalysisTab';
    const is_chart_allowed = State.get('is_chart_allowed');
    const default_tab      = getDefaultTab(is_chart_allowed);
    let selected_tab       = sessionStorage.getItem(tab) || (State.get('is_mb_trading') ? 'tab_portfolio' : default_tab);
    let selected_element   = document.getElementById(selected_tab);
    if (!selected_element) {
        selected_tab     = 'tab_explanation';
        selected_element = document.getElementById(selected_tab);
    }

    if (selected_element && selected_element.classList.contains('invisible') &&
        (item || !(selected_tab === 'tab_portfolio' && !!(Client.isLoggedIn() && State.get('is_mb_trading'))))) {
        selected_tab = default_tab;
        sessionStorage.setItem(tab, selected_tab);
    }

    return selected_tab;
};

const getDefaultTab = (is_chart_allowed) => is_chart_allowed ? 'tab_graph' : 'tab_explanation';

module.exports = {
    getActiveTab,
};
