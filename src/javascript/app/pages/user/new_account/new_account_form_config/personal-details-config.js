const localize = require('../../../../../_common/localize').localize;
const PersonalDetailForm = require('../new_account_modules/personal_detail_form');

const getPersonalDetailsConfig = ({ account_settings, residence_list }) => {
    const isImmutable = (field) => account_settings.immutable_fields.includes(field);
    const config = [
        {
            id           : 'salutation',
            section      : 'name',
            supported_in : ['iom', 'malta', 'maltainvest'],
            default_value: account_settings.salutation || '',
            is_immutable : isImmutable('salutation'),
            rules        : ['req'],
        },
        {
            id           : 'first_name',
            section      : 'name',
            supported_in : ['svg', 'iom', 'malta', 'maltainvest'],
            default_value: account_settings.first_name || '',
            is_immutable : isImmutable('first_name'),
            rules        : ['req', 'letter_symbol', ['length', { min: 2, max: 50 }]],
        },
        {
            id           : 'last_name',
            section      : 'name',
            supported_in : ['svg', 'iom', 'malta', 'maltainvest'],
            default_value: account_settings.last_name || '',
            is_immutable : isImmutable('last_name'),
            rules        : ['req', 'letter_symbol', ['length', { min: 2, max: 50 }]],
        },
        {
            id           : 'date_of_birth',
            section      : 'detail',
            supported_in : ['svg', 'iom', 'malta', 'maltainvest'],
            default_value: account_settings.date_of_birth
                ? account_settings.date_of_birth
                : '',
            is_immutable: isImmutable('date_of_birth'),
            rules       : ['req'],
        },
        {
            id           : 'place_of_birth',
            section      : 'detail',
            supported_in : ['maltainvest', 'iom', 'malta'],
            default_value: account_settings.place_of_birth || '',
            is_immutable : isImmutable('place_of_birth'),
            rules        : ['req'],
        },
        {
            id           : 'citizen',
            section      : 'detail',
            supported_in : ['iom', 'malta', 'maltainvest'],
            default_value: account_settings.citizen || '',
            is_immutable : isImmutable('citizen'),
            rules        : ['req'],
        },
        {
            id           : 'phone',
            section      : 'detail',
            supported_in : ['svg', 'iom', 'malta', 'maltainvest'],
            default_value: account_settings.phone || '',
            is_immutable : isImmutable('phone'),
            rules        : ['req', 'phone', ['length',
                { min: 9, max: 35, value: () => $('#phone').val().replace(/\D/g, '') },
            ]],
        },
        {
            id           : 'tax_residence',
            section      : 'tax',
            supported_in : ['maltainvest'],
            default_value: account_settings.tax_residence || '',
            is_immutable : isImmutable('tax_residence'),
            rules        : ['req', ['length', { min: 1, max: 20 }]],
        },
        {
            id           : 'tax_identification_number',
            section      : 'tax',
            supported_in : ['maltainvest'],
            default_value: account_settings.tax_identification_number || '',
            is_immutable : isImmutable('tax_identification_numbe'),
            rules        : [
                'req',
                ['tax_id', { residence_list, $warning: $('#tax_id_warning'), $tax_residence: $('#tax_residence') }],
                ['length', { min: 1, max: 20 }],
            ],
        },
        {
            id           : 'tax_identification_confirm',
            section      : 'tax',
            supported_in : ['maltainvest'],
            default_value: false,
            is_immutable : isImmutable('tax_identification_confirm'),
            rules        : ['req'],
        },
        {
            id           : 'account_opening_reason',
            section      : 'account_opening_reason',
            supported_in : ['iom', 'malta', 'maltainvest'],
            default_value: account_settings.account_opening_reason || '',
            is_immutable : isImmutable('account_opening_reason'),
            rules        : ['req'],
        },
        {
            id           : 'accurate_answer_warning',
            section      : '',
            supported_in : ['maltainvest'],
            default_value: '',
            is_immutable : isImmutable('accurate_answer_warning'),
            rules        : [],
        },
    ];
    return config;
};

const getRequiredFields = (landing_company, all_fields) =>
    all_fields.filter(field => field.supported_in.includes(landing_company));

const personalDetailsConfig = ({ real_account_signup_target, account_settings, residence_list }) => {
    const config = getPersonalDetailsConfig({ account_settings, residence_list });
    return {
        title           : localize('Personal details'),
        body_module     : PersonalDetailForm,
        body_module_step: 'personal_detail_step',
        fields          : getRequiredFields(real_account_signup_target, config),
    };
};

module.exports = personalDetailsConfig;
