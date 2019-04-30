import { formatDate }   from 'Utils/Date';
import { WS }           from 'Services';
import { getRiskAssessment,
    isAccountOfType,
    shouldAcceptTnc,
    shouldCompleteTax } from '_common/base/client_base';
import { localize }     from '_common/localize';

const client_notifications = {
    currency: {
        header : localize('Set Currency'),
        message: localize('Please set the currency of your account to enable trading.'),
        type   : 'danger',
    },
    self_exclusion: (excluded_until) => ({
        header : localize('Self-exclusion Detected'),
        message: localize('You have opted to be excluded from Binary.com until [_1]. Please contact us for assistance.', formatDate(excluded_until, 'DD/MM/YYYY')),
        type   : 'danger',
    }),
    authenticate: {
        header : localize('Account Authentication'),
        message: localize('Authenticate your account now to take full advantage of all payment methods available.'),
        type   : 'info',
    },
    document_review: {
        header : localize('Documents in review'),
        message: localize('We are reviewing your documents. For more details contact us.'),
        type   : 'info',
    },
    cashier_locked: {
        header : localize('Cashier Disabled'),
        message: localize('Deposits and withdrawals have been disabled on your account. Please check your email for more details.'),
        type   : 'warning',
    },
    mt5_withdrawal_locked: {
        header : localize('MT5 Withdrawal Disabled'),
        message: localize('MT5 withdrawals have been disabled on your account. Please check your email for more details.'),
        type   : 'warning',
    },
    document_needs_action: {
        header : localize('Authentication Failed'),
        message: localize('Your Proof of Identity or Proof of Address did not meet our requirements. Please check your email for further instructions.'),
        type   : 'warning',
    },
    unwelcome: {
        header : localize('Trading and Deposits Disabled'),
        message: localize('Trading and deposits have been disabled on your account. Kindly contact customer support for assistance.'),
        type   : 'danger',
    },
    mf_retail: {
        header : localize('Binary Options Trading Disabled'),
        message: localize('Binary Options Trading has been disabled on your account. Kindly contact customer support  for assistance.'),
        type   : 'danger',
    },
    financial_limit: {
        header : localize('Remove Deposit Limits'),
        message: localize('Please set your 30-day turnover limit to remove deposit limits.'),
        type   : 'warning',
    },
    risk: {
        header : localize('Withdrawal and Trading Limits'),
        message: localize('Please complete the Financial Assessment form to lift your withdrawal and trading limits.'),
        type   : 'info',
    },
    tax: {
        header : localize('Complete your personal details'),
        message: localize('Please complete your Personal Details before you proceed.'),
        type   : 'danger',
    },
    tnc: {
        header : localize('Terms & Conditions Updated'),
        message: localize('Please accept the updated Terms and Conditions to enable deposit and trading.'),
        type   : 'danger',
    },
    required_fields: {
        header : localize('Complete your personal details'),
        message: localize('Please complete your Personal Details before you proceed.'),
        type   : 'danger',
    },
};

const getStatusValidations = status_arr =>
    status_arr.reduce((validations, status) => {
        validations[status] = true;
        return validations;
    }, {});

const hasMissingRequiredField = (State, client) => {
    const is_svg = client.landing_company_shortcode === 'svg'
        || client.landing_company_shortcode === 'costarica';

    let required_fields;
    if (is_svg) {
        required_fields = getSVGRequiredFields();
    } else {
        required_fields = getRequiredFields();
    }

    const get_settings = State.getResponse('get_settings');
    return required_fields.some(field => !get_settings[field]);

    function getSVGRequiredFields() {
        const necessary_withdrawal_fields = State.getResponse('landing_company.financial_company.requirements.withdrawal');
        const necessary_signup_fields     = State.getResponse('landing_company.financial_company.requirements.signup')
            .map(field => (field === 'residence' ? 'country' : field));

        return [...necessary_withdrawal_fields, ...necessary_signup_fields];
    }

    function getRequiredFields() {
        if (!isAccountOfType('financial')) return [];

        const required_settings_fields = [
            'account_opening_reason',
            'address_line_1',
            'address_city',
            'phone',
            'tax_identification_number',
            'tax_residence'];
        const address_postcode_is_required = client.residence === 'gb' || client.landing_company_shortcode === 'iom';
        if (address_postcode_is_required) required_settings_fields.push('address_postcode');

        return [...required_settings_fields];
    }
};

export const handleClientNotifications = (State, client, UIStore) => {
    const { currency, excluded_until } = client;

    if (!currency)         UIStore.addNotification(client_notifications.currency);
    if (excluded_until)    UIStore.addNotification(client_notifications.self_exclusion(excluded_until));
    if (shouldAcceptTnc()) UIStore.addNotification(client_notifications.tnc);
    if (hasMissingRequiredField(State, client)) {
        UIStore.addNotification(client_notifications.required_fields);
    }

    WS.getAccountStatus().then((response) => {
        if (response.get_account_status) {
            const { prompt_client_to_authenticate, status } = response.get_account_status;

            if (prompt_client_to_authenticate) {
                UIStore.addNotification(client_notifications.authenticate);
            }
            if (status) {
                const {
                    document_under_review,
                    cashier_locked,
                    mt5_withdrawal_locked,
                    document_needs_action,
                    unwelcome,
                    ukrts_max_turnover_limit_not_set,
                    professional,
                } = getStatusValidations(status);

                if (document_under_review) UIStore.addNotification(client_notifications.document_review);
                if (cashier_locked)        UIStore.addNotification(client_notifications.cashier_locked);
                if (mt5_withdrawal_locked) UIStore.addNotification(client_notifications.mt5_withdrawal_locked);
                if (document_needs_action) UIStore.addNotification(client_notifications.document_needs_action);
                if (unwelcome)             UIStore.addNotification(client_notifications.unwelcome);
                if (ukrts_max_turnover_limit_not_set) {
                    UIStore.addNotification(client_notifications.financial_limit);
                }

                const is_mf_retail = client.landing_company_shortcode === 'maltainvest' && !professional;
                if (is_mf_retail) UIStore.addNotification(client_notifications.mf_retail);

                if (getRiskAssessment()) UIStore.addNotification(client.risk);
                if (shouldCompleteTax()) UIStore.addNotification(client_notifications.tax);
            }
        }
    });
};
