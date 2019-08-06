/*
 * get the current active tab if its visible i.e allowed for current parameters
 */
const getActiveTab = (item) => {
    const tab              = item || 'currentAnalysisTab';
    const default_tab      = 'tab_explanation';
    let selected_tab       = sessionStorage.getItem(tab) || default_tab;
    let selected_element   = document.getElementById(selected_tab);
    if (!selected_element) {
        selected_tab     = default_tab;
        selected_element = document.getElementById(selected_tab);
    }

    if (selected_element && selected_element.classList.contains('invisible')
        || (selected_element && selected_element.classList.contains('invisible') && item)) {
        selected_tab = default_tab;
        sessionStorage.setItem(tab, selected_tab);
    }

    return selected_tab;
};

module.exports = {
    getActiveTab,
};
