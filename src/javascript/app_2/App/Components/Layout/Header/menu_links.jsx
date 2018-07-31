import PropTypes      from 'prop-types';
import React          from 'react';
import DivWithInkBar  from '../../Elements/InkBar';
import { BinaryLink } from '../../Routes';
import Url            from '../../../../../_common/url';

const MenuLinks = ({ items }) => (
    <React.Fragment>
        <div className='navbar-icons binary-logo'>
            <img className='logo-img' src={Url.urlForStatic('images/app_2/header/symbol.svg')} alt='Binary.com' />
        </div>
        { !!items.length &&
            <DivWithInkBar className='menu-links'>
                {items.map((item, idx) => (
                    <BinaryLink key={idx} to={item.link_to}>
                        <span className={item.icon} title={item.text}>{item.text}</span>
                    </BinaryLink>
                ))}
            </DivWithInkBar>
        }
    </React.Fragment>
);

MenuLinks.propTypes = {
    items: PropTypes.arrayOf(PropTypes.shape({
        icon   : PropTypes.string,
        text   : PropTypes.string,
        link_to: PropTypes.string,
    })),
};

export { MenuLinks };
