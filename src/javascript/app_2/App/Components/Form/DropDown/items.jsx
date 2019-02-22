import classNames from 'classnames';
import PropTypes  from 'prop-types';
import React      from 'react';

const Items = ({
    items,
    name,
    value,
    handleSelect,
    has_highlights,
    highlightedIdx,
}) => (
    items.map((item, idx) => (
        <React.Fragment key={idx}>
            <div
                className={classNames('list__item', {
                    'list__item--selected'   : value === item.value,
                    'list__item--highlighted': has_highlights && highlightedIdx === idx,
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
    handleSelect  : PropTypes.func,
    has_highlights: PropTypes.bool,
    highlightedIdx: PropTypes.number,
    name          : PropTypes.string,
    value         : PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
};

export default Items;
