import React from 'react';

const SeparatorLine = ({
    no_wrapper,
    show_mobile,
    className,
    sub_class,
    invisible,
}) => {
    const classes1 = `${show_mobile ? '' : 'gr-hide-m'} ${className || ''}`.trim();
    const classes2 = `separator-line ${sub_class || ''} ${invisible ? '' : 'border-bottom'}`;

    return (
        <div className={!no_wrapper ? classes1 : undefined} >
            <div className={classes2 || undefined} />
        </div>
    );
};

export default SeparatorLine;
