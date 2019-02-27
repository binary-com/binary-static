import PropTypes      from 'prop-types';
import React          from 'react';
import Symbol         from 'Images/app_2/header/symbol.svg';
import { BinaryLink } from '../../Routes';

const MenuLinks = ({ items }) => (
    <React.Fragment>
        <div className='header__navbar-icons header__navbar-icons--binary-logo'>
            <Symbol width='30px' height='30px' />
        </div>
        {!!items.length &&
        <div className='header__menu-links'>
            {
                items.map((item, idx) => (
                    <BinaryLink key={idx} to={item.link_to} className='header__menu-link' active_class='header__menu-link--active'>
                        <span title={item.text} className='header__menu-link-text'>{item.icon}{item.text}</span>
                    </BinaryLink>
                ))
            }
        </div>
        }
    </React.Fragment>
);

MenuLinks.propTypes = {
    items: PropTypes.arrayOf(PropTypes.shape({
        icon: PropTypes.shape({
            className: PropTypes.string,
        }),
        link_to: PropTypes.string,
        text   : PropTypes.string,
    })),
};

export { MenuLinks };
