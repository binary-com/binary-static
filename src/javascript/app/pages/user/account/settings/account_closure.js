const Metatrader = require('../../metatrader/metatrader');
const BinarySocket = require('../../../../base/socket');
const Client = require('../../../../base/client');
const Currency = require('../../../../common/currency');
const Url = require('../../../../../_common/url');
const hasAccountType = require('../../../../../_common/base/client_base').hasAccountType;
const getElementById = require('../../../../../_common/common_functions').getElementById;
const localize = require('../../../../../_common/localize').localize;
const applyToAllElements = require('../../../../../_common/utility').applyToAllElements;

const AccountClosure = (() => {
    let reason_checkbox_list,
        checked_reasons,
        el_form_closure_step_1,
        el_step_2_back,
        el_step_2_submit,
        el_dialog_container,
        el_account_closure_warning,
        el_account_closure_error,
        el_closure_loading,
        el_error_msg,
        el_other_trading_platforms,
        el_suggested_improves,
        el_remain_characters,
        el_deacivate_button,
        el_error_no_selection,
        el_submit_loading;

    const number_of_steps = 3;
    checked_reasons = '';

    const onLoad = () => {
        reason_checkbox_list = document.getElementsByName('reason-checkbox');
        el_dialog_container = getElementById('dialog_container');
        el_form_closure_step_1 = getElementById('form_closure_step_1');
        el_step_2_back = getElementById('step_2_back');
        el_step_2_submit = getElementById('step_2_submit');
        el_other_trading_platforms = getElementById('other_trading_platforms');
        el_suggested_improves = getElementById('suggested_improves');
        el_remain_characters = getElementById('remain_characters');
        el_account_closure_warning = getElementById('account_closure_warning');
        el_account_closure_error = getElementById('account_closure_error');
        el_closure_loading = getElementById('closure_loading');
        el_deacivate_button = getElementById('deactivate');
        el_error_msg = getElementById('error_msg');
        el_error_no_selection = getElementById('error_no_selection');
        el_submit_loading = getElementById('submit_loading');

        el_closure_loading.setVisibility(1);
        const hideDialogs = () => {
            el_account_closure_warning.setVisibility(0);
            el_account_closure_error.setVisibility(0);
        };
        hideDialogs();

        const has_virtual_only = !hasAccountType('real');
        BinarySocket.wait('landing_company').then(() => {
            if (!has_virtual_only) {
                BinarySocket.send({ statement: 1, limit: 1 });
                BinarySocket.wait('landing_company', 'get_account_status', 'statement').then(async () => {
                    const is_eligible = await Metatrader.isEligible();
                    if (is_eligible) {
                        applyToAllElements('.metatrader-link', (element) => { element.setVisibility(1); });
                    }
                });
            }
            el_closure_loading.setVisibility(0);
            showStep(1);
        }).catch((error) => {
            showFormMessage(error.message);
            el_closure_loading.setVisibility(0);
        });

        const modal_back_items = document.getElementsByClassName('modal-back');
        Array.from(modal_back_items).forEach((item) => {
            item.addEventListener('click', () => {
                hideDialogs();
            });
        });

        el_dialog_container.setVisibility(1);

        el_deacivate_button.addEventListener('click', () => {
            el_account_closure_warning.setVisibility(0);
            deactivate();
        });

        el_form_closure_step_1.addEventListener('submit', (e) => {
            e.preventDefault();
            showStep(2);
        });

        el_step_2_submit.addEventListener('click', (e) => {
            if (!el_step_2_submit.classList.contains('button-disabled')) {
                e.preventDefault();
                el_account_closure_warning.setVisibility(1);
            }
        });

        el_step_2_back.addEventListener('click', () => {
            showStep(1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        reason_checkbox_list.forEach(element => {
            element.addEventListener('change', () => { onSelectedReasonChange(); });
        });

        el_suggested_improves.addEventListener('input', onTextChanged);
        el_other_trading_platforms.addEventListener('input', onTextChanged);
    };

    const showStep = (step) => {
        Array.from(new Array(number_of_steps)).forEach((_, index) => {
            getElementById(`step_${index + 1}`).setVisibility(index + 1 === step);
        });
    };

    const regex = new RegExp('^[a-zA-Z0-9., \'-]+$');

    const onTextChanged = (e) => {
        if (!regex.test(e.data)) {
            document.execCommand('undo');
            return;
        }
        validateReason();
    };

    const onSelectedReasonChange = () => {
        const num_selected_reasons = getSelectedReasonCount();
        el_step_2_submit.classList[num_selected_reasons > 0 ? 'remove' : 'add']('button-disabled');
        el_error_no_selection.setVisibility(num_selected_reasons > 0 ? 0 : 1);
        if (num_selected_reasons >= 3) {
            reason_checkbox_list.forEach(reason => {
                if (!reason.checked) {
                    reason.disabled = true;
                    reason.classList.add('disable');
                }
            });
        } else {
            reason_checkbox_list.forEach(reason => { reason.disabled = false; });
        }
        getReason();
        validateReason();
    };

    const getSelectedReasonCount = () => Array.from(reason_checkbox_list).filter(el => el.checked).length;

    const deactivate = async () => {
        el_submit_loading.setVisibility(1);
        el_step_2_submit.setAttribute('disabled', true);

        const data = { account_closure: 1, reason: getReason() };
        BinarySocket.send(data).then(async (response) => {
            if (response.error) {
                el_submit_loading.setVisibility(0);
                if (response.error.details) {
                    await showErrorPopUp(response);
                    el_account_closure_error.setVisibility(1);
                } else {
                    showFormMessage(response.error.message || localize('Sorry, an error occurred while processing your request.'));
                }
                el_step_2_submit.setAttribute('disabled', false);
            } else {
                el_submit_loading.setVisibility(0);
                showStep(3);
                window.scrollTo({ top: 0, behavior: 'smooth' });

                sessionStorage.setItem('closingAccount', 1);
                setTimeout(() => {
                    // we need to clear all stored client data by performing a logout action and then redirect to home
                    // otherwise it will think that client is still logged in and redirect to trading page
                    Client.sendLogoutRequest(false, Url.urlFor('home'));
                }, 10000);
            }
        });
    };

    const showErrorPopUp = async (response) => {
        const mt5_login_list = (await BinarySocket.wait('mt5_login_list')).mt5_login_list;
        // clear all previously added details first
        const previous_parent = document.getElementsByClassName('account-closure-details');
        if (previous_parent) { Array.from(previous_parent).forEach(item => { item.parentNode.removeChild(item); }); }
        const el_parent = document.createElement('div');
        el_parent.className = 'gr-padding-10 gr-child account-closure-details';
        let section_id = '';
        let display_name = '';
        const addSection = (account, info) => {
            const el_section_parent = el_parent.cloneNode(true);

            const el_strong = document.createElement('strong');
            el_strong.innerHTML = display_name;
            const el_inner_div = document.createElement('div');
            el_inner_div.innerHTML = account.replace(/^MT[DR]?/i, '');
            const el_span = document.createElement('span');
            el_span.innerHTML = info;

            const el_div = document.createElement('div');
            el_div.appendChild(el_strong);
            el_div.appendChild(el_inner_div);
            el_section_parent.appendChild(el_div);
            el_section_parent.appendChild(el_span);

            const el_section = getElementById(section_id);
            el_section.setVisibility(1).appendChild(el_section_parent);
        };
        const getMTDisplay = (account) => {
            const mt5_account = (mt5_login_list.find(acc => acc.login === account) || {});
            return Client.getMT5AccountDisplays(mt5_account.market_type, mt5_account.sub_account_type).short;
        };
        if (response.error.details.open_positions) {
            Object.keys(response.error.details.open_positions).forEach((account) => {
                const txt_positions = `${response.error.details.open_positions[account]} position(s)`;
                if (/^MT/.test(account)) {
                    section_id = 'account_closure_open_mt';
                    display_name = getMTDisplay(account);
                } else {
                    section_id = 'account_closure_open';
                    display_name = Currency.getCurrencyName(Client.get('currency', account));
                }
                addSection(account, txt_positions);
            });
        }
        if (response.error.details.balance) {
            Object.keys(response.error.details.balance).forEach((account) => {
                const txt_balance = `${response.error.details.balance[account].balance} ${response.error.details.balance[account].currency}`;
                if (/^MT/.test(account)) {
                    section_id = 'account_closure_balance_mt';
                    display_name = getMTDisplay(account);
                } else {
                    section_id = 'account_closure_balance';
                    display_name = Currency.getCurrencyName(response.error.details.balance[account].currency);
                }
                addSection(account, txt_balance);
            });
        }
    };

    const showFormMessage = (localized_msg) => {
        el_error_msg.setAttribute('class', 'errorfield');
        el_error_msg.innerHTML = localized_msg;
        el_error_msg.style.display = 'block';
    };

    const getLabelTextOfCheckBox = (checkbox_id) => {
        const labels = document.getElementsByTagName('LABEL');
        for (let i = 0; i < labels.length; i++) {
            if (labels[i].htmlFor === checkbox_id) {
                return labels[i].textContent;
            }
        }
        return '';
    };

    const validateReason = () => {
        const reason_length = 247
            - checked_reasons.length
            - el_other_trading_platforms.value.length
            - el_suggested_improves.value.length;
        el_remain_characters.innerHTML = localize('Remaining characters: [_1].', (reason_length).toString());
        el_remain_characters.classList[reason_length < 0 ? 'add' : 'remove']('errorfield');
        el_step_2_submit.classList[
            reason_length < 0 || checked_reasons.length === 0
                ? 'add'
                : 'remove'
        ]('button-disabled');
    };

    const getReason = () => {
        const reasons = [];
        reason_checkbox_list.forEach(reason => {
            if (reason.checked) {
                reasons.push(getLabelTextOfCheckBox(reason.id));
            }
        });
        checked_reasons = reasons.toString();
        if (el_other_trading_platforms.value.length !== 0) {
            reasons.push(el_other_trading_platforms.value);
        }
        if (el_suggested_improves.value.length !== 0) {
            reasons.push(el_suggested_improves.value);
        }
        return reasons.toString();
    };

    return {
        onLoad,
    };
})();

module.exports = AccountClosure;
