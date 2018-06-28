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
    match : PropTypes.object,
    routes: PropTypes.array,
    items : PropTypes.array,
};

export default MenuList;