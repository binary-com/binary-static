import React       from 'react';
import PropTypes   from 'prop-types';
import { NavLink } from 'react-router-dom';
import Url         from '../../../../../_common/url';

// TODO: use BinaryLink once it supports nested routes
const MenuItem = ({ title, description, img_src, path }) => {
    const itemContent = (
        <React.Fragment>
            <div className='menuitem__img_container'>
                <img className='menuitem__img' src={Url.urlForStatic(img_src)} />
            </div>
            <div className='menuitem__content_container'>
                <div className='menuitem__menu_name'>
                    <span>{title}</span>
                </div>
                <div className='menuitem__menu_content'><span>{description}</span></div>
            </div>
        </React.Fragment>
    );

    return (
        path ?
            <NavLink className='menuitem' to={path} activeClassName='menuitem--active'>
                {itemContent}
            </NavLink>
        :
            <div className='menuitem'>{itemContent}</div>
    );
};

MenuItem.propTypes = {
    title      : PropTypes.string,
    description: PropTypes.string,
    img_src    : PropTypes.string,
    path       : PropTypes.string,
};

export default MenuItem;