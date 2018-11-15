const isEuCountry      = require('./country_base').isEuCountry;
const Client           = require('../base/client');
const BinarySocket     = require('../base/socket');
const MetaTrader       = require('../pages/user/metatrader/metatrader');
const State            = require('../../_common/storage').State;
const updateTabDisplay = require('../../_common/tab_selector').updateTabDisplay;

/*
    data-show attribute controls element visibility based on
        - current landing company
        - metatrader availability
        - logged in status

    attribute value is a list of comma separated
        - landing company shortcodes
        - 'mtcompany' code that stands for metatrader availability
        - 'default' code that describes logged out users
        - mt5fin rules for mt5 financial company shortcodes
            starts with 'mt5fin:'
            e.g. 'mt5fin:vanuatu' will match if clients mt5 financial company shortcode is 'vanuatu'

    Examples:
        Show only for logged in clients with costarica landing company:
            data-show='costarica'

        Show for costarica and malta:
            data-show='costarica, malta'

        Hide for costarica:
            data-show='-costarica'

        Hide for malta and maltainvest:
            data-show='-malta, -maltainvest'

        Show for clients with 'vanuatu' mt5 financial company
            data-show='mt5fin:vanuatu'

    Prohibited values:
        Cannot mix includes and excludes:
            data-show='costarica, -malta' -> throws error
        Shortcodes are case sensitive:
            data-show='Costarica'         -> throws error
*/

const visible_classname = 'data-show-visible';
const mt_company_rule   = 'mtcompany';

const ContentVisibility = (() => {
    const init = () => {
        if (Client.isLoggedIn()) {
            BinarySocket.wait('authorize', 'landing_company').then(() => {
                controlVisibility(
                    State.getResponse('authorize.landing_company_name'),
                    MetaTrader.isEligible(),
                    State.getResponse('landing_company.mt_financial_company.shortcode')
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
        let names = attr_str.split(',').map(name => name.trim());

        if (names.some(name => name.length === 0)) {
            throw new Error(generateParsingErrorMessage('No empty names allowed.', attr_str));
        }
        const is_exclude = names.every(name => name.charAt(0) === '-');
        const is_include = names.every(name => name.charAt(0) !== '-');

        if (!is_exclude && !is_include) {
            throw new Error(generateParsingErrorMessage('No mixing of includes and excludes allowed.', attr_str));
        }
        if (is_exclude) {
            names = names.map(name => name.slice(1));
        }

        const mt5fin_rules = names
            .filter(name => isMT5FinRule(name))
            .map(rule => parseMT5FinRule(rule));

        names = names.filter(name => !isMT5FinRule(name));

        return {
            is_exclude,
            names,
            mt5fin_rules,
        };
    };

    const isMT5FinRule = (rule) => /^mt5fin:/.test(rule);

    const parseMT5FinRule = (rule) => rule.match(/^mt5fin:(.+)$/)[1];

    const shouldShowElement = (
        attr_str,
        current_landing_company_shortcode,
        client_has_mt_company,
        mt5fin_company_shortcode
    ) => {
        const {
            is_exclude,
            mt5fin_rules,
            names,
        } = parseAttributeString(attr_str);
        const rule_set = new Set(names);

        const rule_set_has_current = rule_set.has(current_landing_company_shortcode);
        const rule_set_has_mt      = rule_set.has(mt_company_rule);

        let show_element = false;

        if (client_has_mt_company && rule_set_has_mt) show_element = !is_exclude;
        else if (is_exclude !== rule_set_has_current) show_element = true;

        if (mt5fin_rules.includes(mt5fin_company_shortcode)) show_element = !is_exclude;

        return show_element;
    };

    const hideEU = () => {
        BinarySocket.wait('website_status', 'authorize', 'landing_company').then(() => {
            if (isEuCountry()) {
                $('.eu-hide').setVisibility(0);
                $('.eu-show').setVisibility(1);
                $('.eu-hide-parent').parent().setVisibility(0);
            }
        });
    };

    const controlVisibility = (current_landing_company_shortcode, client_has_mt_company, mt5_login_list) => {
        document.querySelectorAll('[data-show]').forEach(el => {
            const attr_str      = el.dataset.show;
            if (shouldShowElement(attr_str, current_landing_company_shortcode, client_has_mt_company, mt5_login_list)) {
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
        hideEU();
    };

    return {
        init,
        __test__: {
            parseAttributeString,
            shouldShowElement,
        },
    };
})();

module.exports = ContentVisibility;
