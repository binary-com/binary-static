const localize = require('../../../../../_common/localize').localize;
const TermsOfUseForm = require('../new_account_modules/terms_of_use_form');

const getTermsOfUseConfig = [
    {
        id          : 'jurisdiction',
        section     : 'terms_of_use_section',
        supported_in: ['maltainvest', 'svg', 'iom', 'malta'],
        rules       : [],
    },
    {
        id          : 'fs_professional',
        section     : 'terms_of_use_section',
        supported_in: ['maltainvest'],
        rules       : [],
    },
    {
        id          : 'risk_disclaimer',
        section     : 'terms_of_use_section',
        supported_in: ['maltainvest', 'svg'],
        rules       : [],
    },
    {
        id           : 'pep_declaration',
        section      : 'terms_of_use_section',
        supported_in : ['maltainvest', 'iom', 'malta', 'svg'],
        default_value: false,
        rules        : ['req'],
    },
    {
        id           : 'tnc',
        section      : 'terms_of_use_section',
        supported_in : ['maltainvest', 'svg', 'iom', 'malta'],
        default_value: false,
        rules        : ['req'],
    },
];

const getRequiredFields = (landing_company, all_fields) =>
    all_fields.filter(field => field.supported_in.includes(landing_company));

const termsOfUseConfig = ({ real_account_signup_target }) => ({
    title           : localize('Terms of use'),
    body_module     : TermsOfUseForm,
    body_module_step: 'terms_of_use_step',
    fields          : getRequiredFields(real_account_signup_target, getTermsOfUseConfig),
});

module.exports = termsOfUseConfig;
