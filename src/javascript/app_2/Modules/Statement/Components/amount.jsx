import classNames from 'classnames';
import React      from 'react';

const Amount = ({ content }) => {
    const status = +content.replace(/,/g, '') >= 0 ? 'profit' : 'loss';

    return (
        <span className={`amount--${status}`}>
            {content}
        </span>
    );
};

export default Amount;
