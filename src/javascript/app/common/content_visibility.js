const Client           = require('../base/client');
const BinarySocket     = require('../base/socket');
const State            = require('../../_common/storage').State;
const updateTabDisplay = require('../../_common/tab_selector').updateTabDisplay;
const MetaTrader       = require('../../app/pages/user/metatrader/metatrader');

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

    const generateParsingErrorMessage = (reason) => {
        return `Invalid data-show attribute value! ${reason} Given value: '${attr_str}'.`;
    };

    const parseAttributeString = (attr_str) => {
        if (!/^[a-z,-\s]+$/.test(attr_str)) {
            throw new Error(generateParsingErrorMessage('Invalid characted used.'));
        }
        let names = attr_str.split(',').map(name => name.trim());
        if (names.some(name => name.length === 0)) {
            throw new Error(generateParsingErrorMessage('No empty names allowed.'));
        }
        const is_exclude = names.every(name => name[0] === '-');
        const is_include = names.every(name => name[0] !== '-');
        if (!is_exclude && !is_include) {
            throw new Error(generateParsingErrorMessage('No mixing of includes and excludes allowed.'));
        }
        if (is_exclude) {
            names = names.map(name => name.slice(1));
        }
        return {
            is_exclude,
            names,
        };
    };

    const controlVisibility = (landing_company_name, has_mt_company) => {
        const visible_classname = 'data-show-visible';
        const mt_company_code = 'mtcompany';

        document.querySelectorAll('[data-show]').forEach(el => {
            const attr_str = el.dataset.show;
            const { is_exclude, names } = parseAttributeString(attr_str);
            const is_include = !is_exclude;
            const name_set = new Set(names);

            if ((is_exclude && !name_set.has(landing_company_name) && (has_mt_company !== name_set.has(mt_company_code)))
                || (is_include && name_set.has(landing_company_name))
                || (is_include && has_mt_company && name_set.has(mt_company_code)))
            {
                el.classList.add(visible_classname);
                console.log('show', el);
            }
            else {
                console.log('stays hidden', el);
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