import PropTypes             from 'prop-types';
import React                 from 'react';
// import { IconTradeCategory } from '../../../Assets/Trading/Categories';
import { IconTradeType }     from '../../../Assets/Trading/Types';

// const getIconNameForCategory = (category) => {
//     const map = [
//         { key: 'rise_fall', value: ['put'] },
//         { key: 'rise_fall_equal', value: [] },
//         { key: 'high_low', value: [] },
//         { key: 'end', value: [] },
//         { key: 'stay', value: [] },
//         { key: 'match_diff', value: ['digitmatch', 'digitdiff'] },
//         { key: 'even_odd', value: ['digiteven', 'digitodd'] },
//         { key: 'over_under', value: ['digitover', 'digitunder'] },
//         { key: 'touch', value: [] },
//         { key: 'asian', value: [] },
//         { key: 'lb_call', value: [] },
//         { key: 'lb_put', value: ['put'] },
//         { key: 'lb_high_low', value: [] },
//     ];
//
//     const found = map.find(item => item.value.includes(category));
//     return found ? found.key : category;
// };

const getMarketInformation = (payload) => {
    const { shortcode } = payload;
    const pattern = new RegExp('(^[A-Z]+)_((R_\\d{2,3})|[A-Z]+)');
    const extracted = pattern.exec(shortcode);
    if (extracted !== null) {
        return {
            category  : extracted[1].toLowerCase(),
            underlying: extracted[2].toLowerCase(),
        };
    }
    return null;
};

const StatementRowIcon = ({ payload }) => {
    const should_show_category_icon = typeof payload.shortcode === 'string';
    const market_information = getMarketInformation(payload);
    if (should_show_category_icon && market_information) {
        return <IconTradeType type={market_information.category} />;
        // return <div>Category: {market_information.category} | Underlying: {market_information.underlying}</div>;
    }
    // TODO check all the markets and statement action types
    return <div>{JSON.stringify(payload)}</div>;
};

StatementRowIcon.propTypes = {
    action : PropTypes.string,
    payload: PropTypes.object,
};

export default StatementRowIcon;
