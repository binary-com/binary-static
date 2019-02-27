import classNames from 'classnames';
import PropTypes  from 'prop-types';
import React      from 'react';

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
                className={classNames('list__item', {
                    'list__item--selected'   : value === item.value,
                    'list__item--highlighted': highlightedIdx === idx,
                })}
                key={idx}
                name={name}
                value={item.value}
                onClick={handleSelect.bind(null, item)}
            >
                <span className='list__item-text'>{item.text}</span>
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
