import moment               from 'moment';
import { convertToUnix }    from '../../../../Utils/Date';
import { getDecimalPlaces } from '../../../../../_common/base/currency_base';
import { isDeepEqual }      from '../../../../../_common/utility';

export const getProposalInfo = (store, response) => {
    const proposal = response.proposal || {};
    const profit   = (proposal.payout - proposal.ask_price) || 0;
    const returns  = profit * 100 / (proposal.payout || 1);

    return {
        profit   : profit.toFixed(getDecimalPlaces(store.currency)),
        returns  : `${returns.toFixed(2)}%`,
        stake    : proposal.display_value,
        payout   : proposal.payout,
        id       : proposal.id || '',
        message  : proposal.longcode || response.error.message,
        has_error: !!response.error,
    };
};

export const createProposalRequests = (store) => {
    const requests = {};

    Object.keys(store.trade_types).forEach((type) => {
        const new_req     = createProposalRequestForContract(store, type);
        const current_req = store.proposal_requests[type];
        if (!isDeepEqual(new_req, current_req)) {
            requests[type] = new_req;
        }
    });

    return requests;
};

const createProposalRequestForContract = (store, type_of_contract) => {
    const obj_expiry = {};
    if (store.expiry_type === 'endtime') {
        const expiry_date = moment.utc(store.expiry_date);
        const start_date  = moment.unix(store.start_date || store.server_time).utc();
        const is_same_day = expiry_date.isSame(start_date, 'day');
        const expiry_time = is_same_day ? store.expiry_time : '23:59:59';
        obj_expiry.date_expiry = convertToUnix(expiry_date.unix(), expiry_time);
    }

    return {
        proposal     : 1,
        subscribe    : 1,
        amount       : parseFloat(store.amount),
        basis        : store.basis,
        contract_type: type_of_contract,
        currency     : store.currency,
        symbol       : store.symbol,
        ...(
            store.start_date &&
            { date_start: convertToUnix(store.start_date, store.start_time) }
        ),
        ...(
            store.expiry_type === 'duration' ?
            {
                duration     : parseInt(store.duration),
                duration_unit: store.duration_unit,
            }
            :
            obj_expiry
        ),
        ...(
            (store.barrier_count > 0 || store.form_components.indexOf('last_digit') !== -1) &&
            { barrier: store.barrier_1 || store.last_digit }
        ),
        ...(
            store.barrier_count === 2 &&
            { barrier2: store.barrier_2 }
        ),
    };
};
