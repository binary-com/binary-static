import PropTypes     from 'prop-types';
import React         from 'react';
import NoticeMessage from '../../../App/Components/Elements/notice_message.jsx';
import { localize }  from '../../../../_common/localize';

const NoActivityMessage = ({ has_selected_date }) => (
    <div className='container'>
        <NoticeMessage>
            {!has_selected_date
                ? localize('Your account has no trading activity.')
                : localize('Your account has no trading activity for the selected period.')
            }
        </NoticeMessage>
    </div>
);

NoActivityMessage.propTypes = {
    has_selected_date: PropTypes.bool,
};

export default NoActivityMessage;
