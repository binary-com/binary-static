import PropTypes    from 'prop-types';
import React        from 'react';
import { localize } from '../../../../_common/localize';

const NoActivityMessage = ({ has_selected_date }) => (
    <div className='container'>
        <div className='statement__no-activity-msg'>
            {!has_selected_date
                ? localize('Your account has no trading activity.')
                : localize('Your account has no trading activity for the selected period.')
            }
        </div>
    </div>
);

NoActivityMessage.propTypes = {
    has_selected_date: PropTypes.bool,
};

export default NoActivityMessage;
