import { formatDate }   from 'Utils/Date';
import { WS }           from 'Services';
import { getRiskAssessment,
    isAccountOfType,
    shouldAcceptTnc,
    shouldCompleteTax } from '_common/base/client_base';
import { localize }     from '_common/localize';

export const handleClientNotifications = (State, client, UIStore) => {
    const { currency } = client;
    if (!currency) {
        UIStore.addNotification({
            header : localize('Set Currency'),
            message: localize('Please set the currency of your account to enable trading.'),
            type   : 'danger',
        });
    }

    const { excluded_until } = client;
    if (excluded_until) {
        UIStore.addNotification({
            header : localize('Self-exclusion Detected'),
            message: localize('You have opted to be excluded from Binary.com until [_1]. Please contact us for assistance.', formatDate(excluded_until, 'DD/MM/YYYY')),
            type   : 'danger',
        });
    }

    WS.getAccountStatus().then((response) => {
        if (response.get_account_status) {
            if (response.get_account_status.prompt_client_to_authenticate) {
                UIStore.addNotification({
                    header : localize('Account Authentication'),
                    message: localize('Authenticate your account now to take full advantage of all payment methods available.'),
                    type   : 'info',
                });
            }
            const { status } = response.get_account_status;
            if (status) {
                if (status.includes('document_under_review')) {
                    UIStore.addNotification({
                        header : localize('Documents in review'),
                        message: localize('We are reviewing your documents. For more details contact us.'),
                        type   : 'info',
                    });
                }
                if (status.includes('cashier_locked')) {
                    UIStore.addNotification({
                        header : localize('Cashier Disabled'),
                        message: localize('Deposits and withdrawals have been disabled on your account. Please check your email for more details.'),
                        type   : 'warning',
                    });
                }
                if (status.includes('mt5_withdrawal_locked')) {
                    UIStore.addNotification({
                        header : localize('MT5 Withdrawal Disabled'),
                        message: localize('MT5 withdrawals have been disabled on your account. Please check your email for more details.'),
                        type   : 'warning',
                    });
                }
                if (status.includes('document_needs_action')) {
                    UIStore.addNotification({
                        header : localize('Authentication Failed'),
                        message: localize('Your Proof of Identity or Proof of Address did not meet our requirements. Please check your email for further instructions.'),
                        type   : 'warning',
                    });
                }
                if (status.includes('unwelcome')) {
                    UIStore.addNotification({
                        header : localize('Trading and Deposits Disabled'),
                        message: localize('Trading and deposits have been disabled on your account. Kindly contact customer support for assistance.'),
                        type   : 'danger',
                    });
                }
                if (status.includes('ukrts_max_turnover_limit_not_set')) {
                    UIStore.addNotification({
                        header : localize('Remove Deposit Limits'),
                        message: localize('Please set your 30-day turnover limit to remove deposit limits.'),
                        type   : 'warning',
                    });
                }
                if (client.landing_company_shortcode === 'maltainvest' && !status.includes('professional')) {
                    UIStore.addNotification({
                        header : localize('Binary Options Trading Disabled'),
                        message: localize('Binary Options Trading has been disabled on your account. Kindly contact customer support  for assistance.'),
                        type   : 'danger',
                    });
                }
                if (getRiskAssessment()) {
                    UIStore.addNotification({
                        header : localize('Withdrawal and Trading Limits'),
                        message: localize('Please complete the Financial Assessment form to lift your withdrawal and trading limits.'),
                        type   : 'info',
                    });
                }
                if (shouldCompleteTax()) {
                    UIStore.addNotification({
                        header : localize('Complete your personal details'),
                        message: localize('Please complete your Personal Details before you proceed.'),
                        type   : 'danger',
                    });
                }
                if (shouldAcceptTnc()) {
                    UIStore.addNotification({
                        header : localize('Terms & Conditions Updated'),
                        message: localize('Please accept the updated Terms and Conditions to enable deposit and trading.'),
                        type   : 'danger',
                    });
                }
                const hasMissingRequiredField = () => {
                    const is_svg = client.landing_company_shortcode === 'svg'
                    || client.landing_company_shortcode === 'costarica';
        
                    const necessary_withdrawal_fields = is_svg
                        ? State.getResponse('landing_company.financial_company.requirements.withdrawal')
                        : [];
                    const necessary_signup_fields = is_svg
                        ? State.getResponse('landing_company.financial_company.requirements.signup')
                            .map(field => (field === 'residence' ? 'country' : field))
                        : [];
        
                    // eslint-disable-next-line no-nested-ternary
                    const required_fields = is_svg ? [ ...necessary_signup_fields, ...necessary_withdrawal_fields ]
                        : isAccountOfType('financial') ? [
                            'account_opening_reason',
                            'address_line_1',
                            'address_city',
                            'phone',
                            'tax_identification_number',
                            'tax_residence',
                            ...(client.residence === 'gb' || client.landing_company_shortcode === 'iom' ? ['address_postcode'] : []),
                        ] : [];
        
                    const get_settings = State.getResponse('get_settings');
                    return required_fields.some(field => !get_settings[field]);
                };
        
                if (hasMissingRequiredField()) {
                    UIStore.addNotification({
                        header : localize('Complete your personal details'),
                        message: localize('Please complete your Personal Details before you proceed.'),
                        type   : 'danger',
                    });
                }
            }
        }
    });
};
