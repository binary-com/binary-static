import classNames   from 'classnames';
import PropTypes    from 'prop-types';
import React        from 'react';

const TickSteps = ({ min_value, value, ticks, onClick }) => {
    const arr_ticks = [...Array(ticks).keys()];
    return (
        <React.Fragment>
            {arr_ticks.map(idx =>
                <span
                    key={idx}
                    className={classNames('range-slider__ticks-step', {
                        'range-slider__ticks-step--active': (idx + min_value) === parseInt(value),
                        'range-slider__ticks-step--marked': (idx + min_value) < parseInt(value),
                    })}
                    onClick={(e) => onClick(e, idx + min_value)}
                />
            )}
        </React.Fragment>
    );
};

TickSteps.propTypes = {
    min_value: PropTypes.number,
    onClick  : PropTypes.func,
    ticks    : PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
    value: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
};

export default TickSteps;
