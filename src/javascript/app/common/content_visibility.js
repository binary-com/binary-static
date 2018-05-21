const Client           = require('../base/client');
const BinarySocket     = require('../base/socket');
const State            = require('../../_common/storage').State;
const updateTabDisplay = require('../../_common/tab_selector').updateTabDisplay;
const MetaTrader       = require('../../app/pages/user/metatrader/metatrader');

/*
    data-show attribute controls element visibility based on
        - current landing company
        - metatrader availability
        - logged in status

    attribute value is a list of comma separated
        - landing company shortcodes
        - 'mtcompany' code that stands for metatrader availability
        - 'default' code that describes logged out users

    Examples:
        Show only for logged in clients with costarica landing company:
            data-show='costarica'
        Hide for costarica clients:
            data-show='-costarica'
        Hide for malta and maltainvest clients:
            data-show='-malta, -maltainvest'

    Prohibited values:
        Cannot mix includes and excludes:
            data-show='costarica, -malta' -> throws error
        Shortcodes are case sensitive:
            data-show='Costarica'         -> throws error
*/

const ContentVisibility = (() => {
    const init = () => {
        if (Client.isLoggedIn()) {
            BinarySocket.wait('authorize', 'landing_company').then(() => {
                controlVisibility(
                    State.getResponse('authorize.landing_company_name'),
                    MetaTrader.isEligible()
                );
            });
        } else {
            controlVisibility('default', true);
        }
    };

    const generateParsingErrorMessage = (reason, attr_str) => (
        `Invalid data-show attribute value! ${reason} Given value: '${attr_str}'.`
    );

    const parseAttributeString = (attr_str) => {
        if (!/^[a-z,-\s]+$/.test(attr_str)) {
            throw new Error(generateParsingErrorMessage('Invalid characted used.', attr_str));
        }
        let names = attr_str.split(',').map(name => name.trim());
        if (names.some(name => name.length === 0)) {
            throw new Error(generateParsingErrorMessage('No empty names allowed.', attr_str));
        }
        const is_exclude = names.every(name => name[0] === '-');
        const is_include = names.every(name => name[0] !== '-');
        if (!is_exclude && !is_include) {
            throw new Error(generateParsingErrorMessage('No mixing of includes and excludes allowed.', attr_str));
        }
        if (is_exclude) {
            names = names.map(name => name.slice(1));
        }
        return {
            is_exclude,
            names,
        };
    };

    const controlVisibility = (current_landing_company_shortcode, client_has_mt_company) => {
        const visible_classname = 'data-show-visible';
        const mt_company_rule   = 'mtcompany';

        document.querySelectorAll('[data-show]').forEach(el => {
            const attr_str              = el.dataset.show;
            const { is_exclude, names } = parseAttributeString(attr_str);
            const rule_set              = new Set(names);

            const rule_set_has_current = rule_set.has(current_landing_company_shortcode);
            const rule_set_has_mt      = rule_set.has(mt_company_rule);

            let show_element = false;

            if (client_has_mt_company && rule_set_has_mt) show_element = !is_exclude;
            else if (is_exclude !== rule_set_has_current) show_element = true;

            if (show_element) {
                el.classList.add(visible_classname);
            } else {
                const open_tab_url = new RegExp(`\\?.+_tabs=${el.id}`, 'i');
                // check if we hide a tab that's open
                // then redirect to the url without query
                if (el.classList.contains('tm-li') && open_tab_url.test(window.location.href)) {
                    const { origin, pathname } = window.location;
                    window.location.href = origin + pathname;
                }
            }
        });

        updateTabDisplay();
    };

    return {
        init,
    };
})();

module.exports = ContentVisibility;