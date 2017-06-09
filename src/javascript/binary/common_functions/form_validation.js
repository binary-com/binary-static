const localize              = require('../base/localize').localize;
const compareBigUnsignedInt = require('../common_functions/string_util').compareBigUnsignedInt;

const Validation = (() => {
    'use strict';

    const forms = {};
    const error_class  = 'error-msg';
    const hidden_class = 'invisible';

    const events_map = {
        input   : 'input change',
        select  : 'change',
        checkbox: 'change',
    };

    const getFieldType = $field => (
        $field.length ? ($field.attr('type') === 'checkbox' ? 'checkbox' : $field.get(0).localName) : null
    );

    const getFieldValue = field => (field.type === 'checkbox' ? (field.$.is(':checked') ? '1' : '') : field.$.val()) || '';

    const initForm = (form_selector, fields) => {
        const $form = $(`${form_selector}:visible`);
        if ($form.length) {
            forms[form_selector] = { $form: $form };
            if (Array.isArray(fields) && fields.length) {
                forms[form_selector].fields = fields;

                fields.forEach((field) => {
                    field.$ = $form.find(field.selector);
                    if (!field.$.length || !field.validations) return;

                    field.type = getFieldType($(field.$[0])); // also handles multiple results
                    field.form = form_selector;
                    if (field.msg_element) {
                        field.$error = $form.find(field.msg_element);
                    } else {
                        const $parent = field.$.parent();
                        // Add indicator to required fields
                        if (/req/.test(field.validations)) {
                            let $label = $parent.parent().find('label');
                            if (!$label.length) $label = $parent.find('label');
                            if ($label.find('span.required_field_asterisk').length === 0) {
                                $label.append($('<span/>', { class: 'required_field_asterisk', text: '*' }));
                            }
                        }
                        if ($parent.find(`div.${error_class}`).length === 0) {
                            $parent.append($('<div/>', { class: `${error_class} ${hidden_class}` }));
                        }
                        field.$error = $parent.find(`.${error_class}`);
                    }

                    const event = events_map[field.type];
                    if (event) {
                        field.$.unbind(event).on(event, () => {
                            checkField(field);
                            if (field.re_check_field) {
                                checkField(forms[form_selector].fields.find(fld => (
                                    fld.selector === field.re_check_field
                                )));
                            }
                        });
                    }
                });
            }
        }
    };

    // ------------------------------
    // ----- Validation Methods -----
    // ------------------------------
    const validRequired = (value, options, field) => {
        if ((typeof value === 'string' ? value.trim() : value).length) return true;
        // else
        validators_map.req.message = field.type === 'checkbox' ? 'Please select the checkbox.' : 'This field is required.';
        return false;
    };
    const validEmail        = value => /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,63}$/.test(value);
    const validPassword     = value => /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]+/.test(value);
    const validLetterSymbol = value => !/[`~!@#$%^&*)(_=+\[}{\]\\\/";:\?><,|\d]+/.test(value);
    const validGeneral      = value => !/[`~!@#$%^&*)(_=+\[}{\]\\\/";:\?><|]+/.test(value);
    const validAddress      = value => !/[`~!#$%^&*)(_=+\[}{\]\\";:\?><|]+/.test(value);
    const validPostCode     = value => /^[a-zA-Z\d-\s]*$/.test(value);
    const validPhone        = value => /^\+?[0-9\s]*$/.test(value);
    const validRegular      = (value, options) => options.regex.test(value);
    const validEmailToken   = value => value.trim().length === 8;

    const validCompare  = (value, options) => value === $(options.to).val();
    const validNotEqual = (value, options) => value !== $(options.to).val();
    const validMin      = (value, options) => (options.min ? value.trim().length >= options.min : true);
    const validLength   = (value, options) => (
        (options.min ? value.trim().length >= options.min : true) &&
        (options.max ? value.trim().length <= options.max : true)
    );

    const validNumber = (value, options) => {
        if (options.allow_empty && value.length === 0) {
            return true;
        }

        let is_ok = true,
            message = '';

        if (!(options.type === 'float' ? /^\d+(\.\d+)?$/ : /^\d+$/).test(value) || !$.isNumeric(value)) {
            is_ok = false;
            message = localize('Should be a valid number');
        } else if (options.type === 'float' && options.decimals &&
            !(new RegExp(`^\\d+(\\.\\d{${options.decimals.replace(/ /g, '')}})?$`).test(value))) {
            is_ok = false;
            message = localize('Only [_1] decimal points are allowed.', [options.decimals]);
        } else if ('min' in options && 'max' in options && (+value < +options.min || isMoreThanMax(value, options))) {
            is_ok = false;
            message = localize('Should be between [_1] and [_2]', [options.min, options.max]);
        } else if ('min' in options && +value < +options.min) {
            is_ok = false;
            message = localize('Should be more than [_1]', [options.min]);
        } else if ('max' in options && isMoreThanMax(value, options)) {
            is_ok = false;
            message = localize('Should be less than [_1]', [options.max]);
        }

        validators_map.number.message = message;
        return is_ok;
    };

    const isMoreThanMax = (value, options) =>
        (options.type === 'float' ? +value > +options.max : compareBigUnsignedInt(value, options.max) === 1);

    const validators_map = {
        req          : { func: validRequired,     message: '' },
        email        : { func: validEmail,        message: 'Invalid email address' },
        password     : { func: validPassword,     message: 'Password should have lower and uppercase letters with numbers.' },
        general      : { func: validGeneral,      message: 'Only letters, numbers, space, hyphen, period, and apostrophe are allowed.' },
        address      : { func: validAddress,      message: 'Only letters, numbers, space, hyphen, period, and apostrophe are allowed.' },
        letter_symbol: { func: validLetterSymbol, message: 'Only letters, space, hyphen, period, and apostrophe are allowed.' },
        postcode     : { func: validPostCode,     message: 'Only letters, numbers, space, and hyphen are allowed.' },
        phone        : { func: validPhone,        message: 'Only numbers and spaces are allowed.' },
        email_token  : { func: validEmailToken,   message: 'Please submit a valid verification token.' },
        compare      : { func: validCompare,      message: 'The two passwords that you entered do not match.' },
        not_equal    : { func: validNotEqual,     message: '[_1] and [_2] cannot be the same.' },
        min          : { func: validMin,          message: 'Minimum of [_1] characters required.' },
        length       : { func: validLength,       message: 'You should enter [_1] characters.' },
        number       : { func: validNumber,       message: '' },
        regular      : { func: validRegular,      message: '' },
    };

    const pass_length = type => ({ min: (/^mt$/.test(type) ? 8 : 6), max: 25 });

    // --------------------
    // ----- Validate -----
    // --------------------
    const checkField = (field) => {
        if (!field.$.is(':visible') || !field.validations) return true;
        let all_is_ok = true,
            message;

        field.validations.some((valid) => {
            if (!valid) return false; // check next validation
            let type,
                options = {};

            if (typeof valid === 'string') {
                type = valid;
            } else {
                type    = valid[0];
                options = valid[1];
            }

            if (type === 'password' && !validLength(getFieldValue(field), pass_length(options))) {
                field.is_ok = false;
                type = 'length';
                options = pass_length(options);
            } else {
                const validator = (type === 'custom' ? options.func : validators_map[type].func);
                field.is_ok = validator(getFieldValue(field), options, field);
            }

            if (!field.is_ok) {
                message = options.message || validators_map[type].message;
                if (type === 'length') {
                    message = localize(message, [options.min === options.max ? options.min : `${options.min}-${options.max}`]);
                } else if (type === 'min') {
                    message = localize(message, [options.min]);
                } else if (type === 'not_equal') {
                    message = localize(message, [localize(options.name1), localize(options.name2)]);
                }
                all_is_ok = false;
                return true; // break on the first error found
            }
            return false; // check next validation
        });

        if (!all_is_ok) {
            showError(field, message);
        } else {
            clearError(field);
        }

        return all_is_ok;
    };

    const clearError = (field) => {
        if (field.$error && field.$error.length) {
            field.$error.setVisibility(0);
        }
    };

    const showError = (field, message) => {
        clearError(field);
        field.$error.text(localize(message)).setVisibility(1);
    };

    const validate = (form_selector) => {
        const form = forms[form_selector];
        if (!form.fields) return true;
        form.is_ok = true;
        form.fields.forEach((field) => {
            if (!checkField(field)) {
                if (form.is_ok && !field.no_scroll) { // first error
                    $.scrollTo(field.$, 500, { offset: -10 });
                }
                form.is_ok = false;
            }
        });
        return form.is_ok;
    };

    return {
        init    : initForm,
        validate: validate,
    };
})();

module.exports = Validation;
