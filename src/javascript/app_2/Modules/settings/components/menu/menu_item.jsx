import PropTypes   from 'prop-types';
import React       from 'react';
import { NavLink } from 'react-router-dom';
import Url         from '../../../../../_common/url';

// TODO: use BinaryLink once it supports nested routes
const MenuItem = ({ title, description, img_src, path }) => {
    const itemContent = (
        <React.Fragment>
            <img className='menu-item__img' src={Url.urlForStatic(img_src)} />
            <div className='menu-item__content'>
                <div className='menu-item__title'>{title}</div>
                <div className='menu-item__description'>{description}</div>
            </div>
        </React.Fragment>
    );

    return (
        path ?
            <NavLink className='menu-item' to={path} activeClassName='menu-item--active'>
                {itemContent}
            </NavLink>
        :
            <div className='menu-item'>{itemContent}</div>
    );
};

MenuItem.propTypes = {
    title      : PropTypes.string,
    description: PropTypes.string,
    img_src    : PropTypes.string,
    path       : PropTypes.string,
};

export default MenuItem;