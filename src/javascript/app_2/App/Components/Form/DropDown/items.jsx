import classNames from 'classnames';
import PropTypes  from 'prop-types';
import React      from 'react';
import Tooltip    from 'App/Components/Elements/tooltip.jsx';

const Items = ({
    handleSelect,
    has_symbol,
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
                {!!has_symbol && item.has_tooltip &&
                <Tooltip alignment='top' className='list__item-tooltip' message={item.text}>
                    <i><span className={`symbols list__item-tooltip-symbols symbols--${(item.text || '').toLowerCase()}`} /></i>
                </Tooltip>
                }
                {!!has_symbol && !item.has_tooltip &&
                    <span className={`list__item-text symbols symbols--${(item.text || '').toLowerCase()}`} />
                }
                {!has_symbol && <span className='list__item-text'>{item.text}</span>}
            </div>
        </React.Fragment>
    ))
);

Items.propTypes = {
    handleSelect: PropTypes.func,
    has_symbol  : PropTypes.bool,
    name        : PropTypes.string,
    value       : PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
};

export default Items;
