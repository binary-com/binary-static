import PropTypes    from 'prop-types';
import React        from 'react';

const NoticeMessage = ({ children }) => (
    <div className='notice-message'>{children}</div>
);

NoticeMessage.propTypes = {
    children: PropTypes.string,
};

export default NoticeMessage;