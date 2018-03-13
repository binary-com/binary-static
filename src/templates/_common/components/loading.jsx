import React from 'react';

const Loading = ({theme}) => (
    <div className={`barspinner ${ theme || 'dark'}`}>
        { Array.from(new Array(5)).map((x, inx) => (
            <div key={inx} className={`rect${inx + 1}`} />
        ))}
    </div>
);

export default Loading;
