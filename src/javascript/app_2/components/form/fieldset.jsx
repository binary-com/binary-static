import classNames from 'classnames';
import React      from 'react';
import PropTypes  from 'prop-types';
import Tooltip    from '../elements/tooltip.jsx';

const Fieldset = ({
    children,
    header,
    icon,
    onMouseEnter,
    onMouseLeave,
    tooltip,
}) => {
    const field_left_class = classNames('field-info left', { icon }, icon);

    return (
        <fieldset onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
            <div className='fieldset-header'>
                <span className={field_left_class}>{header}</span>
                <span className='field-info right'>
                    {!!tooltip &&
                        <Tooltip
                            alignment='left'
                            icon='info'
                            message={tooltip || 'Message goes here.'}
                        />
                    }
                </span>
            </div>
            {children}
        </fieldset>
    );
};

// ToDo:
// - Refactor Last Digit to keep the children as array type.
//   Currently last_digit.jsx returns object (React-Element) as 'children'
//   props type.
Fieldset.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.object,
    ]),
    header      : PropTypes.string,
    icon        : PropTypes.string,
    onMouseEnter: PropTypes.func,
    onMouseLeave: PropTypes.func,
    tooltip     : PropTypes.string,
};

export default Fieldset;
