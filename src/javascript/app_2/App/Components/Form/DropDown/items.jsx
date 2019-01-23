import PropTypes from 'prop-types';
import React     from 'react';

const Items = ({
    items,
    name,
    value,
    handleSelect,
    highlightedIdx,
}) => (
    items.map((item, idx) => (
        <React.Fragment key={idx}>
            <div
                className={`list__item ${ value === item.value ? 'list__item--selected' : ''} ${highlightedIdx === idx ? 'list__item--highlighted' : ''}`}
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
    handleSelect  : PropTypes.func,
    highlightedIdx: PropTypes.number,
    name          : PropTypes.string,
    value         : PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
};

export default Items;
