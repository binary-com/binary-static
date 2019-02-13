import classNames   from 'classnames';
import PropTypes    from 'prop-types';
import React        from 'react';

const ProgressTicks = ({ value, ticks }) => {
    const arr_ticks = [...Array(ticks).keys()];
    return (
        <React.Fragment>
            {arr_ticks.map(idx =>
                <span
                    key={idx}
                    className={classNames('ticks__step', {
                        'ticks__step--active': (idx + 1) === parseInt(value),
                        'ticks__step--marked': (idx + 1) < parseInt(value),
                    })}
                />
            )}
        </React.Fragment>
    );
};

ProgressTicks.propTypes = {
    ticks: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
    value: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
};

export default ProgressTicks;
