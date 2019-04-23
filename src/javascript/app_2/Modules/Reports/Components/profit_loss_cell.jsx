import React      from 'react';
import PropTypes  from 'prop-types';

const ProfitLossCell = ({ value, children }) => {
    const status = +value.replace(/,/g, '') >= 0 ? 'profit' : 'loss';

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
