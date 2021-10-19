const FinancialDetailForm = require('../new_account_modules/financial_detail_form');
const localize = require('../../../../../_common/localize').localize;

const getFinancialDetailsConfig = ({ financial_assessment }) => [
    {
        id           : 'income_source',
        section      : 'financial_information',
        default_value: financial_assessment.income_source || '',
        supported_in : ['maltainvest'],
        rules        : ['req'],
    },
    {
        id           : 'employment_status',
        section      : 'financial_information',
        default_value: financial_assessment.employment_status || '',
        supported_in : ['maltainvest'],
        rules        : ['req'],
    },
    {
        id           : 'employment_industry',
        section      : 'financial_information',
        default_value: financial_assessment.employment_industry || '',
        supported_in : ['maltainvest'],
        rules        : ['req'],
    },
    {
        id           : 'occupation',
        section      : 'financial_information',
        default_value: financial_assessment.occupation || '',
        supported_in : ['maltainvest'],
        rules        : ['req'],
    },
    {
        id           : 'source_of_wealth',
        section      : 'financial_information',
        default_value: financial_assessment.source_of_wealth || '',
        supported_in : ['maltainvest'],
        rules        : ['req'],
    },
    {
        id           : 'education_level',
        section      : 'financial_information',
        supported_in : ['maltainvest'],
        default_value: financial_assessment.education_level || '',
        rules        : ['req'],
    },
    {
        id           : 'net_income',
        section      : 'financial_information',
        default_value: financial_assessment.net_income || '',
        supported_in : ['maltainvest'],
        rules        : ['req'],
    },
    {
        id           : 'estimated_worth',
        section      : 'financial_information',
        default_value: financial_assessment.estimated_worth || '',
        supported_in : ['maltainvest'],
        rules        : ['req'],
    },
    {
        id           : 'account_turnover',
        section      : 'financial_information',
        supported_in : ['maltainvest'],
        default_value: financial_assessment.account_turnover || '',
        rules        : ['req'],
    },
    {
        id           : 'forex_trading_experience',
        section      : 'trading_experience',
        supported_in : ['maltainvest'],
        default_value: financial_assessment.forex_trading_experience || '',
        rules        : ['req'],
    },
    {
        id           : 'forex_trading_frequency',
        section      : 'trading_experience',
        supported_in : ['maltainvest'],
        default_value: financial_assessment.forex_trading_frequency || '',
        rules        : ['req'],
    },
    {
        id           : 'binary_options_trading_experience',
        section      : 'trading_experience',
        supported_in : ['maltainvest'],
        default_value: financial_assessment.binary_options_trading_experience || '',
        rules        : ['req'],
    },
    {
        id           : 'binary_options_trading_frequency',
        section      : 'trading_experience',
        supported_in : ['maltainvest'],
        default_value: financial_assessment.binary_options_trading_frequency || '',
        rules        : ['req'],
    },
    {
        id           : 'cfd_trading_experience',
        section      : 'trading_experience',
        supported_in : ['maltainvest'],
        default_value: financial_assessment.cfd_trading_experience || '',
        rules        : ['req'],
    },
    {
        id           : 'cfd_trading_frequency',
        section      : 'trading_experience',
        supported_in : ['maltainvest'],
        default_value: financial_assessment.cfd_trading_frequency || '',
        rules        : ['req'],
    },
    {
        id           : 'other_instruments_trading_experience',
        section      : 'trading_experience',
        default_value: financial_assessment.other_instruments_trading_experience || '',
        supported_in : ['maltainvest'],
        rules        : ['req'],
    },
    {
        id           : 'other_instruments_trading_frequency',
        section      : 'trading_experience',
        default_value: financial_assessment.other_instruments_trading_frequency || '',
        supported_in : ['maltainvest'],
        rules        : ['req'],
    },
];

const getRequiredFields = (landing_company, all_fields) =>
    all_fields.filter(field => field.supported_in.includes(landing_company));

const financialDetailsConfig = ({ real_account_signup_target, financial_assessment }) => {
    const config = getFinancialDetailsConfig({ financial_assessment });
    return {
        title           : localize('Financial assessment'),
        body_module     : FinancialDetailForm,
        body_module_step: 'financial_info_step',
        fields          : getRequiredFields(real_account_signup_target, config),
    };
};
module.exports = financialDetailsConfig;
