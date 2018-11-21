import PropTypes      from 'prop-types';
import React          from 'react';
import Symbol         from 'Images/app_2/header/symbol.svg';
import InkBarDiv      from '../../Elements/InkBar';
import { BinaryLink } from '../../Routes';

const MenuLinks = ({ items }) => (
    <React.Fragment>
        <div className='navbar-icons binary-logo'>
            <Symbol width='30px' height='30px' />
        </div>
        {!!items.length &&
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
