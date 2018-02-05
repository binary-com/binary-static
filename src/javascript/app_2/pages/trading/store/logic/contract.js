// import DAO from '../../data/dao';
import { localize } from '../../../../../_common/localize';

const Contract = (() => {
    /**
     * components can be undef or an array containing any of: 'start_date', 'barrier', 'last_digit'
     *     ['duration', 'amount'] are omitted, as they're available in all contract types
     */
    const contract_types = {
        rise_fall  : { title: localize('Rise/Fall'),                  types: ['CALL', 'PUT'],               components: ['start_date'] },
        high_low   : { title: localize('Higher/Lower'),               types: ['CALL', 'PUT'],               components: ['barrier'] },
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

    const getContractsList = () => contract_categories;

    const getComponents = (c_type) => contract_types[c_type].components;

    const onContractChange = (c_type) => {
        const form_components = getComponents(c_type);
        return {
            form_components,
        };
    };

    return {
        getContractsList,
        getComponents,
        onContractChange,
    };
})();

export default Contract;
