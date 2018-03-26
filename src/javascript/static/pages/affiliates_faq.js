const MenuSelector = require('../../_common/menu_selector');

module.exports = {
    onLoad  : () => { MenuSelector.init(['general', 'account-management-and-tracking', 'marketing-and-promotions', 'support']); },
    onUnload: () => { MenuSelector.clean(); },
};
