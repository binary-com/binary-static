import React from 'react';

const Loading = ({ id, theme = 'dark' }) => (
    <div id={id} className={`initial-loader initial-loader--${theme}`}>
        <div className='initial-loader__logo' />
        { Array.from(new Array(4)).map((x, inx) => (
            <div key={inx} className={`initial-loader__circ initial-loader__circ--${inx + 1} circ${inx + 1}`} />
        ))}
    </div>
);

export default Loading;
