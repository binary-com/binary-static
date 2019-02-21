import classNames   from 'classnames';
import PropTypes    from 'prop-types';
import React        from 'react';

const TickSteps = ({ value, ticks, onClick }) => {
    const arr_ticks = [...Array(ticks).keys()];
    return (
        <React.Fragment>
            {arr_ticks.map(idx =>
                <span
                    key={idx}
                    className={classNames('range-slider__ticks-step', {
                        'range-slider__ticks-step--active': (idx + 1) === parseInt(value),
                        'range-slider__ticks-step--marked': (idx + 1) < parseInt(value),
                    })}
                    onClick={(e) => onClick(e, idx + 1)}
                />
            )}
        </React.Fragment>
    );
};

TickSteps.propTypes = {
    onClick: PropTypes.func,
    ticks  : PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
    value: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
};

export default TickSteps;
