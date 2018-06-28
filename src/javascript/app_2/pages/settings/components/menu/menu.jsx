import React     from 'react';
import PropTypes from 'prop-types';
import MenuList  from './menu_list.jsx';

const Menu = ({ data }) => (
    <div className='settings-menu'>
        {
            data.map(group => (
                <div key={group.title}>
                    <h2 className='settings-menu__group-header'>{group.title}</h2>
                    <hr className='settings-menu__separator'/>
                    <MenuList items={group.items} />
                </div>
            ))
        }
    </div>
);

Menu.propTypes = {
    data: PropTypes.arrayOf(
        PropTypes.shape({
            title: PropTypes.string,
            items: PropTypes.array,
        })
    ),
};

export default Menu;