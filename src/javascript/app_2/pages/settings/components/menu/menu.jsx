import React     from 'react';
import PropTypes from 'prop-types';
import MenuList  from './menu_list.jsx';

const Menu = ({ data }) => (
    <div className='settings__sidebar'>
        {
            data.map(section => (
                <div key={section.title}>
                    <h2 className='settings__section_header'>{section.title}</h2>
                    <hr className='settings__separator'/>
                    <MenuList items={section.items} />
                </div>
            ))
        }
    </div>
);

Menu.propTypes = {
    data: PropTypes.array,
};

export default Menu;