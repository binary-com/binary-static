import React              from 'react';
import PropTypes          from 'prop-types';
import { isProfitOrLoss } from '../Helpers/profit-loss';

const ProfitLossCell = ({ value, children }) => {
    const status = isProfitOrLoss(value);

    return (
        <span className={`amount--${status}`}>
            {children}
        </span>
    );
};

ProfitLossCell.propTypes = {
    value: PropTypes.string,
};

export default ProfitLossCell;
