import DAO from '../../data/dao';
import { isEmptyObject } from '../../../../../_common/utility';
import { localize } from '../../../../../_common/localize';
import { get as getLanguage } from '../../../../../_common/language';

const getCategories = (contracts_for) => {
    const categories = {};

    if (!contracts_for) return null;

    contracts_for.available.forEach((contract) => {
        if (contract.contract_category && !categories[contract.contract_category]) {
            if (contract.contract_category === 'callput') {
                if (contract.barrier_category === 'euro_atm') {
                    categories.risefall = localize('Rise/Fall');
                } else {
                    categories.higherlower = localize('Higher/Lower');
                }
            } else {
                categories[contract.contract_category] = localize(contract.contract_category_display);
                if (contract.contract_category === 'digits') {
                    categories.matchdiff = localize('Matches/Differs');
                    if (getLanguage() !== 'ID') {
                        categories.evenodd   = localize('Even/Odd');
                        categories.overunder = localize('Over/Under');
                    }
                }
            }
        }
    });

    if (isEmptyObject(categories)) return null;

    if (categories.risefall || categories.higherlower) {
        categories.updown = localize('Up/Down');
    }

    if (categories.endsinout || categories.staysinout) {
        categories.inout = localize('In/Out');
    }

    return categories;
};

const getHierarchy = (categories) => {
    // needs to be redefined every time because we are removing values that aren't available for contract
    const tree = {
        updown      : ['risefall', 'higherlower'],
        touchnotouch: [],
        inout       : ['endsinout', 'staysinout'],
        asian       : [],
        digits      : ['matchdiff', 'evenodd', 'overunder'],
    };

    Object.keys(tree).map((value) => {
        if (tree[value].length) {
            tree[value] = tree[value].filter(sub_value => categories[sub_value]);
            if (!tree[value].length) {
                delete tree[value];
            }
        } else if (!categories[value]) {
            delete tree[value];
        }
    });

    return tree;
};

export const getContractTypes = (symbol) => DAO.getContractsFor(symbol).then(r => {
    const categories = getCategories(r.contracts_for);

    return {
        categories,
        contract_types: getHierarchy(categories),
    };
});

export const onContractTypeChange = (new_value) => ({ last_digit_visible: /^(matchdiff|evenodd|overunder)$/.test(new_value) });
