const isEuCountry      = require('./country_base').isEuCountry;
const isUKCountry      = require('./country_base').isUKCountry;
const BinarySocket     = require('../base/socket');
const MetaTrader       = require('../pages/user/metatrader/metatrader');
const State            = require('../../_common/storage').State;
const updateTabDisplay = require('../../_common/tab_selector').updateTabDisplay;
const Client = require('../base/client');

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
        Show only for logged in clients with svg landing company:
            data-show='svg'

        Show for svg and malta:
            data-show='svg, malta'

        Hide for svg:
            data-show='-svg'

        Hide for malta and maltainvest:
            data-show='-malta, -maltainvest'

        Show for clients with 'vanuatu' mt5 financial company
            data-show='mt5fin:vanuatu'

        Show for clients either with  'vanuatu' or 'labuan' mt5 financial company
            data-show='mt5fin:vanuatu, labuan'

    Prohibited values:
        Cannot mix includes and excludes:
            data-show='svg, -malta' -> throws error
        Shortcodes are case sensitive:
            data-show='SVG'         -> throws error
*/

const visible_classname    = 'data-show-visible';
const mt_company_rule      = 'mtcompany';
const eu_country_rule      = 'eucountry';
const uk_country_rule      = 'gbcountry';
const options_blocked_rule = 'optionsblocked';

const ContentVisibility = (() => {
    let $center_select_m;

    const init = () => {
        let arr_mt5fin_shortcodes;

        return new Promise(resolve => {
            BinarySocket.wait('authorize', 'landing_company', 'website_status').then(() => {
                const current_landing_company_shortcode = State.getResponse('authorize.landing_company_name') || 'default';
                const mt_financial_company = State.getResponse('landing_company.mt_financial_company');
                const mt_gaming_company    = State.getResponse('landing_company.mt_gaming_company');

                // Check if mt_financial_company is offered, if not found, switch to mt_gaming_company
                const mt_landing_company = mt_financial_company || mt_gaming_company;

                // Check mt_financial_company by account type, since we are offering different landing companies for financial and financial_stp
                arr_mt5fin_shortcodes = mt_landing_company ? Object.keys(mt_landing_company)
                    .map((key) => mt_landing_company[key].shortcode) : [];

                controlVisibility(
                    current_landing_company_shortcode,
                    MetaTrader.isEligible(),
                    // We then pass the list of found mt5fin company shortcodes as an array
                    arr_mt5fin_shortcodes
                );

                resolve();
            });
        });
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
        arr_mt5fin_shortcodes
    ) => {
        const {
            is_exclude,
            mt5fin_rules,
            names,
        } = parseAttributeString(attr_str);
        const rule_set = new Set(names);

        const is_eu_country           = isEuCountry();
        const is_uk_country           = isUKCountry();
        const rule_set_has_current    = rule_set.has(current_landing_company_shortcode);
        const rule_set_has_mt         = rule_set.has(mt_company_rule);
        const rule_set_has_eu_country = rule_set.has(eu_country_rule);
        const rule_set_has_uk_country = rule_set.has(uk_country_rule);
        const options_blocked         = rule_set.has(options_blocked_rule);

        let show_element = false;

        if (client_has_mt_company && rule_set_has_mt) show_element = !is_exclude;
        else if (is_exclude !== rule_set_has_current) show_element = true;
        if (rule_set_has_uk_country && is_uk_country) show_element = !is_exclude;
        if (rule_set_has_eu_country && is_eu_country) show_element = !is_exclude;
        else if (is_eu_country && current_landing_company_shortcode === 'default') { // for logged out EU clients, check if IP landing company matches
            const financial_shortcode = State.getResponse('landing_company.financial_company.shortcode');
            const gaming_shortcode    = State.getResponse('landing_company.gaming_company.shortcode');
            if (rule_set.has(financial_shortcode) || rule_set.has(gaming_shortcode)) {
                show_element = !is_exclude;
            }
        }

        // Check if list of mt5fin_company_shortcodes is array type and filter with defined mt5fin rules
        if (Array.isArray(arr_mt5fin_shortcodes)) {
            if (arr_mt5fin_shortcodes.some(el => mt5fin_rules.includes(el))) show_element = !is_exclude;
        }
        if (options_blocked && Client.isOptionsBlocked()) {
            show_element = !is_exclude;
        }

        return show_element;
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
    };

    // if text is hidden, we need to append it to body to be able to get its width
    const getTextWidth = (text) => {
        const $el = $('<span />', { text });
        $el.prependTo('body');
        const el_width = $el.width();
        $el.remove();
        return el_width;
    };

    const centerSelect = ($el) => {
        const option_width = getTextWidth($el.children(':selected').text());
        const center_option_text = option_width / 2;
        $el.css('text-indent', `calc(50% - ${center_option_text}px)`);
    };

    const centerAlignSelect = (should_init) => {
        $(window).off('resize', centerAlignSelect);
        $('#frm_real #trading_experience_form select, #frm_real #financial_info_form select').addClass('center-select-m');
        $center_select_m = ((typeof should_init === 'boolean' && should_init) || !$center_select_m) ? $('#frm_real .center-select-m') : $center_select_m;

        if ($(window).width() <= 480) {
            const financial_form_selects = $('#frm_real select');
            financial_form_selects.get().forEach((element) => {
                const option_width = getTextWidth($(element).children(':selected').text());
                const center_option_text = option_width / 2;
                $(element).css('text-indent', `calc(50% - ${center_option_text}px)`);
            });
            $center_select_m.on('change', function() {
                centerSelect($(this));
            });
        } else {
            $center_select_m.each(function() {
                $(this).css('text-indent', 0);
            });
            $(window).resize(centerAlignSelect);
        }
    };

    return {
        centerAlignSelect,
        init,
        __test__: {
            parseAttributeString,
            shouldShowElement,
        },
    };
})();

module.exports = ContentVisibility;
