import PropTypes     from 'prop-types';
import React         from 'react';
import { localize }  from '../../../../_common/localize';

const EmptyStatementMessage = ({ has_selected_date }) => (
    <div>
        {!has_selected_date
            ? localize('Your account has no trading activity.')
            : localize('Your account has no trading activity for the selected period.')
        }
    </div>
);

EmptyStatementMessage.propTypes = {
    has_selected_date: PropTypes.bool,
};

export default EmptyStatementMessage;
