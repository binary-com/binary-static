import classNames from 'classnames';
import PropTypes  from 'prop-types';
import React      from 'react';
import Tooltip    from 'App/Components/Elements/tooltip.jsx';

const Items = ({
    has_symbol,
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
                {!!has_symbol && item.has_tooltip &&
                <Tooltip alignment='top' className='list__item__tooltip' message={item.text}>
                    <i><span className={`symbols list__item__tooltip-symbols ${(item.text || '').toLowerCase()}`} /></i>
                </Tooltip>
                }
                {!!has_symbol && !item.has_tooltip &&
                    <span className={`list__item__title symbols ${(item.text || '').toLowerCase()}`} />
                }
                {!has_symbol && <span className='list__item__title'>{item.text}</span>}
            </div>
        </React.Fragment>
    ))
);

Items.propTypes = {
    handleSelect  : PropTypes.func,
    has_symbol    : PropTypes.bool,
    highlightedIdx: PropTypes.number,
    name          : PropTypes.string,
    value         : PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
};

export default Items;
