import Client                    from '../../../_common/base/client_base';
import {
    addComma,
    getDecimalPlaces }           from '../../../_common/base/currency_base';
import Password                  from '../../../_common/check_password';
import { localize }              from '../../../_common/localize';
import { compareBigUnsignedInt } from '../../../_common/string_util';
import { cloneObject }           from '../../../_common/utility';

// ------------------------------
// ----- Validation Methods -----
// ------------------------------
const validRequired     = (value/* , options, field */) => {
    if (value === undefined || value === null) {
        return false;
    }

    const str = String(value).replace(/\s/g, '');
    return str.length > 0;
};
const validEmail        = value => /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,63}$/.test(value);
const validPassword     = (value, options, field) => {
    if (/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]+/.test(value)) {
        Password.checkPassword(field.selector);
        return true;
    }
    // else
    return false;
};
const validLetterSymbol = value => !/[`~!@#$%^&*)(_=+[}{\]\\/";:?><,|\d]+/.test(value);
const validGeneral      = value => !/[`~!@#$%^&*)(_=+[}{\]\\/";:?><|]+/.test(value);
const validAddress      = value => !/[`~!$%^&*_=+[}{\]\\"?><|]+/.test(value);
const validPostCode     = value => /^[a-zA-Z\d-\s]*$/.test(value);
const validPhone        = value => /^\+?[0-9\s]*$/.test(value);
const validRegular      = (value, options) => options.regex.test(value);
const validEmailToken   = value => value.trim().length === 8;
const validTaxID        = value => /^[a-zA-Z0-9]*[\w-]*$/.test(value);
const validBarrier      = value => /^[+-]\d+\.?\d*$/.test(value);

const validCompare  = (value, options) => value === $(options.to).val();
const validNotEqual = (value, options) => value !== $(options.to).val();
const validMin      = (value, options) => (options.min ? value.length >= options.min : true);
const validLength   = (value, options) => (
    (options.min ? value.length >= options.min : true) &&
    (options.max ? value.length <= options.max : true)
);

const validNumber = (value, opts) => {
    const options = cloneObject(opts);
    let message = null;
    if (options.allow_empty && value.length === 0) {
        return true;
    }

    let is_ok = true;
    if ('min' in options && typeof options.min === 'function') {
        options.min = options.min();
    }
    if ('max' in options && typeof options.max === 'function') {
        options.max = options.max();
    }

    if (!(options.type === 'float' ? /^\d+(\.\d+)?$/ : /^\d+$/).test(value) || isNaN(value)) {
        is_ok   = false;
        message = localize('Should be a valid number.');
    } else if (options.type === 'float' && options.decimals &&
        !(new RegExp(`^\\d+(\\.\\d{0,${options.decimals}})?$`).test(value))) {
        is_ok   = false;
        message = localize('Up to [_1] decimal places are allowed.', [options.decimals]);
    } else if ('min' in options && 'max' in options && +options.min === +options.max && +value !== +options.min) {
        is_ok   = false;
        message = localize('Should be [_1]', [addComma(options.min, options.format_money ? getDecimalPlaces(Client.get('currency')) : undefined )]);
    } else if ('min' in options && 'max' in options && (+value < +options.min || isMoreThanMax(value, options))) {
        is_ok   = false;
        message = localize('Should be between [_1] and [_2]', [addComma(options.min, options.format_money ? getDecimalPlaces(Client.get('currency')) : undefined ), addComma(options.max, options.format_money ? getDecimalPlaces(Client.get('currency')) : undefined )]);
    } else if ('min' in options && +value < +options.min) {
        is_ok   = false;
        message = localize('Should be more than [_1]', [addComma(options.min, options.format_money ? getDecimalPlaces(Client.get('currency')) : undefined )]);
    } else if ('max' in options && isMoreThanMax(value, options)) {
        is_ok   = false;
        message = localize('Should be less than [_1]', [addComma(options.max, options.format_money ? getDecimalPlaces(Client.get('currency')) : undefined)]);
    }

    pre_build_dvrs.number.message = message;
    return is_ok;
};

const isMoreThanMax = (value, options) =>
    (options.type === 'float' ? +value > +options.max : compareBigUnsignedInt(value, options.max) === 1);

export const pre_build_dvrs = {
    address      : { func: validAddress,      message: 'Only letters, numbers, space, and these special characters are allowed: - . \' # ; : ( ) , @ /' },
    barrier      : { func: validBarrier,      message: 'Only numbers and these special characters are allowed: + - .' },
    compare      : { func: validCompare,      message: 'The two passwords that you entered do not match.' },
    email        : { func: validEmail,        message: 'Invalid email address.' },
    general      : { func: validGeneral,      message: 'Only letters, numbers, space, hyphen, period, and apostrophe are allowed.' },
    length       : { func: validLength,       message: 'You should enter [_1] characters.' },
    letter_symbol: { func: validLetterSymbol, message: 'Only letters, space, hyphen, period, and apostrophe are allowed.' },
    min          : { func: validMin,          message: 'Minimum of [_1] characters required.' },
    not_equal    : { func: validNotEqual,     message: '[_1] and [_2] cannot be the same.' },
    number       : { func: validNumber,       message: '' },
    password     : { func: validPassword,     message: 'Password should have lower and uppercase letters with numbers.' },
    phone        : { func: validPhone,        message: 'Only numbers and spaces are allowed.' },
    postcode     : { func: validPostCode,     message: 'Only letters, numbers, space, and hyphen are allowed.' },
    regular      : { func: validRegular,      message: '' },
    req          : { func: validRequired,     message: '' },
    signup_token : { func: validEmailToken,   message: 'The length of token should be 8.'},
    tax_id       : { func: validTaxID,        message: 'Should start with letter or number, and may contain hyphen and underscore.' },
};

export const pass_length = type => ({ min: (/^mt$/.test(type) ? 8 : 6), max: 25 });
