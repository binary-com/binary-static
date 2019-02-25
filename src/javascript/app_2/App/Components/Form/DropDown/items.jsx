import classNames from 'classnames';
import PropTypes  from 'prop-types';
import React      from 'react';

const Items = ({
    handleSelect,
    items,
    name,
    value,
}) => (
    items.map((item, idx) => (
        <React.Fragment key={idx}>
            <div
                className={classNames('list__item', {
                    'list__item--selected': value === item.value,
                })}
                key={idx}
                name={name}
                value={item.value}
                onClick={handleSelect.bind(null, item)}
            >
                <span>{item.text}</span>
            </div>
        </React.Fragment>
    ))
);

Items.propTypes = {
    handleSelect: PropTypes.func,
    name        : PropTypes.string,
    value       : PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
};

export default Items;
