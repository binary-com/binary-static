import PropTypes    from 'prop-types';
import React        from 'react';
import { localize } from '../../../../../_common/localize';

export default function DatePickerInput(props) {
    return (
        <input
            id={props.id}
            name={props.name}
            className={props.class_name}
            readOnly={props.is_read_only}
            placeholder={props.placeholder 
                || (props.mode === 'duration' ? localize('Select a duration') : localize('Select date'))}
            onChange={props.onChange}
            onClick={props.onClick}
            value={props.value}
        />
    );
};

DatePickerInput.propTypes = {
    class_name  : PropTypes.string,
    id          : PropTypes.string,
    is_read_only: PropTypes.bool,
    mode        : PropTypes.string,
    name        : PropTypes.string,
    onChange    : PropTypes.func,
    onClick     : PropTypes.func,
    placeholder : PropTypes.string,
    is_clearable: PropTypes.bool,
    value       : PropTypes.oneOfType([
        PropTypes.number, // duration
        PropTypes.string, // date
    ]),
};
