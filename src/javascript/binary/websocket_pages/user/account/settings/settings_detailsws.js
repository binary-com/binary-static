const detect_hedging  = require('../../../../common_functions/common_functions').detect_hedging;
const ValidateV2      = require('../../../../common_functions/validation_v2').ValidateV2;
const bind_validation = require('../../../../validator').bind_validation;
const Content  = require('../../../../common_functions/content').Content;
const moment   = require('moment');
const dv       = require('../../../../../lib/validation');
const localize = require('../../../../base/localize').localize;
const Client   = require('../../../../base/client').Client;

const SettingsDetailsWS = (function() {
    'use strict';

    const formID = '#frmPersonalDetails';
    const RealAccElements = '.RealAcc';
    let jpDataKeys = {};
    let isInitialized,
        editable_fields,
        isJP,
        isVirtual,
        residence;

    const init = function() {
        Content.populate();
        editable_fields = {};

        if (Client.get('values_set') && (Client.get('is_virtual') || Client.get('residence'))) {
            initOk();
        } else {
            isInitialized = false;
        }

        BinarySocket.send({ get_settings: '1', req_id: 1 });
    };

    const initOk = function() {
        isInitialized = true;
        isVirtual = Client.get('is_virtual');
        residence = Client.get('residence');
        isJP = residence === 'jp';
        bind_validation.simple($(formID)[0], {
            schema: isJP ? getJPSchema() : isVirtual ? {} : getNonJPSchema(),
            submit: function(ev, info) {
                ev.preventDefault();
                ev.stopPropagation();
                if (info.errors.length > 0) return false;
                let data = info.values;
                data.email_consent = $('#email_consent:checked').length > 0 ? 1 : 0;
                if (isJP) {
                    populateJPSettings();
                    data = $.extend(data, jpDataKeys);
                }
                if (!isChanged(data)) return showFormMessage('You did not change anything.', false);
                return setDetails(Client.get('is_virtual') || data);
            },
        });
        if (isJP && !isVirtual) {
            $('#fieldset_email_consent').removeClass('invisible');
            detect_hedging($('#trading_purpose'), $('.hedge'));
        }
    };

    const isChanged = (data) => {
        let changed = false;
        Object.keys(editable_fields).every((key) => {
            if ((key in data && editable_fields[key] !== data[key]) ||
                (data.jp_settings && key in data.jp_settings && editable_fields[key] !== data.jp_settings[key])) {
                changed = true;
                return false;
            }
            return true;
        });
        return changed;
    };

    const displayGetSettingsData = (data, populate = true) => {
        let $key,
            $lbl_key,
            $data_key,
            has_key,
            has_lbl_key;
        Object.keys(data).forEach((key) => {
            $key = $(`#${key}`);
            $lbl_key = $(`#lbl_${key}`);
            has_key = $key.length > 0;
            has_lbl_key = $lbl_key.length > 0;
            // prioritise labels for japan account
            $key = has_key && has_lbl_key ? (isJP ? $lbl_key : $key) : (has_key ? $key : $lbl_key);
            if ($key.length > 0) {
                $data_key = data[key];
                editable_fields[key] = $data_key;
                if (populate) {
                    if ($key.is(':checkbox')) {
                        $key.prop('checked', !!$data_key);
                    } else if (/(SELECT|INPUT)/.test($key.prop('nodeName'))) {
                        $key.val($data_key);
                    } else {
                        $key.text($data_key ? localize($data_key) : '-');
                    }
                }
            }
        });
    };

    const getDetailsResponse = function(response) {
        if (!isInitialized) {
            initOk();
        }
        const data = response.get_settings;

        data.date_of_birth = data.date_of_birth ? moment.utc(new Date(data.date_of_birth * 1000)).format('YYYY-MM-DD') : '';
        data.name = isJP ? data.last_name : (data.salutation || '') + ' ' + (data.first_name || '') + ' ' + (data.last_name || '');

        displayGetSettingsData(data);

        if (Client.get('is_virtual')) { // Virtual Account
            $(RealAccElements).remove();
            $(formID).removeClass('hidden');
            return;
        }
        // Real Account
        // Generate states list
        if (residence) {
            BinarySocket.send({ states_list: residence, passthrough: { value: data.address_state } });
        }
        if (isJP) {
            const jpData = response.get_settings.jp_settings;
            displayGetSettingsData(jpData);
            if (jpData.hedge_asset !== null && jpData.hedge_asset_amount !== null) {
                $('.hedge').removeClass('invisible');
            }
            $('.JpAcc').removeClass('invisible hidden');
        } else {
            $(RealAccElements).removeClass('hidden');
        }
        $(formID).removeClass('hidden');
    };

    const populateStates = function(response) {
        const address_state = '#address_state';
        let $field = $(address_state);
        const defaultValue = response.echo_req.passthrough.value;
        const states = response.states_list;

        $field.empty();

        if (states && states.length > 0) {
            $field.append($('<option/>', { value: '', text: localize('Please select') }));
            states.forEach(function(state) {
                $field.append($('<option/>', { value: state.value, text: state.text }));
            });
        } else {
            $field.replaceWith($('<input/>', { id: address_state.replace('#', ''), name: 'address_state', type: 'text', maxlength: '35' }));
            $field = $(address_state);
        }

        $field.val(defaultValue);
    };

    const populateJPSettings = function() {
        let id,
            val;
        jpDataKeys = {};
        jpDataKeys.jp_settings = {};
        $('.jp_value').each(function() {
            id = $(this).attr('id');
            if (/lbl_/.test(id)) {
                val = $(this).text();
                jpDataKeys[id.replace('lbl_', '')] = val;
            } else {
                val = $(this).val();
                jpDataKeys.jp_settings[id] = val;
            }
        });
        if (/Hedging/.test($('#trading_purpose').val())) {
            jpDataKeys.jp_settings.hedge_asset = $('#hedge_asset').val();
            jpDataKeys.jp_settings.hedge_asset_amount = $('#hedge_asset_amount').val().trim();
        }
    };

    const getJPSchema = function() {
        const V2 = ValidateV2;
        if (/Hedging/.test($('#trading_purpose').val())) {
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

    const getNonJPSchema = function() {
        const letters = Content.localize().textLetters,
            numbers = Content.localize().textNumbers,
            space   = Content.localize().textSpace,
            period  = Content.localize().textPeriod,
            comma   = Content.localize().textComma;

        const V2 = ValidateV2;
        const isAddress  = V2.regex(/^[^`~!#$%^&*)(_=+\[}{\]\\\"\;\:\?\><\|]+$/,          [letters, numbers, space, period, comma, '- / @ \' ']);
        const isCity     = V2.regex(/^[^`~!@#$%^&*)(_=+\[\}\{\]\\\/\"\;\:\?\><\,\|\d]+$/, [letters, space, '- . \' ']);
        const isState    = V2.regex(/^[^`~!@#$%^&*)(_=+\[\}\{\]\\\/\"\;\:\?\><\|]*$/,     [letters, numbers, space, comma, '- . \'']);
        const isPostcode = V2.regex(/^[^+]{0,20}$/,                                       [letters, numbers, space, '-']);
        const isPhoneNo  = V2.regex(/^(|\+?[0-9\s\-]+)$/,                                 [numbers, space, '-']);

        const maybeEmptyAddress = function(value) {
            return value.length ? isAddress(value) : dv.ok(value);
        };

        return {
            address_line_1  : [V2.required, isAddress],
            address_line_2  : [maybeEmptyAddress],
            address_city    : [V2.required, isCity],
            address_state   : [isState],
            address_postcode: [V2.lengthRange(0, 20), isPostcode],
            phone           : [V2.lengthRange(6, 35), isPhoneNo],
        };
    };

    const setDetails = function(data) {
        const req = { set_settings: 1 };
        Object.keys(data).forEach(function(key) {
            req[key] = data[key];
        });
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
        const is_error = response.set_settings !== 1;
        // don't display the data again, but repopulate the editable_fields
        if (!is_error) displayGetSettingsData(response.echo_req, false);
        showFormMessage(is_error ?
            'Sorry, an error occurred while processing your account.' :
            'Your settings have been updated successfully.', !is_error);
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
