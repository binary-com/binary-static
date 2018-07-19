import PropTypes    from 'prop-types';
import React        from 'react';
import { localize } from '../../../../../_common/localize';

export default function DatePickerInput(props) {
    return (
        <input
            {...props}
            placeholder={props.placeholder 
                || (props.mode === 'duration' ? localize('Select a duration') : localize('Select date'))}
        />
    );
};

DatePickerInput.propTypes = {
    id         : PropTypes.string,
    name       : PropTypes.string,
    placeholder: PropTypes.string,
    value      : PropTypes.oneOfType([
        PropTypes.number, // duration
        PropTypes.string, // date
    ]),
    mode: PropTypes.string,
};