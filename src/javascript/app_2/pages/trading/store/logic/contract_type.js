import DAO from '../../data/dao';
import { cloneObject } from '../../../../../_common/utility';
import { localize } from '../../../../../_common/localize';
import { get as getLanguage } from '../../../../../_common/language';


const ContractType = (() => {
    /**
     * components can be undef or an array containing any of: 'start_date', 'barrier', 'last_digit'
     *     ['duration', 'amount'] are omitted, as they're available in all contract types
     */
    const contract_types = {
        // TODO instead of hardcoding barrier element to be visible detect it from barrier_count?
        rise_fall  : { title: localize('Rise/Fall'),                  types: ['CALL', 'PUT'],               components: ['start_date'], barrier_count: 0 },
        high_low   : { title: localize('Higher/Lower'),               types: ['CALL', 'PUT'],               components: ['barrier'],    barrier_count: 1 },
        touch      : { title: localize('Touch/No Touch'),             types: ['ONETOUCH', 'NOTOUCH'],       components: ['barrier'] },
        end        : { title: localize('Ends Between/Ends Outside'),  types: ['EXPIRYMISS', 'EXPIRYRANGE'], components: ['barrier'] },
        stay       : { title: localize('Stays Between/Goes Outside'), types: ['RANGE', 'UPORDOWN'],         components: ['barrier'] },
        asian      : { title: localize('Asians'),                     types: ['ASIANU', 'ASIAND'],          components: [] },
        match_diff : { title: localize('Matches/Differs'),            types: ['DIGITMATCH', 'DIGITDIFF'],   components: ['last_digit'] },
        even_odd   : { title: localize('Even/Odd'),                   types: ['DIGITODD', 'DIGITEVEN'],     components: [] },
        over_under : { title: localize('Over/Under'),                 types: ['DIGITOVER', 'DIGITUNDER'],   components: ['last_digit'] },
        lb_call    : { title: localize('High-Close'),                 types: ['LBFLOATCALL'],               components: [] },
        lb_put     : { title: localize('Close-Low'),                  types: ['LBFLOATPUT'],                components: [] },
        lb_high_low: { title: localize('High-Low'),                   types: ['LBHIGHLOW'],                 components: [] },
    };

    const contract_categories = {
        [localize('Up/Down')]       : ['rise_fall', 'high_low'],
        [localize('Touch/No Touch')]: ['touch'],
        [localize('In/Out')]        : ['end', 'stay'],
        [localize('Asians')]        : ['asian'],
        [localize('Digits')]        : ['match_diff', 'even_odd', 'over_under'],
        [localize('Lookback')]      : ['lb_call', 'lb_put', 'lb_high_low'],
    };

    let available_contract_types = {};

    const getContractsList = (symbol) => DAO.getContractsFor(symbol).then(r => {
        available_contract_types = {};
        const categories = cloneObject(contract_categories); // To preserve the order (will clean the extra items later in this function)
        r.contracts_for.available.forEach((contract) => {
            const type = Object.keys(contract_types).find(key => (
                contract_types[key].types.indexOf(contract.contract_type) !== -1 &&
                (typeof contract_types[key].barrier_count === 'undefined' || +contract_types[key].barrier_count === contract.barriers) // To distinguish betweeen Rise/Fall & Higher/Lower
            ));

            if (!Exceptions.isExcluded(type)) {
                if (!available_contract_types[type]) {
                    // extend contract_categories to include what is needed to create the contract list
                    const sub_cats = categories[Object.keys(categories)
                        .find(key => categories[key].indexOf(type) !== -1)];
                    sub_cats[sub_cats.indexOf(type)] = { name: type, title: contract_types[type].title };

                    // populate available contract types
                    available_contract_types[type]                = cloneObject(contract_types[type]);
                    available_contract_types[type].contracts_info = {};
                }

                // contracts_info: {
                //      CALL_spot_daily: {...} // '[contract_type]_[start_type]_[expiry_type]'
                //      PUT_spot_daily: {...}
                // }
                available_contract_types[type].contracts_info[`${contract.contract_type}_${contract.start_type}_${contract.expiry_type}`] = contract;
            }
        });

        // cleanup categories
        Object.keys(categories).forEach((key) => {
            categories[key] = categories[key].filter(item => typeof item === 'object');
            if (categories[key].length === 0) {
                delete categories[key];
            }
        });

        return categories;
    });

    const getContractType = (list, contract_type) => {
        const list_arr = Object.keys(list || {})
            .reduce((k, l) => ([...k, ...list[l].map(ct => ct.name)]), []);
        return {
            contract_type: list_arr.indexOf(contract_type) === -1 || !contract_type ? list_arr[0] : contract_type,
        };
    };

    /**
     * @param {Array} values: pass an array of values that you need to retrieve, e.g. ['barriers', 'barrier']
     * @param {Object} store: a clone of store so we can retrieve the needed values to parse available_contract_types
     * returns {Object} of available values, e.g. { barriers: 1, barrier: "+0.057" }, or { barriers: 0 } if value barrier doesn't exist
     */
    const getContractValues = (values, store) => {
        const contracts_info = available_contract_types[store.contract_type].contracts_info;
        const contract_key   = Object.keys(contracts_info).find(key => new RegExp(`${store.contract_start_type}_${store.contract_expiry_type}`).test(key));

        // TODO: find a better way to handle if start type and expiry type of previous type don't apply to this
        const spare_key      = Object.keys(contracts_info)[0];

        const obj_values = values.reduce((acc, value) => (
            $.extend(acc, {[value]: contracts_info[contract_key || spare_key][value]})
        ), {});

        return obj_values;
    };

    const getComponents = (c_type) => contract_types[c_type].components;

    const onContractChange = (c_type) => {
        const form_components = getComponents(c_type);
        return {
            form_components,
        };
    };

    return {
        getContractsList,
        getContractType,
        onContractChange,
        getContractValues,
    };
})();

const Exceptions = (() => {
    const isIDLanguage = () => getLanguage() === 'ID';

    // if the exception value is true, then it is excluded
    const exceptions = {
        even_odd  : isIDLanguage,
        over_under: isIDLanguage,
    };

    return {
        isExcluded: key => exceptions[key] ? exceptions[key]() : false,
    };
})();

export default ContractType;
