import React from 'react';

export const SidebarContentContainer = ({ id, children }) => (
    <div className='sidebar-collapsible-content' id={id || undefined}>
        {children}
    </div>
);

export const SidebarContent = ({ id, visible, children }) => (
    <div id={`${id}-content`} className={`toggle-content ${visible ? '' : 'invisible'}`}>
        {children}
    </div>
);

export const SidebarSubmenu = ({ id, items = [] }) => {
    const getHref = item_id => `#${item_id}`;
    return (
        <div className='sidebar-collapsible-container'>
            <div className='sidebar-collapsible'>
                <ul id={id}>
                    {items.map((item, idx) => (
                        <li key={idx} id={`${item.id}-link`} className={`${item.submenu ? 'has-submenu' : ''}`} data-show={item.dataShow}>
                            { item.submenu &&
                                <React.Fragment>
                                    <a href={getHref(item.id)}>{item.text}</a>
                                    <ul>
                                        { item.submenu.map((submenu, idx_submenu) => (
                                            <li key={idx_submenu} id={`${submenu.id}-link`} data-show={submenu.dataShow}>
                                                <a href={getHref(submenu.id)}>{submenu.text}</a>
                                            </li>
                                        ))}
                                    </ul>
                                </React.Fragment>}
                            { !item.submenu && item.text &&
                                <a href={getHref(item.id)}>{item.text}</a>}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};
