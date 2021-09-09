const AddressDetailForm = require('../new_account_modules/address_detail_form');
const localize = require('../../../../../_common/localize').localize;

const getAddressDetailsConfig = ({ account_settings, is_svg }) => [
    {
        id           : 'address_line_1',
        section      : 'address_section',
        supported_in : ['svg', 'iom', 'malta', 'maltainvest'],
        default_value: account_settings.address_line_1 || '',
        rules        : ['req', 'address', ['length', { min: 1, max: 700 }]],
    },
    {
        id           : 'address_line_2',
        section      : 'address_section',
        supported_in : ['svg', 'iom', 'malta', 'maltainvest'],
        default_value: account_settings.address_line_2 || '',
        rules        : [['length', { min: 0, max: 70 }]],
    },
    {
        id           : 'address_city',
        section      : 'address_section',
        supported_in : ['svg', 'iom', 'malta', 'maltainvest'],
        default_value: account_settings.address_city || '',
        rules        : [
            'req',
            ['regular', { regex: /^[a-zA-Z\s\W'.-]{1,35}$/ }],
        ],
    },
    {
        id           : 'address_state',
        section      : 'address_section',
        supported_in : ['svg', 'iom', 'malta', 'maltainvest'],
        default_value: account_settings.address_state || '',
        rules        : [
            ['regular', { regex: /^[\w\s\W'.-;,]{0,60}$/ }],
            // Isle of Man and SVG Clients do not need to fill out state.
            ...(account_settings.country_code === 'im' || is_svg ? [] : ['req']),
        ],
    },
    {
        id           : 'address_postcode',
        section      : 'address_section',
        supported_in : ['svg', 'iom', 'malta', 'maltainvest'],
        default_value: account_settings.address_postcode || '',
        rules        : [
            ['length', { min: 0, max: 20 }],
            'postcode',
            // GB and IM residence are required to fill in the post code.
            ...(/^(im|gb)$/.test(account_settings.country_code) ? ['req'] : []),
        ],
    },
];

const getRequiredFields = (landing_company, all_fields) =>
    all_fields.filter(field => field.supported_in.includes(landing_company));

const addressDetailsConfig = ({ real_account_signup_target, account_settings }) => {
    const is_svg = real_account_signup_target === 'svg';
    const config = getAddressDetailsConfig({ account_settings, is_svg });
    return {
        title           : localize('Address'),
        body_module     : AddressDetailForm,
        body_module_step: 'address_detail_step',
        fields          : getRequiredFields(real_account_signup_target, config),
    };
};

module.exports = addressDetailsConfig;
