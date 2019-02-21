import React from 'react';

const Loading = ({ is_invisible, theme, id }) => (
    <div id={id} className={`barspinner ${ theme || 'dark'}${is_invisible ? ' invisible' : ''}`}>
        { Array.from(new Array(5)).map((x, inx) => (
            <div key={inx} className={`rect${inx + 1}`} />
        ))}
    </div>
);

export default Loading;
