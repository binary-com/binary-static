import React from 'react';

import {Li} from '../../_common/components/elements.jsx';

const MobileMenu = () => (
    <div className='gr-hide gr-show-m gr-show-p' id='mobile-menu-container'>
        <div className='gr-hide' id='mobile-menu'>
            <ul>
                <Li text={it.L('Why Us?')}     href={it.url_for('why-us')}         className='ja-hide' />
                <Li text={it.L('Why Us?')}     href={it.url_for('why-us-jp')}      className='invisible ja-show' />
                <Li text={it.L('Get Started')} href={it.url_for('get-started')}    className='ja-hide' />
                <Li text={it.L('Get Started')} href={it.url_for('get-started-jp')} className={'invisible ja-show'} />
                <Li text={it.L('Tour')}        href={it.url_for('tour')}           className={'ja-hide'} />
                <Li text={it.L('Tour')}        href={it.url_for('tour-jp')}        className={'invisible ja-show'} />
                {it.menu.map((item, idx) => {
                    const url = item.url ? it.url_for(item.url) : item.absolute_url;

                    return (
                        <li key={idx} id={item.id} className={`item ${item.className || ''}`}>
                            <a className="link" href={url}>{it.L(item.text)}</a>
                            {item.sub_items &&
                                <ul className="sub_items">
                                    {item.sub_items.map((sub_item, sub_idx) => (
                                        <li key={sub_idx} id={sub_item.id} className={`sub_item ${sub_item.className || ''}`}>
                                            <a className="link" href={it.url_for(sub_item.url)}>{it.L(sub_item.text)}</a>
                                        </li>
                                    ))}
                                </ul>
                            }
                        </li>
                    );
                })}
                <Li
                    text={it.L('Platforms')}      href={it.url_for('platforms')}
                    className='ja-hide'           id='main-navigation-trading'
                />
                <Li
                    text={it.L('Trade')}          href={it.url_for('multi_barriers_trading')}
                    className='invisible ja-show' id='main-navigation-jptrading'
                />
            </ul>
        </div>
    </div>
);

export default MobileMenu;