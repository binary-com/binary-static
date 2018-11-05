import React     from 'react';
import PropTypes from 'prop-types';
import MenuItem  from './menu_item.jsx';

const MenuList = ({ items }) => (
    <div>
        {
            items.map(({ title, description, svg, path }, i) => (
                <MenuItem
                    key={i}
                    title={title}
                    description={description}
                    svg={svg}
                    path={path}
                />
            ))
        }
    </div>
);

MenuList.propTypes = {
    items: PropTypes.arrayOf(
        PropTypes.shape({
            description: PropTypes.string,
            path       : PropTypes.string,
            svg        : PropTypes.string,
            title      : PropTypes.string,
        }),
    ),
};

export default MenuList;
