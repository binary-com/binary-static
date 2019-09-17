const refreshDropdown      = require('@binary-com/binary-style').selectDropdown;
const BinaryPjax           = require('../../base/binary_pjax');
const Client               = require('../../base/client');
const BinarySocket         = require('../../base/socket');
const getDecimalPlaces     = require('../../common/currency').getDecimalPlaces;
const getNumberFormat      = require('../../common/currency').getNumberFormat;
const getPaWithdrawalLimit = require('../../common/currency').getPaWithdrawalLimit;
const FormManager          = require('../../common/form_manager');
const Validation           = require('../../common/form_validation');
const handleVerifyCode     = require('../../common/verification_code').handleVerifyCode;
const isVisible            = require('../../../_common/common_functions').isVisible;
const getElementById       = require('../../../_common/common_functions').getElementById;
const localize             = require('../../../_common/localize').localize;
const Url                  = require('../../../_common/url');
const isBinaryApp          = require('../../../config').isBinaryApp;

const PaymentAgentWithdraw = (() => {
    const view_ids  = {
        error  : '#viewError',
        notice : '#viewNotice',
        success: '#viewSuccess',
        confirm: '#viewConfirm',
        form   : '#viewForm',
    };
    const field_ids = {
        ddl_agents: '#ddlAgents',
        txt_agents: '#txtAgents',
        txt_amount: '#txtAmount',
    };

    let $agent_error,
        $ddl_agents,
        $txt_agents,
        $txt_amount,
        $views,
        agent_name,
        agent_website,
        agent_email,
        agent_telephone,
        currency,
        token,
        pa_list;

    // -----------------------
    // ----- Agents List -----
    // -----------------------
    const populateAgentsList = (response) => {
        $ddl_agents = $(field_ids.ddl_agents);
        $ddl_agents.empty();
        pa_list = (response.paymentagent_list || {}).list;
        if (pa_list.length > 0) {
            checkToken();
        } else {
            showPageError(localize('Payment Agent services are not available in your country or in your preferred currency.'));
        }
    };

    const checkToken = () => {
        token = token || Url.getHashValue('token');
        if (!token) {
            BinarySocket.send({ verify_email: Client.get('email'), type: 'paymentagent_withdraw' });
            if (isBinaryApp()) {
                handleVerifyCode((verification_code) => {
                    token = verification_code;
                    checkToken($ddl_agents);
                });
            } else {
                setActiveView(view_ids.notice);
            }
        } else if (!Validation.validEmailToken(token)) {
            showPageError('token_error');
        } else {
            insertListOption($ddl_agents, localize('Select payment agent'), '');
            for (let i = 0; i < pa_list.length; i++) {
                insertListOption($ddl_agents, pa_list[i].name, pa_list[i].paymentagent_loginid);
            }
            setActiveView(view_ids.form);

            const form_id = `#${$(view_ids.form).find('form').attr('id')}`;
            const $form   = $(form_id);

            const getAPILimit = limit => {
                const selected_val = getPALoginID();
                if (selected_val){
                    const selected_pa = pa_list.find(pa => pa.paymentagent_loginid === selected_val);
                    if (selected_pa) return selected_pa[`${limit}_withdrawal`];
                }
                return getPaWithdrawalLimit(currency, limit);
            };

            const min = () => getAPILimit('min');
            const max = () => getAPILimit('max');

            $agent_error = $('.row-agent').find('.error-msg');
            $txt_agents  = $(field_ids.txt_agents);
            $txt_amount  = $(field_ids.txt_amount);

            $form.find('.wrapper-row-agent').find('label').append($('<span />', { text: '*', class: 'required_field_asterisk' }));
            $form.find('label[for="txtAmount"]').text(`${localize('Amount in')} ${currency}`);
            FormManager.init(form_id, [
                { selector: field_ids.txt_amount, validations: ['req', ['number', { type: 'float', decimals: getDecimalPlaces(currency), min, max }], ['custom', { func: () => +Client.get('balance') >= +$txt_amount.val(), message: localize('Insufficient balance.') }]], request_field: 'amount' },

                { request_field: 'currency',              value: currency },
                { request_field: 'paymentagent_loginid',  value: getPALoginID },
                { request_field: 'paymentagent_withdraw', value: 1 },
                { request_field: 'dry_run',               value: 1 },
            ], true);

            $ddl_agents.on('change', () => {
                $agent_error.setVisibility(0);
                if ($txt_agents.val()) {
                    $txt_agents.val('');
                }
                if (!$ddl_agents.val()) {
                    // error handling
                    $agent_error.setVisibility(1);
                }
                validateAmount();
            });

            $txt_agents.on('keyup', () => {
                $agent_error.setVisibility(0);
                if ($ddl_agents.val()) {
                    $ddl_agents.val('');
                    refreshDropdown(field_ids.ddl_agents);
                }
                if (!$txt_agents.val()) {
                    // error handling
                    $agent_error.setVisibility(1);
                }
            });

            $txt_agents.on('focusout', () => {
                validateAmount();
            });

            const validateAmount = () => {
                if ($txt_amount.val()) {
                    Validation.validate(form_id);
                }
            };

            FormManager.handleSubmit({
                form_selector       : form_id,
                fnc_response_handler: withdrawResponse,
                fnc_additional_check: checkAgent,
                enable_button       : true,
            });

            $(field_ids.txt_desc).off().on('keyup', () => {
                if (isVisible(getElementById('withdrawFormMessage'))) {
                    $(field_ids.frm_msg).setVisibility(0);
                }
            });
        }
    };

    const getPALoginID = () => (
        $ddl_agents.val() || $txt_agents.val()
    );

    const insertListOption = ($ddl_object, item_text, item_value) => {
        $ddl_object.append($('<option/>', { value: item_value, text: item_text }));
    };

    const setAgentDetail = (id, html_value, href_value) => {
        getElementById(id).getElementsByTagName('a')[0].innerHTML = html_value;
        getElementById(id).getElementsByTagName('a')[0].href = href_value;
    };

    // ----------------------------
    // ----- Withdraw Process -----
    // ----------------------------
    const withdrawResponse = (response) => {
        const request = response.echo_req;
        switch (response.paymentagent_withdraw) {
            case 2: { // dry_run success: showing the confirmation page
                setActiveView(view_ids.confirm);

                $('#lblAgentName').text(agent_name);
                $('#lblCurrency').text(request.currency);
                $('#lblAmount').text(getNumberFormat(request.amount, request.currency));

                FormManager.init(view_ids.confirm, [
                    { request_field: 'paymentagent_loginid',  value: request.paymentagent_loginid },
                    { request_field: 'amount',                value: getNumberFormat(request.amount, request.currency) },
                    { request_field: 'currency',              value: request.currency },
                    { request_field: 'paymentagent_withdraw', value: 1 },
                ], true);

                FormManager.handleSubmit({
                    form_selector       : view_ids.confirm,
                    fnc_response_handler: withdrawResponse,
                });

                $(`${view_ids.confirm} #btnBack`).click(() => {
                    setActiveView(view_ids.form);
                });
                break;
            }
            case 1: // withdrawal success
                setActiveView(view_ids.success);
                $('#successMessage').css('display', '')
                    .attr('class', 'success-msg')
                    .html($('<ul/>', { class: 'checked' }).append($('<li/>', { text: localize('Your request to withdraw [_1] [_2] from your account [_3] to Payment Agent [_4] account has been successfully processed.', [request.currency, getNumberFormat(request.amount, request.currency), Client.get('loginid'), agent_name]) })));

                // Set PA details.
                if (agent_name && agent_website && agent_email && agent_telephone) {
                    getElementById('agentName').innerHTML = agent_name;
                    setAgentDetail('agentWebsite', agent_website, agent_website);
                    setAgentDetail('agentEmail', agent_email, `mailto:${agent_email}`);
                    setAgentDetail('agentTelephone', agent_telephone, `tel:${agent_telephone}`);

                    getElementById('agentDetails').classList.remove('invisible');
                }
                break;
            default: // error
                if (response.echo_req.dry_run === 1) {
                    setActiveView(view_ids.form);
                    $(field_ids.frm_msg).setVisibility(1).html(response.error.message);
                } else if (response.error.code === 'InvalidToken') {
                    showPageError(localize('Your token has expired or is invalid. Please click [_1]here[_2] to restart the verification process.', ['<a href="javascript:;" onclick="var url = location.href.split(\'#\')[0]; window.history.replaceState({ url }, document.title, url); window.location.reload();">', '</a>']));
                } else {
                    showPageError(response.error.message);
                }
                break;
        }
    };

    // -----------------------------
    // ----- Message Functions -----
    // -----------------------------
    const showPageError = (err_msg, id) => {
        const $error = $(view_ids.error);
        $error.find(' > p').setVisibility(0);
        if (id) {
            $error.find(`#${id}`).setVisibility(1);
        } else {
            $error.find('#custom-error').html(err_msg).setVisibility(1);
        }
        setActiveView(view_ids.error);
    };

    // ----- View Control -----
    const setActiveView = (view_id) => {
        $views.setVisibility(0);
        $(view_id).setVisibility(1);
    };

    const onLoad = () => {
        if (!Client.get('currency')) {
            BinaryPjax.load(`${Url.urlFor('user/set-currency')}`);
            return;
        }
        BinarySocket.wait('get_account_status').then((data) => {
            $views = $('#paymentagent_withdrawal').find('.viewItem');
            $views.setVisibility(0);

            if (/(withdrawal|cashier)_locked/.test(data.get_account_status.status)) {
                showPageError('', 'withdrawal-locked-error');
            } else {
                currency = Client.get('currency');
                if (!currency || +Client.get('balance') === 0) {
                    showPageError(localize('Please [_1]deposit[_2] to your account.', [`<a href='${`${Url.urlFor('cashier/forwardws')}?action=deposit`}'>`, '</a>']));
                    return;
                }
                BinarySocket.send({
                    paymentagent_list: Client.get('residence'),
                    currency,
                })
                    .then(response => populateAgentsList(response));
            }
        });
    };

    const checkAgent = () => {
        if (!$ddl_agents.val() && !$txt_agents.val()) {
            $agent_error.setVisibility(1);
            return false;
        }
        // else
        setAgentDetails();
        return true;
    };

    const setAgentDetails = () => {
        agent_name = $ddl_agents.val() ? $ddl_agents.find('option:selected').text() : $txt_agents.val();
        pa_list.map(pa => {
            if (pa.name === agent_name || pa.paymentagent_loginid === agent_name) {
                agent_website = pa.url;
                agent_email = pa.email;
                agent_telephone = pa.telephone;
            }
        });
    };

    const onUnload = () => {
        token = '';
    };

    return {
        onLoad,
        onUnload,
    };
})();

module.exports = PaymentAgentWithdraw;
