const FormManager    = require('./form_manager');
const Header         = require('../base/header');
const BinaryPjax     = require('../base/binary_pjax');
const Client         = require('../base/client');
const param          = require('../../_common/url').param;
const localize       = require('../../_common/localize').localize;
const ClientBase     = require('../../_common/base/client_base');
const BinarySocket   = require('../base/socket');
const getElementById = require('../../_common/common_functions').getElementById;
const urlFor         = require('../../_common/url').urlFor;

const AccountOpening = (() => {
    const redirectAccount = () => {
        const upgrade_info = Client.getUpgradeInfo();
        if (!upgrade_info.can_upgrade) {
            BinaryPjax.loadPreviousUrl();
            return -1;
        }
        const real_account_signup_target = param('account_type');
        const is_in_correct_path = upgrade_info.can_upgrade_to.some(lc => lc === real_account_signup_target);
        if (!is_in_correct_path) {
            const upgradable_accounts_count = upgrade_info.can_upgrade_to.length;
            if (upgradable_accounts_count > 1) {
                BinaryPjax.load('user/accounts');
            } else if (upgradable_accounts_count === 1) {
                window.location.replace(urlFor('/new_account/real_account', `account_type=${upgrade_info.can_upgrade_to[0]}`));
            }
            return 1;
        }
        return 0;
    };

    const showResponseError = (response) => {
        getElementById('loading').setVisibility(0);
        getElementById('real_account_wrapper').setVisibility(1);
        const $notice_box = $('#client_message').find('.notice-msg');
        $('#submit-message').empty();
        $notice_box.text(response.msg_type === 'sanity_check' ? localize('There was some invalid character in an input field.') : response.error.message).end()
            .setVisibility(1);
        $.scrollTo($notice_box, 500, { offset: -150 });
    }

    const populateForm = (form_id, getValidations, is_financial) => {
        getResidence(form_id, getValidations);
        handleTaxIdentificationNumber();
        const landing_company  = State.getResponse('landing_company');
        const lc_to_upgrade_to = landing_company[is_financial ? 'financial_company' : 'gaming_company'] || landing_company.financial_company;
        switch (lc_to_upgrade_to.shortcode){
            case 'iom':
                CommonFunctions.elementTextContent(CommonFunctions.getElementById('lc-regulator'), localize('regulated by the UK Gaming Commission (UKGC),'));
                break;
            case 'malta':
                CommonFunctions.elementTextContent(CommonFunctions.getElementById('lc-regulator'), localize('regulated by the Malta Gaming Authority,'));
                break;
            case 'maltainvest':
                CommonFunctions.elementTextContent(CommonFunctions.getElementById('lc-regulator'), localize('regulated by the Malta Financial Services Authority (MFSA),'));
                break;
            default:
                break;
        }

        CommonFunctions.elementTextContent(CommonFunctions.getElementById('lc-name'), lc_to_upgrade_to.name);
        CommonFunctions.elementTextContent(CommonFunctions.getElementById('lc-country'), lc_to_upgrade_to.shortcode === 'iom' ? `the ${lc_to_upgrade_to.country}` : lc_to_upgrade_to.country);
        if (getPropertyValue(landing_company, ['financial_company', 'shortcode']) === 'maltainvest') {
            professionalClient.init(is_financial, false);
        }
        generateBirthDate(landing_company.minimum_age);
        BinarySocket.wait('get_settings').then((response) => {
            const get_settings = response.get_settings;
            let $element,
                value;
            Object.keys(get_settings).forEach((key) => {
                $element = $(`#${key}`);
                value    = get_settings[key];
                if (key === 'date_of_birth' && value) {
                    const moment_val = moment.utc(value * 1000);
                    get_settings[key] = moment_val.format('DD MMM, YYYY');
                    $element.attr({
                        'data-value': toISOFormat(moment_val),
                        'value'     : toISOFormat(moment_val),
                        'type'      : 'text',
                    });
                    $('.input-disabled').attr('disabled', 'disabled');
                } else if (value) $element.val(value);
            });
            if (get_settings.has_secret_answer) {
                $('.security').hide();
            }
        });
    };

    const getResidence = (form_id, getValidations) => {
        BinarySocket.send({ residence_list: 1 }).then((response) => {
            handleResidenceList(response.residence_list, form_id, getValidations);
        });
    };

    const handleResidenceList = (residence_list, form_id, getValidations) => {
        if (residence_list.length > 0) {
            const $place_of_birth = $('#place_of_birth');
            const $phone          = $('#phone');
            const $date_of_birth  = $('#date_of_birth');
            const residence_value = Client.get('residence') || '';
            let residence_text    = '';

            const $options               = $('<div/>');
            const $options_with_disabled = $('<div/>');
            residence_list.forEach((res) => {
                $options.append(CommonFunctions.makeOption({ text: res.text, value: res.value }));
                $options_with_disabled.append(CommonFunctions.makeOption({
                    text       : res.text,
                    value      : res.value,
                    is_disabled: res.disabled,
                }));

                if (residence_value === res.value) {
                    residence_text = res.text;
                    if (res.phone_idd && !$phone.val()) {
                        const phone = State.getResponse('get_settings.phone');
                        $phone.val(phone || `+${res.phone_idd}`);
                    }
                }
            });

            $('#lbl_residence').html($('<strong/>', { text: residence_text }));

            BinarySocket.wait('get_settings').then((response) => {
                const citizen = response.get_settings.citizen;
                const place_of_birth = response.get_settings.place_of_birth;
                const tax_residence = response.get_settings.tax_residence;
                const date_of_birth = response.get_settings.date_of_birth;
                if (date_of_birth) {
                    const dt_date_of_birth = moment.unix(date_of_birth);
                    $date_of_birth
                        .attr('data-value', toISOFormat(dt_date_of_birth))
                        .val(toReadableFormat(dt_date_of_birth));
                }

                if ($place_of_birth.length) {
                    if (place_of_birth) {
                        const txt_place_of_birth =
                            (residence_list.find(obj => obj.value === place_of_birth) || {}).text;
                        $place_of_birth.replaceWith($('<span/>', { text: txt_place_of_birth || place_of_birth, 'data-value': place_of_birth }));
                    } else {
                        $place_of_birth.html($options.html()).val(residence_value);
                    }
                    $place_of_birth.select2({
                        matcher(params, data) {
                            return SelectMatcher(params, data);
                        },
                    });
                }

                if (
                    State.getResponse('authorize.upgradeable_landing_companies')
                        .some(item => ['malta', 'maltainvest', 'iom'].some(lc => lc === item))
                ) {
                    const $citizen = $('#citizen');
                    CommonFunctions.getElementById('citizen_row').setVisibility(1);
                    if ($citizen.length) {
                        if (citizen) {
                            const txt_citizen = (residence_list.find(obj => obj.value === citizen) || {}).text;
                            $citizen.replaceWith($('<span/>', { text: txt_citizen || citizen, 'data-value': citizen }));
                        } else {
                            $citizen.html($options.html()).val(residence_value);
                        }
                        $citizen.select2({
                            matcher(params, data) {
                                return SelectMatcher(params, data);
                            },
                        });
                    }
                }

                const $tax_residence_select = $('#tax_residence');
                $tax_residence_select.html($options.html());

                if (tax_residence) {
                    const tax_residences_arr = tax_residence.split(',');
                    const txt_tax_residence = tax_residences_arr
                        .map((current_residence) =>
                            (residence_list.find(obj => obj.value === current_residence) || {}).text)
                        .join(', ') || tax_residence;
                    $('#lbl_tax_residence').text(txt_tax_residence);

                    $tax_residence_select
                        .select2(tax_residences_arr.length > 1 ? { multiple: true } : {}) // Multiple in some cases, users could prev select more than 1 residence
                        .val(tax_residences_arr) // Set value for validation
                        .attr({ 'data-force': true, 'data-value': tax_residence })
                        .trigger('change');
                    CommonFunctions.getElementById('row_lbl_tax_residence').setVisibility(1);
                } else {
                    $tax_residence_select
                        .select2()
                        .val(residence_value) // Attempt auto-assign country_residence to tax_residence if none set
                        .trigger('change');
                    CommonFunctions.getElementById('row_tax_residence').setVisibility(1);
                }

                Object.keys(response.get_settings).forEach((key) => {
                    if (key === 'date_of_birth') return;
                    const $el = $(`#${key}`);
                    if (response.get_settings[key] && $el) {
                        $el.val(response.get_settings[key]);
                    }
                });
            });
            BinarySocket.send({ states_list: Client.get('residence') }).then(data => handleState(data.states_list, form_id, getValidations));
        }
    };

    const handleTaxIdentificationNumber = () => {
        BinarySocket.wait('get_settings').then((response) => {
            const tax_identification_number = response.get_settings.tax_identification_number;
            if (tax_identification_number) {
                $('#lbl_tax_identification_number').text(tax_identification_number);
                CommonFunctions.getElementById('row_lbl_tax_identification_number').setVisibility(1);
                $('#tax_identification_number')
                    .val(tax_identification_number) // Set value for validation
                    .attr({ 'data-force': true, 'data-value': tax_identification_number });
            } else {
                CommonFunctions.getElementById('row_tax_identification_number').setVisibility(1);
            }
        });
    };

    const setCurrencyForFinancialAccount = async (currency_to_set) => {
        sessionStorage.removeItem('new_financial_account_set_currency');
        await BinarySocket.wait('authorize');
        const response = await BinarySocket.send({ set_account_currency: currency_to_set });
        if (response.error) {
            showResponseError(response);
        } else {
            Client.set('currency', currency_to_set);
            BinarySocket.send({ balance: 1 });
            BinarySocket.send({ payout_currencies: 1 }, { forced: true });
            Header.displayAccountStatus();
            setTimeout(() => { window.location.replace(urlFor('user/set-currency') || urlFor('trading')); }, 500); // need to redirect not using pjax
        }
    };

    const createNewAccount = async (account_details, submit_button) => {
        FormManager.disableButton(submit_button);
        const is_maltainvest_account = !!account_details.new_account_maltainvest;
        const currency = account_details.currency;
        delete account_details.tax_identification_confirm;
        delete account_details.tnc;
        delete account_details.pep_declaration;
        if (is_maltainvest_account) delete account_details.currency;

        const response = await BinarySocket.send(account_details);
        if (response.error) showResponseError(response);
        else {
            localStorage.setItem('is_new_account', 1);
            const email = Client.get('email');
            const loginid = response[is_maltainvest_account ? 'new_account_maltainvest' : 'new_account_real'].client_id;
            const token = response[is_maltainvest_account ? 'new_account_maltainvest' : 'new_account_real'].oauth_token;
            ClientBase.setNewAccount({ email, loginid, token });
            // Set currency after account is created for Maltainvest only
            if (is_maltainvest_account) {
                sessionStorage.setItem('new_financial_account_set_currency', currency);
                window.location.reload();
            } else window.location.replace(urlFor('user/set-currency'));
        }
        FormManager.enableButton(submit_button);
    };

    const showHidePulser = (should_show) => { $('.upgrademessage').children('a').setVisibility(should_show); };

    const registerPepToggle = () => {
        $('#pep_declaration_note_toggle').off('click').on('click', (e) => {
            e.stopPropagation();
            $('#pep_declaration_note_toggle').toggleClass('open');
            $('#pep_declaration_note').slideToggle();
        });
    };

    return {
        createNewAccount,
        redirectAccount,
        registerPepToggle,
        setCurrencyForFinancialAccount,
        showHidePulser,
    };
})();

module.exports = AccountOpening;

