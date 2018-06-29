import React from 'react';
import PropTypes from 'prop-types';
import MenuItem from './menu_item.jsx';

const MenuList = ({ items }) => (
    <div>
        {
            items.map(({ title, description, img_src, path }, i) => (
                <MenuItem
                    key={i}
                    title={title}
                    description={description}
                    img_src={img_src}
                    path={path}
                />
            ))
        }
    </div>
);

MenuList.propTypes = {
    items: PropTypes.arrayOf(
        PropTypes.shape({
            title      : PropTypes.string,
            description: PropTypes.string,
            img_src    : PropTypes.string,
            path       : PropTypes.string,
        })
    ),
};

export default MenuList;