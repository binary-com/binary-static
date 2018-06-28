import React       from 'react';
import PropTypes   from 'prop-types';
import { NavLink } from 'react-router-dom';
import Url         from '../../../../_common/url';

const MenuItem = ({ title, content, img_src, path }) => (
    <NavLink className='menuitem' to={path} activeClassName='menuitem--active'>
        <div className='menuitem__img_container'>
            <img className='menuitem__img' src={Url.urlForStatic(img_src)} />
        </div>
        <div className='menuitem__content_container'>
            <div className='menuitem__menu_name'>
                <span>{title}</span>
            </div>
            <div className='menuitem__menu_content'><span>{content}</span></div>
        </div>
    </NavLink>
);


MenuItem.propTypes = {
    title  : PropTypes.string,
    content: PropTypes.string,
    img_src: PropTypes.string,
    path   : PropTypes.string,
};

export default MenuItem;
