import classNames                from 'classnames';
import {
    observer,
    PropTypes as MobxPropTypes } from 'mobx-react';
import PropTypes                 from 'prop-types';
import React                     from 'react';
// import ReactTooltip              from 'react-tooltip';
import Tooltip                   from '../Elements/tooltip.jsx';

const InputField = ({
    className,
    error_messages,
    helper,
    is_currency,
    is_disabled,
    label,
    name,
    onChange,
    placeholder,
    prefix,
    required,
    type,
    value,
}) => {
    const has_error = error_messages && error_messages.length;
    const input = 
        <input
            className={classNames({error: has_error})}
            type={type}
            name={name}
            step={is_currency ? '0.01' : undefined}
            placeholder={placeholder || undefined}
            disabled={is_disabled}
            value={value}
            onChange={onChange}
            required={required || undefined}
            data-tip
            data-for={`error_tooltip_${name}`}
        />;

    return (
        <div
            className={`input-field ${className || ''}`}
        >
            {!!label &&
                <label htmlFor={name} className='input-label'>{label}</label>
            }
            {!!prefix &&
                <i><span className={`symbols ${prefix.toLowerCase()}`} /></i>
            }
            {!!helper &&
                <span className='input-helper'>{helper}</span>
            }
            {
                has_error ?
                    <Tooltip alignment='left' message={error_messages[0]}>
                        { input }
                    </Tooltip>
                    :
                    input
            }
        </div>
    );
};

// ToDo: Refactor input_field
// supports more than two different types of 'value' as a prop.
// Quick Solution - Pass two different props to input field.
InputField.propTypes = {
    className     : PropTypes.string,
    error_messages: MobxPropTypes.arrayOrObservableArray,
    helper        : PropTypes.bool,
    is_currency   : PropTypes.bool,
    is_disabled   : PropTypes.string,
    label         : PropTypes.string,
    name          : PropTypes.string,
    onChange      : PropTypes.func,
    placeholder   : PropTypes.string,
    prefix        : PropTypes.string,
    required      : PropTypes.bool,
    type          : PropTypes.string,
    value         : PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
};

export default observer(InputField);
