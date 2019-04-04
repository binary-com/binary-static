import { localize } from '_common/localize';

const contract_config = {
    ASIANU: {
        name    : localize('Asian Up'),
        position: 'top',
    },
    ASIAND: {
        name    : localize('Asian Down'),
        position: 'bottom',
    },
    CALL: {
        name    : localize('Rise'),
        position: 'top',
    },
    PUT: {
        name    : localize('Fall'),
        position: 'bottom',
    },
    CALLE: {
        name    : localize('Higher or equal'),
        position: 'top',
    },
    PUTE: {
        name    : localize('Lower or equal'),
        position: 'bottom',
    },
    DIGITMATCH: {
        name    : localize('Matches'),
        position: 'top',
    },
    DIGITDIFF: {
        name    : localize('Differs'),
        position: 'bottom',
    },
    DIGITEVEN: {
        name    : localize('Even'),
        position: 'top',
    },
    DIGITODD: {
        name    : localize('Odd'),
        position: 'bottom',
    },
    DIGITOVER: {
        name    : localize('Over'),
        position: 'top',
    },
    DIGITUNDER: {
        name    : localize('Under'),
        position: 'bottom',
    },
    EXPIRYMISS: {
        name    : localize('Ends Outside'),
        position: 'top',
    },
    EXPIRYRANGE: {
        name    : localize('Ends Between'),
        position: 'bottom',
    },
    EXPIRYRANGEE: {
        name    : localize('Ends Between'),
        position: 'top',
    },
    LBFLOATCALL: {
        name    : localize('Close-Low'),
        position: 'middle',
    },
    LBFLOATPUT: {
        name    : localize('High-Close'),
        position: 'middle',
    },
    LBHIGHLOW: {
        name    : localize('High-Low'),
        position: 'middle',
    },
    RANGE: {
        name    : localize('Stays Between'),
        position: 'top',
    },
    UPORDOWN: {
        name    : localize('Goes Outside'),
        position: 'bottom',
    },
    ONETOUCH: {
        name    : localize('Touch'),
        position: 'top',
    },
    NOTOUCH: {
        name    : localize('No Touch'),
        position: 'bottom',
    },
};

export const getContractTypeDisplay = (type) => (contract_config[type].name);
export const getContractTypePosition = (type) => (contract_config[type].position);
