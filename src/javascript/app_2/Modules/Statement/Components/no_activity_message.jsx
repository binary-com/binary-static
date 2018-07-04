import React      from 'react';
import PropTypes  from 'prop-types';
import {localize} from '../../../../_common/localize';
import { connect }       from '../../../Stores/connect';

const NoActivityMessage = ({
    has_selected_date,
}) => (
    <div className='container'>
        <div className='statement__no-activity-msg'>
            {!has_selected_date
                ? localize('Your account has no trading activity.')
                : localize('Your account has no trading activity for the selected period.')
            }
        </div>
    </div>
);

export default connect(
    ({modules}) => ({
        has_selected_date: modules.statement.has_selected_date,
    })
)(NoActivityMessage);
