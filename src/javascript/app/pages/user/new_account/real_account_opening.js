const getSteps = require('./new_account_form_config/wizard-step-config');
const Client = require('../../../base/client');
const BinarySocket = require('../../../base/socket');
const AccountOpening = require('../../../common/account_opening');
const FormManager = require('../../../common/form_manager');
const FormProgress = require('../../../common/form_progress');
const getElementById = require('../../../../_common/common_functions').getElementById;
const param = require('../../../../_common/url').param;
const { localize } = require('../../../../_common/localize');

const RealAccountOpening = (() => {
    let real_account_signup_target,
        steps,
        current_step,
        account_details,
        action_previous_buttons;

    const onLoad = async () => {
        real_account_signup_target = param('account_type');
        const currency_to_set = sessionStorage.getItem('new_financial_account_set_currency');
        if (currency_to_set) AccountOpening.setCurrencyForFinancialAccount(currency_to_set);
        else {
            const residence_list_promise = BinarySocket.send({ residence_list: 1 });
            const account_settings_promise = BinarySocket.send({ get_settings: 1 });
            const financial_assessment_promise = BinarySocket.send({ get_financial_assessment: 1 });
            const [residence_list_response, account_settings_response, financial_assessment_response] =
                await Promise.all([residence_list_promise, account_settings_promise, financial_assessment_promise]);
            const account_settings = account_settings_response.get_settings;
            const residence_list = residence_list_response.residence_list;
            const financial_assessment = financial_assessment_response.get_financial_assessment || {};
            if (AccountOpening.redirectAccount()) return;
            const upgrade_info = Client.getUpgradeInfo();

            account_details = { residence: account_settings.country_code };
            Object.assign(account_details,
                real_account_signup_target === 'maltainvest'
                    ? { new_account_maltainvest: 1, accept_risk: 0 }
                    : { new_account_real: 1 }
            );

            action_previous_buttons = document.getElementsByClassName('action_previous');
            Array.from(action_previous_buttons).forEach(item => { item.addEventListener('click', onClickPrevious); });
            getElementById('financial_risk_warning').addEventListener('submit', onRiskAccept);

            steps = getSteps({
                real_account_signup_target,
                residence_list,
                account_settings,
                upgrade_info,
                financial_assessment,
            });
            current_step = 0;
            steps.forEach(step => { step.body_module.init(step.fields, real_account_signup_target); });

            setPageTitle();
            getElementById('loading').setVisibility(0);
            getElementById('real_account_wrapper').setVisibility(1);
            getElementById('account_opening_steps').setVisibility(1);
            renderStep();
        }
    };

    const renderStep = (previous_step = 0) => {
        FormProgress.render('form_progress', steps, current_step);

        if (previous_step >= 0) getElementById(steps[previous_step].body_module_step).setVisibility(0);
        getElementById(steps[current_step].body_module_step).setVisibility(1);

        FormManager.init(`#${steps[current_step].body_module_step}_form`, getValidationRules(steps[current_step]));
        FormManager.handleSubmit({
            form_selector     : `#${steps[current_step].body_module_step}_form`,
            get_submitted_data: onStepSubmitted,
        });
        $.scrollTo(0, 500);
    };

    const onRiskAccept = (e) => {
        e.preventDefault();
        Object.assign(account_details, { accept_risk: 1 });
        AccountOpening.createNewAccount(account_details, $('#financial_risk_accept'));
    };

    const onStepSubmitted = async (req) => {
        Object.assign(account_details, req);
        if (current_step === steps.length - 1) {
            const should_show_financial_risk_warning = await AccountOpening.createNewAccount(account_details, $('#new_account_submit'));
            if (should_show_financial_risk_warning) showFinancialRiskWarning();
        } else renderStep(current_step++);
    };

    const showFinancialRiskWarning = () => {
        getElementById('account_opening_steps').setVisibility(0);
        getElementById('financial_risk_warning').setVisibility(1);
        $.scrollTo(0, 500);
    };

    const onClickPrevious = () => renderStep(current_step--);

    const getValidationRules = (step) => step.fields.map(field => ({
        selector   : `#${field.id}`,
        validations: field.rules,
    }));

    const setPageTitle = () => {
        getElementById('page_title').innerHTML =
            real_account_signup_target === 'maltainvest'
                ? localize('Financial Account Opening')
                : localize('Real money account opening');
    };

    const onUnload = () => { AccountOpening.showHidePulser(1); };

    return {
        onLoad,
        onUnload,
    };
})();

module.exports = RealAccountOpening;
