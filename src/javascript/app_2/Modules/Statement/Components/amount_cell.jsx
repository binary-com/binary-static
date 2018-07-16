import classNames from 'classnames';
import React      from 'react';

const AmountCell = ({ value }) => {
    const status = +value.replace(/,/g, '') >= 0 ? 'profit' : 'loss';

    return (
        <span className={`amount--${status}`}>
            {value}
        </span>
    );
};

export default AmountCell;
