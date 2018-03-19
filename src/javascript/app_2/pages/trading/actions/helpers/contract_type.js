import moment from 'moment';
import DAO from '../../data/dao';
import { cloneObject, getPropertyValue } from '../../../../../_common/utility';
import { localize } from '../../../../../_common/localize';
import { get as getLanguage } from '../../../../../_common/language';
import { buildDurationConfig } from './duration';


const ContractType = (() => {
    /**
     * components can be undef or an array containing any of: 'start_date', 'barrier', 'last_digit'
     *     ['duration', 'amount'] are omitted, as they're available in all contract types
     */
    const contract_types = {
        rise_fall  : { title: localize('Rise/Fall'),                  trade_types: ['CALL', 'PUT'],               components: ['start_date'], barrier_count: 0 },
        high_low   : { title: localize('Higher/Lower'),               trade_types: ['CALL', 'PUT'],               components: ['barrier'],    barrier_count: 1 },
        touch      : { title: localize('Touch/No Touch'),             trade_types: ['ONETOUCH', 'NOTOUCH'],       components: ['barrier'] },
        end        : { title: localize('Ends Between/Ends Outside'),  trade_types: ['EXPIRYMISS', 'EXPIRYRANGE'], components: ['barrier'] },
        stay       : { title: localize('Stays Between/Goes Outside'), trade_types: ['RANGE', 'UPORDOWN'],         components: ['barrier'] },
        asian      : { title: localize('Asians'),                     trade_types: ['ASIANU', 'ASIAND'],          components: [] },
        match_diff : { title: localize('Matches/Differs'),            trade_types: ['DIGITMATCH', 'DIGITDIFF'],   components: ['last_digit'] },
        even_odd   : { title: localize('Even/Odd'),                   trade_types: ['DIGITODD', 'DIGITEVEN'],     components: [] },
        over_under : { title: localize('Over/Under'),                 trade_types: ['DIGITOVER', 'DIGITUNDER'],   components: ['last_digit'] },
        lb_call    : { title: localize('High-Close'),                 trade_types: ['LBFLOATCALL'],               components: [] },
        lb_put     : { title: localize('Close-Low'),                  trade_types: ['LBFLOATPUT'],                components: [] },
        lb_high_low: { title: localize('High-Low'),                   trade_types: ['LBHIGHLOW'],                 components: [] },
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
    let available_categories     = {};

    const buildContractTypesConfig = (symbol) => DAO.getContractsFor(symbol).then(r => {
        available_contract_types = {};
        available_categories = cloneObject(contract_categories); // To preserve the order (will clean the extra items later in this function)
        r.contracts_for.available.forEach((contract) => {
            const type = Object.keys(contract_types).find(key => (
                contract_types[key].trade_types.indexOf(contract.contract_type) !== -1 &&
                (typeof contract_types[key].barrier_count === 'undefined' || +contract_types[key].barrier_count === contract.barriers) // To distinguish betweeen Rise/Fall & Higher/Lower
            ));

            if (!Exceptions.isExcluded(type)) {
                if (!available_contract_types[type]) {
                    // extend contract_categories to include what is needed to create the contract list
                    const sub_cats = available_categories[Object.keys(available_categories)
                        .find(key => available_categories[key].indexOf(type) !== -1)];
                    sub_cats[sub_cats.indexOf(type)] = { value: type, text: localize(contract_types[type].title) };

                    // populate available contract types
                    available_contract_types[type]        = cloneObject(contract_types[type]);
                    available_contract_types[type].config = {};
                }

                /*
                add to this config if a value you are looking for does not exist yet
                accordingly create a function to retrieve the value
                config: {
                    has_spot: 1,
                    durations: {
                        min_max: {
                            spot: {
                                tick: {
                                    min: 5, // value in ticks, as cannot convert to seconds
                                    max: 10,
                                },
                                intraday: {
                                    min: 18000, // all values converted to seconds
                                    max: 86400,
                                },
                                daily: {
                                    min: 86400,
                                    max: 432000,
                                },
                            },
                            forward: {
                                intraday: {
                                    min: 18000,
                                    max: 86400,
                                },
                            },
                        },
                        units_display: {
                            spot: [
                                { text: 'ticks', value: 't' },
                                { text: 'seconds', value: 's' },
                                { text: 'minutes', value: 'm' },
                                { text: 'hours', value: 'h' },
                                { text: 'days', value: 'd' },
                            ],
                            forward: [
                                { text: 'days', value: 'd' },
                            ],
                        },
                    },
                    forward_starting_dates: [
                        { text: 'Mon - 19 Mar, 2018', open: 1517356800, close: 1517443199 },
                        { text: 'Tue - 20 Mar, 2018', open: 1517443200, close: 1517529599 },
                        { text: 'Wed - 21 Mar, 2018', open: 1517529600, close: 1517615999 },
                    ],
                    trade_types: {
                        'CALL': 'Higher',
                        'PUT': 'Lower',
                    },
                    barriers: {
                        intraday: {
                            high_barrier: '+2.12',
                            low_barrier : '-1.12',
                        },
                        daily: {
                            high_barrier: 1111,
                            low_barrier : 1093,
                        }
                    }
                }
                */

                if (contract.start_type === 'spot') {
                    available_contract_types[type].config.has_spot = 1;
                }

                if (contract.min_contract_duration && contract.max_contract_duration) {
                    available_contract_types[type].config.durations =
                        buildDurationConfig(available_contract_types[type].config.durations, contract);
                }

                if (contract.forward_starting_options) {
                    const forward_starting_options = [];

                    // TODO: handle multiple sessions (right now will create duplicated items in the list)
                    contract.forward_starting_options.forEach(option => {
                        forward_starting_options.push({
                            text : moment.unix(option.open).format('ddd - DD MMM, YYYY'),
                            value: option.open,
                            end  : option.close,
                        });
                    });

                    available_contract_types[type].config.forward_starting_dates = forward_starting_options;
                }

                if (contract.contract_display && contract.contract_type) {
                    const trade_types = available_contract_types[type].config.trade_types || {};

                    trade_types[contract.contract_type] = contract.contract_display;

                    available_contract_types[type].config.trade_types = trade_types;
                }

                if (contract.barriers) {
                    if (!available_contract_types[type].config.barriers) {
                        available_contract_types[type].config.barriers = {};
                    }
                    if (!available_contract_types[type].config.barriers[contract.expiry_type]) {
                        available_contract_types[type].config.barriers[contract.expiry_type] = {};
                    }
                    const obj_barrier = {};
                    if (contract.barrier) {
                        obj_barrier.barrier = contract.barrier;
                    } else {
                        if (contract.low_barrier) {
                            obj_barrier.low_barrier = contract.low_barrier;
                        }
                        if (contract.high_barrier) {
                            obj_barrier.high_barrier = contract.high_barrier;
                        }
                    }
                    available_contract_types[type].config.barriers[contract.expiry_type] = obj_barrier;
                }

            }
        });

        // cleanup categories
        Object.keys(available_categories).forEach((key) => {
            available_categories[key] = available_categories[key].filter(item => typeof item === 'object');
            if (available_categories[key].length === 0) {
                delete available_categories[key];
            }
        });
    });

    const getContractValues = (contract_type, contract_expiry_type, duration_unit) => {
        const form_components   = getComponents(contract_type);
        const obj_trade_types   = getTradeTypes(contract_type);
        const obj_start_dates   = getStartDates(contract_type);
        const obj_start_type    = getStartType(obj_start_dates.start_date);
        const obj_barrier       = getBarriers(contract_type, contract_expiry_type);
        const obj_duration_unit = getDurationUnit(duration_unit, contract_type, obj_start_type.contract_start_type);

        const obj_duration_units_list = getDurationUnitsList(contract_type, obj_start_type.contract_start_type);

        return {
            ...form_components,
            ...obj_trade_types,
            ...obj_start_dates,
            ...obj_start_type,
            ...obj_barrier,
            ...obj_duration_units_list,
            ...obj_duration_unit,
        };
    };

    const getContractType = (list, contract_type) => {
        const list_arr = Object.keys(list || {})
            .reduce((k, l) => ([...k, ...list[l].map(ct => ct.value)]), []);
        return {
            contract_type: list_arr.indexOf(contract_type) === -1 || !contract_type ? list_arr[0] : contract_type,
        };
    };

    const getComponents = (c_type) => ({ form_components: contract_types[c_type].components });

    const getDurationUnitsList = (contract_type, contract_start_type) => {
        const duration_units_list = getPropertyValue(available_contract_types, [contract_type, 'config', 'durations', 'units_display', contract_start_type]) || [];

        return { duration_units_list };
    };

    const getDurationUnit = (duration_unit, contract_type, contract_start_type) => {
        const duration_units = getPropertyValue(available_contract_types, [contract_type, 'config', 'durations', 'units_display', contract_start_type]) || [];
        const arr_units = [];
        duration_units.forEach(obj => {
            arr_units.push(obj.value);
        });

        return {
            duration_unit: (!duration_unit || arr_units.indexOf(duration_unit) === -1) ?
                arr_units[0] : duration_unit,
        };
    };

    // TODO: use this getter function to dynamically compare min/max versus duration amount
    const getDurationMinMax = (contract_type, contract_start_type, contract_expiry_type) => {
        const duration_min_max = getPropertyValue(available_contract_types, [contract_type, 'config', 'durations', 'min_max', contract_start_type, contract_expiry_type]) || {};

        return { duration_min_max };
    };

    const getStartType = (start_date) => {
        const contract_start_type = start_date === 'now' ? 'spot' : 'forward';

        return { contract_start_type };
    };

    const getStartDates = (contract_type) => {
        const config           = getPropertyValue(available_contract_types, [contract_type, 'config']);
        const start_dates_list = [];

        if (config.has_spot) {
            start_dates_list.push({ text: localize('Now'), value: 'now' });
        }
        if (config.forward_starting_dates) {
            start_dates_list.push(...config.forward_starting_dates);
        }

        const start_date = start_dates_list[0].value;

        return { start_date, start_dates_list };
    };

    const getTradeTypes = (contract_type) => ({
        trade_types: getPropertyValue(available_contract_types, [contract_type, 'config', 'trade_types']),
    });

    const getBarriers = (contract_type, expiry_type) => {
        const barriers  = getPropertyValue(available_contract_types, [contract_type, 'config', 'barriers', expiry_type]) || {};
        const barrier_1 = barriers.barrier || barriers.high_barrier || '';
        const barrier_2 = barriers.low_barrier || '';
        return {
            barrier_1: barrier_1.toString(),
            barrier_2: barrier_2.toString(),
        };
    };

    return {
        buildContractTypesConfig,
        getContractValues,
        getContractType,
        getDurationUnitsList,
        getDurationUnit,
        getDurationMinMax,
        getStartType,
        getBarriers,

        getContractCategories: () => available_categories,
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
