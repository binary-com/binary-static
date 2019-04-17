import PropTypes           from 'prop-types';
import React               from 'react';
import Item                from 'App/Components/Form/DropDown/item.jsx';

const Items = ({
    handleSelect,
    has_symbol,
    items,
    name,
    value,
}) => (
    items.map((item, idx) => (
        <Item
            handleSelect={handleSelect}
            has_symbol={has_symbol}
            item={item}
            key={idx}
            name={name}
            value={value}
        />
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
