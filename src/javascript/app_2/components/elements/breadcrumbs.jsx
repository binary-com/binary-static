import React, { Fragment } from 'react';

const BreadcrumbItem = ({
    name,
    href,
    icon,
    isLastItem,
}) => (
    <Fragment>
        <a href={href} className={isLastItem ? 'disabled' : ''}>
            {icon ?
                <span className='icon'>
                    <img src={icon} />
                </span>
            : ''}
            <span>{name}</span>
        </a>
        {isLastItem ? '' : <span className='separator' />}
    </Fragment>
);

const Breadcrumb = ({ routes }) => (
    <div className='breadcrumb'>
        {routes.map((route, index) => {
            const isLastItem = routes.indexOf(route) === routes.length - 1;
            return (
                <BreadcrumbItem
                    name={route.name}
                    href={route.href}
                    icon={route.icon}
                    key={index}
                    isLastItem={isLastItem}
                />
            );
        })}
    </div>
);

export default Breadcrumb;
