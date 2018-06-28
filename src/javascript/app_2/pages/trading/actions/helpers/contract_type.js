import moment                         from 'moment';
import { buildBarriersConfig }        from './barrier';
import { buildDurationConfig }        from './duration';
import {
    buildForwardStartingConfig,
    isSessionAvailable }              from './start_date';
import WS                             from '../../../../data/ws_methods';
import { get as getLanguage }         from '../../../../../_common/language';
import { localize }                   from '../../../../../_common/localize';
import { toTitleCase }                from '../../../../../_common/string_util';
import {
    cloneObject,
    getPropertyValue }                from '../../../../../_common/utility';


const ContractType = (() => {
    /**
     * components can be undef or an array containing any of: 'start_date', 'barrier', 'last_digit'
     *     ['duration', 'amount'] are omitted, as they're available in all contract types
     */
    const contract_types = {
        rise_fall  : { title: localize('Rise/Fall'),                  trade_types: ['CALL', 'PUT'],               basis: ['payout', 'stake'], components: ['start_date'], barrier_count: 0 },
        high_low   : { title: localize('Higher/Lower'),               trade_types: ['CALL', 'PUT'],               basis: ['payout', 'stake'], components: ['barrier'],    barrier_count: 1 },
        touch      : { title: localize('Touch/No Touch'),             trade_types: ['ONETOUCH', 'NOTOUCH'],       basis: ['payout', 'stake'], components: ['barrier'] },
        end        : { title: localize('Ends Between/Ends Outside'),  trade_types: ['EXPIRYMISS', 'EXPIRYRANGE'], basis: ['payout', 'stake'], components: ['barrier'] },
        stay       : { title: localize('Stays Between/Goes Outside'), trade_types: ['RANGE', 'UPORDOWN'],         basis: ['payout', 'stake'], components: ['barrier'] },
        asian      : { title: localize('Asians'),                     trade_types: ['ASIANU', 'ASIAND'],          basis: ['payout', 'stake'], components: [] },
        match_diff : { title: localize('Matches/Differs'),            trade_types: ['DIGITMATCH', 'DIGITDIFF'],   basis: ['payout', 'stake'], components: ['last_digit'] },
        even_odd   : { title: localize('Even/Odd'),                   trade_types: ['DIGITODD', 'DIGITEVEN'],     basis: ['payout', 'stake'], components: [] },
        over_under : { title: localize('Over/Under'),                 trade_types: ['DIGITOVER', 'DIGITUNDER'],   basis: ['payout', 'stake'], components: ['last_digit'] },
        lb_call    : { title: localize('Close-Low'),                  trade_types: ['LBFLOATCALL'],               basis: ['multiplier'],      components: [] },
        lb_put     : { title: localize('High-Close'),                 trade_types: ['LBFLOATPUT'],                basis: ['multiplier'],      components: [] },
        lb_high_low: { title: localize('High-Low'),                   trade_types: ['LBHIGHLOW'],                 basis: ['multiplier'],      components: [] },
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

    const buildContractTypesConfig = (symbol) => WS.contractsFor(symbol).then(r => {
        available_contract_types = {};
        available_categories = cloneObject(contract_categories); // To preserve the order (will clean the extra items later in this function)
        r.contracts_for.available.forEach((contract) => {
            const type = Object.keys(contract_types).find(key => (
                contract_types[key].trade_types.indexOf(contract.contract_type) !== -1 &&
                (typeof contract_types[key].barrier_count === 'undefined' || +contract_types[key].barrier_count === contract.barriers) // To distinguish betweeen Rise/Fall & Higher/Lower
            ));

            if (!type || Exceptions.isExcluded(type)) return; // ignore unsupported/excepted contract types

            /*
            add to this config if a value you are looking for does not exist yet
            accordingly create a function to retrieve the value
            config: {
                has_spot: 1,
                durations: {
                    min_max: {
                        spot: {
                            tick    : { min: 5,     max: 10 },    // value in ticks, as cannot convert to seconds
                            intraday: { min: 18000, max: 86400 }, // all values converted to seconds
                            daily   : { min: 86400, max: 432000 },
                        },
                        forward: {
                            intraday: { min: 18000, max: 86400 },
                        },
                    },
                    units_display: {
                        spot: [
                            { text: 'ticks',   value: 't' },
                            { text: 'seconds', value: 's' },
                            { text: 'minutes', value: 'm' },
                            { text: 'hours',   value: 'h' },
                            { text: 'days',    value: 'd' },
                        ],
                        forward: [
                            { text: 'days',    value: 'd' },
                        ],
                    },
                },
                forward_starting_dates: [
                    { text: 'Mon - 19 Mar, 2018', value: 1517356800, sessions: [{ open: obj_moment, close: obj_moment }] },
                    { text: 'Tue - 20 Mar, 2018', value: 1517443200, sessions: [{ open: obj_moment, close: obj_moment }] },
                    { text: 'Wed - 21 Mar, 2018', value: 1517529600, sessions: [{ open: obj_moment, close: obj_moment }] },
                ],
                trade_types: {
                    'CALL': 'Higher',
                    'PUT' : 'Lower',
                },
                barriers: {
                    count   : 2,
                    tick    : { high_barrier: '+1.12', low_barrier : '-1.12' },
                    intraday: { high_barrier: '+2.12', low_barrier : '-2.12' },
                    daily   : { high_barrier: 1111,    low_barrier : 1093 },
                },
            }
            */

            if (!available_contract_types[type]) {
                // extend contract_categories to include what is needed to create the contract list
                const sub_cats = available_categories[Object.keys(available_categories)
                    .find(key => available_categories[key].indexOf(type) !== -1)];
                sub_cats[sub_cats.indexOf(type)] = { value: type, text: localize(contract_types[type].title) };

                // populate available contract types
                available_contract_types[type] = cloneObject(contract_types[type]);
            }
            const config = available_contract_types[type].config || {};

            // set config values
            config.has_spot               = contract.start_type === 'spot';
            config.durations              = buildDurationConfig(contract, config.durations);
            config.trade_types            = buildTradeTypesConfig(contract, config.trade_types);
            config.barriers               = buildBarriersConfig(contract, config.barriers);
            config.forward_starting_dates = buildForwardStartingConfig(contract, config.forward_starting_dates);

            available_contract_types[type].config = config;
        });

        // cleanup categories
        Object.keys(available_categories).forEach((key) => {
            available_categories[key] = available_categories[key].filter(item => typeof item === 'object');
            if (available_categories[key].length === 0) {
                delete available_categories[key];
            }
        });
    });

    const buildTradeTypesConfig = (contract, trade_types = {}) => {
        trade_types[contract.contract_type] = contract.contract_display;
        return trade_types;
    };

    const getArrayDefaultValue = (arr_new_values, value) => (
        arr_new_values.indexOf(value) !== -1 ? value : arr_new_values[0]
    );

    const getContractValues = (store) => {
        const { contract_expiry_type, contract_type, basis, duration_unit, start_date } = store;
        const form_components   = getComponents(contract_type);
        const obj_basis         = getBasis(contract_type, basis);
        const obj_trade_types   = getTradeTypes(contract_type);
        const obj_start_dates   = getStartDates(contract_type, start_date);
        const obj_start_type    = getStartType(obj_start_dates.start_date);
        const obj_barrier       = getBarriers(contract_type, contract_expiry_type);
        const obj_duration_unit = getDurationUnit(duration_unit, contract_type, obj_start_type.contract_start_type);

        const obj_duration_units_list = getDurationUnitsList(contract_type, obj_start_type.contract_start_type);

        return {
            ...form_components,
            ...obj_basis,
            ...obj_trade_types,
            ...obj_start_dates,
            ...obj_start_type,
            ...obj_barrier,
            ...obj_duration_unit,
            ...obj_duration_units_list,
        };
    };

    const getContractType = (list, contract_type) => {
        const arr_list = Object.keys(list || {})
            .reduce((k, l) => ([...k, ...list[l].map(ct => ct.value)]), []);
        return {
            contract_type: getArrayDefaultValue(arr_list, contract_type),
        };
    };

    const getComponents = (c_type) => ({ form_components: ['duration', 'amount', ...contract_types[c_type].components] });

    const getDurationUnitsList = (contract_type, contract_start_type) => ({
        duration_units_list: getPropertyValue(available_contract_types, [contract_type, 'config', 'durations', 'units_display', contract_start_type]) || [],
    });

    const getDurationUnit = (duration_unit, contract_type, contract_start_type) => {
        const duration_units = getPropertyValue(available_contract_types, [contract_type, 'config', 'durations', 'units_display', contract_start_type]) || [];
        const arr_units = [];
        duration_units.forEach(obj => {
            arr_units.push(obj.value);
        });

        return {
            duration_unit: getArrayDefaultValue(arr_units, duration_unit),
        };
    };

    // TODO: use this getter function to dynamically compare min/max versus duration amount
    const getDurationMinMax = (contract_type, contract_start_type, contract_expiry_type) => ({
        duration_min_max: getPropertyValue(available_contract_types, [contract_type, 'config', 'durations', 'min_max', contract_start_type, contract_expiry_type]) || {},
    });

    const getStartType = (start_date) => ({
        // Number(0) refers to 'now'
        contract_start_type: start_date === Number(0) ? 'spot' : 'forward',
    });

    const getStartDates = (contract_type, current_start_date) => {
        const config           = getPropertyValue(available_contract_types, [contract_type, 'config']);
        const start_dates_list = [];

        if (config.has_spot) {
            // Number(0) refers to 'now'
            start_dates_list.push({ text: localize('Now'), value: Number(0) });
        }
        if (config.forward_starting_dates) {
            start_dates_list.push(...config.forward_starting_dates);
        }

        const start_date = start_dates_list.find(item => item.value === current_start_date) ?
            current_start_date : start_dates_list[0].value;

        return { start_date, start_dates_list };
    };

    const getSessions = (contract_type, start_date) => {
        const config   = getPropertyValue(available_contract_types, [contract_type, 'config']) || {};
        const sessions =
                  ((config.forward_starting_dates || []).find(option => option.value === start_date) || {}).sessions;
        return { sessions };
    };

    const hours   = [...Array(24).keys()].map((a)=>`0${a}`.slice(-2));
    const minutes = [...Array(12).keys()].map((a)=>`0${a*5}`.slice(-2));

    const getStartTime = (sessions, start_date, start_time) => {
        let [ hour, minute ] = start_time.split(':');
        const start_moment = moment.unix(start_date).utc().hour(hour).minute(minute);
        if (sessions && !isSessionAvailable(sessions, start_moment)) {
            hour   = hours.find(h => isSessionAvailable(sessions, start_moment.hour(h))) || hour;
            minute = minutes.find(m => isSessionAvailable(sessions, start_moment.minute(m))) || minute;
        }
        return { start_time: `${hour}:${minute}` };
    };

    const getEndTime = (sessions, expiry_date, expiry_time) => {
        let [ hour, minute ] = expiry_time.split(':');
        const start_moment = moment.unix(expiry_date).utc().hour(hour).minute(minute);
        if (sessions && !isSessionAvailable(sessions, start_moment)) {
            hour   = hours.find(h => isSessionAvailable(sessions, start_moment.hour(h))) || hour;
            minute = minutes.find(m => isSessionAvailable(sessions, start_moment.minute(m))) || minute;
        }
        return { expiry_time: `${hour}:${minute}` };
    };

    const getTradeTypes = (contract_type) => ({
        trade_types: getPropertyValue(available_contract_types, [contract_type, 'config', 'trade_types']),
    });

    const getBarriers = (contract_type, expiry_type) => {
        const barriers       = getPropertyValue(available_contract_types, [contract_type, 'config', 'barriers']) || {};
        const barrier_values = barriers[expiry_type] || {};
        const barrier_1      = barrier_values.barrier || barrier_values.high_barrier || '';
        const barrier_2      = barrier_values.low_barrier || '';
        return {
            barrier_count: barriers.count || 0,
            barrier_1    : barrier_1.toString(),
            barrier_2    : barrier_2.toString(),
        };
    };

    const getBasis = (contract_type, basis) => {
        const arr_basis  = getPropertyValue(available_contract_types, [contract_type, 'basis']) || {};
        const basis_list = arr_basis.reduce((cur, bas) => (
            [...cur, { text: localize(toTitleCase(bas)), value: bas }]
        ), []);

        return {
            basis_list,
            basis: getArrayDefaultValue(arr_basis, basis),
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
        getSessions,
        getStartTime,
        getEndTime,

        getContractCategories: () => ({ contract_types_list: available_categories }),
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
