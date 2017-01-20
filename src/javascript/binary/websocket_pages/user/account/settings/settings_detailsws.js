const detect_hedging  = require('../../../../common_functions/common_functions').detect_hedging;
const ValidateV2      = require('../../../../common_functions/validation_v2').ValidateV2;
const bind_validation = require('../../../../validator').bind_validation;
const Content  = require('../../../../common_functions/content').Content;
const Cookies  = require('../../../../../lib/js-cookie');
const moment   = require('moment');
const dv       = require('../../../../../lib/validation');
const localize = require('../../../../base/localize').localize;
const Client   = require('../../../../base/client').Client;

const SettingsDetailsWS = (function() {
    'use strict';

    const formID = '#frmPersonalDetails',
        RealAccElements = '.RealAcc',
        fieldIDs = {
            address1: '#Address1',
            address2: '#Address2',
            city    : '#City',
            state   : '#State',
            postcode: '#Postcode',
            phone   : '#Phone',
        };
    let changed = false,
        isInitialized;

    const init = function() {
        Content.populate();

        if (Client.get('is_virtual') || Client.get('residence')) {
            initOk();
        } else {
            isInitialized = false;
        }

        BinarySocket.send({ get_settings: '1', req_id: 1 });
    };

    const initOk = function() {
        isInitialized = true;
        const isVirtual = Client.get('is_virtual');
        const isJP = Client.get('residence') === 'jp';
        bind_validation.simple($(formID)[0], {
            schema: isJP ? getJPSchema() : isVirtual ? {} : getNonJPSchema(),
            submit: function(ev, info) {
                ev.preventDefault();
                ev.stopPropagation();
                if (info.errors.length > 0) return false;
                if (!changed) {
                    return showFormMessage('You did not change anything.', false);
                }
                if (isJP) return submitJP(info.values);
                return submitNonJP(info.values);
            },
        });
        if (isJP && !isVirtual) {
            $('#fieldset_email_consent').removeClass('invisible');
            detect_hedging($('#PurposeOfTrading'), $('.hedge'));
        }
    };

    const getDetailsResponse = function(response) {
        if (!isInitialized) {
            initOk();
        }
        const data = response.get_settings;

        $('#lblCountry').text(data.country || '-');
        $('#lblEmail').text(data.email);
        const $email_consent = $('#email_consent');
        if (data.email_consent) {
            $email_consent.prop('checked', 'true');
        }

        $email_consent.on('change', function() {
            changed = true;
        });

        if (Client.get('is_virtual')) { // Virtual Account
            $(RealAccElements).remove();
            $(formID).removeClass('hidden');
            return;
        }
        // Real Account
        const birthDate = data.date_of_birth ? moment.utc(new Date(data.date_of_birth * 1000)).format('YYYY-MM-DD') : '';
        $('#lblBirthDate').text(birthDate);
        // Generate states list
        const residence = Cookies.get('residence');
        if (residence) {
            BinarySocket.send({ states_list: residence, passthrough: { value: data.address_state } });
        }
        if (Client.get('residence') === 'jp') {
            const jpData = response.get_settings.jp_settings;
            $('#lblName').text((data.last_name || ''));
            $('#lblGender').text(localize(jpData.gender) || '');
            $('#lblAddress1').text(data.address_line_1 || '');
            $('#lblAddress2').text(data.address_line_2 || '');
            $('#lblCity').text(data.address_city || '');
            $('#lblPostcode').text(data.address_postcode || '');
            $('#lblPhone').text(data.phone || '');

            $('#AnnualIncome').val(jpData.annual_income);
            $('#FinancialAsset').val(jpData.financial_asset);
            $('#Occupation').val(jpData.occupation);
            $('#Equities').val(jpData.trading_experience_equities);
            $('#Commodities').val(jpData.trading_experience_commodities);
            $('#ForeignCurrencyDeposit').val(jpData.trading_experience_foreign_currency_deposit);
            $('#MarginFX').val(jpData.trading_experience_margin_fx);
            $('#InvestmentTrust').val(jpData.trading_experience_investment_trust);
            $('#PublicCorporationBond').val(jpData.trading_experience_public_bond);
            $('#DerivativeTrading').val(jpData.trading_experience_option_trading);
            $('#PurposeOfTrading').val(jpData.trading_purpose);
            if (jpData.hedge_asset !== null && jpData.hedge_asset_amount !== null) {
                $('#HedgeAsset').val(jpData.hedge_asset);
                $('#HedgeAssetAmount').val(jpData.hedge_asset_amount);
                $('.hedge').removeClass('invisible');
            }
            $('.JpAcc').removeClass('invisible')
                       .removeClass('hidden');

            $('#AnnualIncome, #FinancialAsset, #Occupation, #Equities, #Commodities,' +
                '#ForeignCurrencyDeposit, #MarginFX, #InvestmentTrust, #PublicCorporationBond,' +
                '#DerivativeTrading, #PurposeOfTrading, #HedgeAsset, #HedgeAssetAmount')
                .on('change', function() {
                    changed = true;
                });
        } else {
            $('#lblName').text((data.salutation || '') + ' ' + (data.first_name || '') + ' ' + (data.last_name || ''));
            $(fieldIDs.address1).val(data.address_line_1);
            $(fieldIDs.address2).val(data.address_line_2);
            $(fieldIDs.city).val(data.address_city);

            $(fieldIDs.postcode).val(data.address_postcode);
            $(fieldIDs.phone).val(data.phone);

            $('#Address1, #Address2, #City, #State, #Postcode, #Phone').on('change', function() {
                changed = true;
            });

            $(RealAccElements).removeClass('hidden');
        }

        $(formID).removeClass('hidden');
    };

    const populateStates = function(response) {
        let $field = $(fieldIDs.state);
        const defaultValue = response.echo_req.passthrough.value;
        const states = response.states_list;

        $field.empty();

        if (states && states.length > 0) {
            states.forEach(function(state) {
                $field.append($('<option/>', { value: state.value, text: state.text }));
            });
        } else {
            $field.replaceWith($('<input/>', { id: fieldIDs.state.replace('#', ''), name: 'address_state', type: 'text', maxlength: '35' }));
            $field = $(fieldIDs.state);
        }

        $field.val(defaultValue);
        $('#lblState').text($('#State').find('option:selected').text());
        $field.on('change', function() {
            changed = true;
        });
    };

    const toJPSettings = function(data) {
        const jp_settings = {};
        jp_settings.annual_income                               = data.annualIncome;
        jp_settings.financial_asset                             = data.financialAsset;
        jp_settings.occupation                                  = data.occupation;
        jp_settings.trading_experience_equities                 = data.equities;
        jp_settings.trading_experience_commodities              = data.commodities;
        jp_settings.trading_experience_foreign_currency_deposit = data.foreignCurrencyDeposit;
        jp_settings.trading_experience_margin_fx                = data.marginFX;
        jp_settings.trading_experience_investment_trust         = data.InvestmentTrust;
        jp_settings.trading_experience_public_bond              = data.publicCorporationBond;
        jp_settings.trading_experience_option_trading           = data.derivativeTrading;
        jp_settings.trading_purpose                             = data.purposeOfTrading;
        if (data.purposeOfTrading === 'Hedging') {
            jp_settings.hedge_asset        = data.hedgeAsset;
            jp_settings.hedge_asset_amount = data.hedgeAssetAmount;
        }
        return { jp_settings: jp_settings };
    };

    const submitJP = function(data) {
        const trim = function(s) {
            return $(s).val().trim();
        };
        setDetails(Client.get('is_virtual') ? data :
            toJPSettings({
                hedgeAssetAmount      : trim('#HedgeAssetAmount'),
                annualIncome          : trim('#AnnualIncome'),
                financialAsset        : trim('#FinancialAsset'),
                occupation            : trim('#Occupation'),
                equities              : trim('#Equities'),
                commodities           : trim('#Commodities'),
                foreignCurrencyDeposit: trim('#ForeignCurrencyDeposit'),
                marginFX              : trim('#MarginFX'),
                InvestmentTrust       : trim('#InvestmentTrust'),
                publicCorporationBond : trim('#PublicCorporationBond'),
                derivativeTrading     : trim('#DerivativeTrading'),
                purposeOfTrading      : trim('#PurposeOfTrading'),
                hedgeAsset            : trim('#HedgeAsset'),
            }));
    };

    const getJPSchema = function() {
        const V2 = ValidateV2;
        if (/Hedging/.test($('#PurposeOfTrading').val())) {
            return {
                hedge_asset_amount: [
                    function(v) { return dv.ok(v.trim()); },
                    V2.required,
                    V2.regex(/^\d+$/, [Content.localize().textNumbers]),
                ],
            };
        }
        // else there is nothing to validate
        return {};
    };

    const submitNonJP = function(data) {
        delete data.hedge_asset_amount;
        setDetails(data);
    };

    const getNonJPSchema = function() {
        const letters = Content.localize().textLetters,
            numbers = Content.localize().textNumbers,
            space   = Content.localize().textSpace,
            period  = Content.localize().textPeriod,
            comma   = Content.localize().textComma;

        const V2 = ValidateV2;
        const isAddress  = V2.regex(/^[^~!#$%^&*)(_=+\[}{\]\\\"\;\:\?\><\|]+$/,          [letters, numbers, space, period, comma, '- . / @ \' ']);
        const isCity     = V2.regex(/^[^~!@#$%^&*)(_=+\[\}\{\]\\\/\"\;\:\?\><\,\|\d]+$/, [letters, space, '- . \' ']);
        const isState    = V2.regex(/^[^~!@#$%^&*)(_=+\[\}\{\]\\\/\"\;\:\?\><\|]+$/,     [letters, numbers, space, comma, '- . \'']);
        const isPostcode = V2.regex(/^[^+]{0,20}$/,                                      [letters, numbers, space, '-']);
        const isPhoneNo  = V2.regex(/^(|\+?[0-9\s\-]+)$/,                                [numbers, space, '-']);

        const maybeEmptyAddress = function(value) {
            return value.length ? isAddress(value) : dv.ok(value);
        };

        return {
            address_line_1  : [V2.required, isAddress],
            address_line_2  : [maybeEmptyAddress],
            address_city    : [V2.required, isCity],
            address_state   : [V2.required, isState],
            address_postcode: [V2.lengthRange(0, 20), isPostcode],
            phone           : [V2.lengthRange(6, 35), isPhoneNo],
        };
    };

    const setDetails = function(data) {
        const req = { set_settings: 1 };
        Object.keys(data).forEach(function(key) {
            req[key] = data[key];
        });
        if ($('#email_consent:checked').length > 0) {
            req.email_consent = 1;
        } else {
            req.email_consent = 0;
        }
        BinarySocket.send(req);
    };

    const showFormMessage = function(msg, isSuccess) {
        $('#formMessage')
            .attr('class', isSuccess ? 'success-msg' : 'errorfield')
            .html(isSuccess ? '<ul class="checked"><li>' + localize(msg) + '</li></ul>' : localize(msg))
            .css('display', 'block')
            .delay(5000)
            .fadeOut(1000);
    };

    const setDetailsResponse = function(response) {
        // allow user to resubmit the form on error.
        changed = response.set_settings !== 1;
        showFormMessage(changed ?
            'Sorry, an error occurred while processing your account.' :
            'Your settings have been updated successfully.', !changed);
    };

    const onLoad = function() {
        BinarySocket.init({
            onmessage: function(msg) {
                const response = JSON.parse(msg.data);
                if (!response) {
                    console.log('some error occured');
                    return;
                }
                const type = response.msg_type;
                switch (type) {
                    case 'authorize':
                        SettingsDetailsWS.init();
                        break;
                    case 'get_settings':
                        if (response.req_id === 1) {
                            SettingsDetailsWS.getDetailsResponse(response);
                        }
                        break;
                    case 'set_settings':
                        SettingsDetailsWS.setDetailsResponse(response);
                        break;
                    case 'states_list':
                        SettingsDetailsWS.populateStates(response);
                        break;
                    case 'error':
                        $('#formMessage').attr('class', 'errorfield').text(response.error.message);
                        break;
                    default:
                        break;
                }
            },
        });
        if (Client.get('loginid')) {
            SettingsDetailsWS.init();
        }
    };

    return {
        init              : init,
        getDetailsResponse: getDetailsResponse,
        setDetailsResponse: setDetailsResponse,
        populateStates    : populateStates,
        onLoad            : onLoad,
    };
})();

module.exports = {
    SettingsDetailsWS: SettingsDetailsWS,
};
