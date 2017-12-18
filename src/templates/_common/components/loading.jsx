import React from 'react'; // eslint-disable-line

const Loading = ({theme}) => (
    <div className={`barspinner ${ theme || 'dark'}`}>
        { Array.from(new Array(5)).map((x, i) => (
            <div className={`rect${i + 1}`}></div>
        ))}
    </div>
);

export default Loading;
