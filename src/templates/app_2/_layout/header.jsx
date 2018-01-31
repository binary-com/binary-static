import React from 'react';

const Header = ({
    id,
    items=[],
}) => (
  <header id={id} className='shadow'>
      <div className='menu-items'>
          <div className='menu-left'>
              <div className='navbar-icons menu-toggle'>
                  <img src={it.url_for('/images/japan/version1/main_menu.svg')} alt='Menu' />
              </div>
              <div className='navbar-icons binary-logo'>
                  <img className='logo-img' src={it.url_for('/images/pages/binary-symbol-logo.svg')} alt='Binary.com' />
              </div>
              { items.length ?
                <div className='menu-links'>
                    {items.map((item, idx) => (
                        <a key={idx} href={item.href || '#'} >
                            <span className={item.icon}>{item.text}</span>
                        </a>
                    ))}
                </div>
                :
                undefined
              }
          </div>
          <div className='navbar-icons notifications-toggle'>
              <img src={it.url_for('/images/japan/version1/main_menu.svg')} alt='Alert' />
          </div>
      </div>
  </header>
);

export default Header;
