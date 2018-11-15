import PropTypes      from 'prop-types';
import React          from 'react';
import Url            from '_common/url';
import InkBarDiv      from '../../Elements/InkBar';
import { BinaryLink } from '../../Routes';

const MenuLinks = ({ items }) => (
    <React.Fragment>
        <div className='navbar-icons binary-logo'>
            <img className='logo-img' src={Url.urlForStatic('images/header/symbol.svg')} alt='Binary.com' />
        </div>
        { !!items.length &&
            <InkBarDiv className='menu-links'>
                {items.map((item, idx) => (
                    <BinaryLink key={idx} to={item.link_to}>
                        <span title={item.text}>{item.icon}{item.text}</span>
                    </BinaryLink>
                ))}
            </InkBarDiv>
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
