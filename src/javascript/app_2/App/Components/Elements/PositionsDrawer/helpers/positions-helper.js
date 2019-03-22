import moment       from 'moment';
import { localize } from '_common/localize';

export const addCommaToNumber = (number) => number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

export const getTimePercentage = (start_time, purchase_time, expiry_time) => {
    const duration_from_purchase = moment.duration(moment.unix(expiry_time).diff(moment.unix(purchase_time)));
    const duration_from_now = moment.duration(moment.unix(expiry_time).diff(start_time));
    let percentage = (duration_from_now.asMilliseconds() / duration_from_purchase.asMilliseconds()) * 100;

    if (percentage < 0.5) {
        percentage = 1;
    } else if (percentage > 100) {
        percentage = 100;
    }

    return Math.round(percentage);
};

export const getBarrierLabel = (contract_info) => {
    if (checkIfDigitType(contract_info.contract_type)) {
        return localize('Target');
    }
    return localize('Barrier');
};

export const getBarrierValue = (contract_info) => {
    if (checkIfDigitType(contract_info.contract_type)) {
        return addCommaToNumber(digitTypeMap(contract_info)[contract_info.contract_type]);
    }
    return addCommaToNumber(contract_info.barrier);
};

const digitTypeMap = (contract_info) => ({
    DIGITMATCH: localize('Equals [_1]', contract_info.barrier),
    DIGITDIFF : localize('Not [_1]', contract_info.barrier),
    DIGITODD  : localize('Odd'),
    DIGITEVEN : localize('Even'),
    DIGITOVER : localize('Over [_1]', contract_info.barrier),
    DIGITUNDER: localize('Under [_1]', contract_info.barrier),
});

const checkIfDigitType = (contract_type) => (/digit/.test(contract_type.toLowerCase()));
