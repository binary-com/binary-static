const CurrencyForm = require('../new_account_modules/currency_form');
const localize = require('../../../../../_common/localize').localize;

const choosenCurrency = localStorage.getItem('choosenCurrency');

const currency_selector_fields = [
    {
        id           : 'currency',
        supported_in : ['maltainvest', 'malta', 'svg', 'iom'],
        default_value: choosenCurrency || '',
        rules        : [['custom', {
            value  : () => $('.currency_wrapper.selected').attr('id') || '',
            func   : (value) => value !== '',
            message: 'Please select the currency for this account.',
        }]],
    },
];

const getRequiredFields = (landing_company, all_fields) =>
    all_fields.filter(field => field.supported_in.includes(landing_company));

const currencySelectorConfig = ({ real_account_signup_target }) => ({
    title           : localize('Account currency'),
    body_module     : CurrencyForm,
    body_module_step: 'currency_step',
    fields          : getRequiredFields(real_account_signup_target, currency_selector_fields),
});

module.exports = currencySelectorConfig;
