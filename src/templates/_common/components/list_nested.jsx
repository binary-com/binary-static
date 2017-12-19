import React from 'react';

const ListNested = ({
    strong,
    header,
    items = [],
    children,
}) => (
    <li>
        {(strong ? <strong>{header}</strong> : {header})}
        <ol className='reset_ol'>
            {items.map((item) => (
                (item.list_nested ?
                    <ListNested items={item.list_nested} header={item.header} strong={item.strong} /> :
                    <li>{item.text}</li>)
            ))}
        </ol>
        {children}
    </li>
);

export default ListNested;
