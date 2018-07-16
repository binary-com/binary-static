import classNames from 'classnames';
import React      from 'react';

const Amount = ({ value }) => {
    const status = +value.replace(/,/g, '') >= 0 ? 'profit' : 'loss';

    return (
        <span className={`amount--${status}`}>
            {value}
        </span>
    );
};

export default Amount;
