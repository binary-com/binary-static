const professionalClient = require('../../../../pages/user/account/settings/professional_client');
const getElementById     = require('../../../../../_common/common_functions').getElementById;
const localize           = require('../../../../../_common/localize').localize;
const State              = require('../../../../../_common/storage').State;

const TermsOfUseForm = (() => {
    const init = async (fields, real_account_signup_target) => {
        const landing_company = State.getResponse('landing_company');
        const lc_to_upgrade_to =
            landing_company[real_account_signup_target === 'maltainvest'
                ? 'financial_company'
                : 'gaming_company'
            ] || landing_company.financial_company;
        getElementById('lc-name').innerHTML = lc_to_upgrade_to.name;
        getElementById('lc-country').innerHTML = lc_to_upgrade_to.shortcode === 'iom' ? `the ${lc_to_upgrade_to.country}` : lc_to_upgrade_to.country;
        getElementById('lc-regulator').innerHTML = getRegulatorText(lc_to_upgrade_to.shortcode);

        $('#pep_declaration_note_toggle').off('click').on('click', (e) => {
            e.stopPropagation();
            $('#pep_declaration_note_toggle').toggleClass('open');
            $('#pep_declaration_note').slideToggle();
        });

        if (lc_to_upgrade_to.shortcode === 'maltainvest') {
            professionalClient.init(real_account_signup_target === 'maltainvest', false);
        }
        fields.forEach(field => {
            getElementById(`${field.section}_section`).setVisibility(1);
            getElementById(`${field.id}_row`).setVisibility(1);
        });
    };

    const getRegulatorText = (shortcode) => {
        switch (shortcode) {
            case 'iom':
                return localize('regulated by the UK Gaming Commission (UKGC),');
            case 'malta':
                return localize('regulated by the Malta Gaming Authority,');
            case 'maltainvest':
                return localize('regulated by the Malta Financial Services Authority (MFSA),');
            default:
                return '';
        }
    };

    return {
        init,
    };
})();

module.exports = TermsOfUseForm;
