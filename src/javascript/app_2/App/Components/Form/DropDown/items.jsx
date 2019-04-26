import classNames          from 'classnames';
import PropTypes           from 'prop-types';
import React               from 'react';
import { Tooltip2 }        from 'App/Components/Elements/Tooltip2';
import { getCurrencyName } from '_common/base/currency_base';

const Items = ({
    handleSelect,
    has_symbol,
    items,
    name,
    value,
}) =>  items.map((item, idx) => {
    const symbol_type_class = item.text ? `symbols--${item.text}` : '';
    return (
        <div
            className={classNames(
                'list__item',
                { 'list__item--selected': value === item.value }
            )}
            name={name}
            value={item.value}
            onClick={handleSelect.bind(null, item)}
            key={idx}
        >
            {!!has_symbol && item.has_tooltip &&
                <Tooltip2
                    alignment='left'
                    message={getCurrencyName(item.value)}
                >
                    <span
                        className={classNames(
                            'symbols',
                            'list__item-symbol',
                            symbol_type_class
                        )}
                    />
                </Tooltip2>
            }

            {!!has_symbol && !item.has_tooltip &&
                <span
                    className={classNames(
                        'list__item-text',
                        'symbols',
                        symbol_type_class,
                    )}
                />
            }

            {!has_symbol &&
                <span className='list__item-text'>{item.text}</span>
            }
        </div>
    );
});

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
