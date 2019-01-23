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
                className={`list-item ${ value === item.value ? 'selected' : ''} ${highlightedIdx === idx ? 'highlighted' : ''}`}
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
    value         : PropTypes.string,
};

export default Items;
