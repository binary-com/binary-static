/* eslint-disable no-script-url, no-unused-vars, import/no-extraneous-dependencies */
import React from 'react';

const MainMenu = () => (
    <div id="main-menu" className="tab-menu no-print fill-bg-color mt-hide">
        <div className="tab-menu-wrap container gr-hide-m gr-hide-p">
            <div className="gr-12 gr-no-gutter">
                <ul className="items">
                {it.menu.map(item => {
                    const url = item.url ? it.url_for(item.url) : item.absolute_url;
                    return (
                        <li id={item.id} className={`item ${item.className||''}`}>
                            <a className="link" target={item.target || ''}  href={url}>{it.L(item.text)}</a>
                            {item.sub_items &&
                                <ul className="sub_items">
                                    {item.sub_items.map(sub_item => (
                                        <li id={sub_item.id} className={`sub_item ${sub_item.className || ''}`}>
                                            <a className="link" target={sub_item.target || ''} href={it.url_for(sub_item.url)}>
                                                {it.L(sub_item.text)}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            }
                        </li>
                    );
                })}
                </ul>
            </div>
        </div>
    </div>
);
export default MainMenu;