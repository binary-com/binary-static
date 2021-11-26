import React from 'react';
import PropTypes from 'prop-types';

const EuCloseBanner = ({ has_margin }) => (
    <div
        id='eu_close_banner_container'
        className={`container invisible ${has_margin ? 'has_margin' : ''}`}
    >
        <div className='close_banner_text'>
            <img
                src={it.url_for('images/close-banner/icon_left.png')}
                className='close_banner_img'
            />
            <div className='close_banner_text_wrapper'>
                <h3>Your Options Account is scheduled to be closed</h3>
                <p>Withdraw all funds from your Options Account.</p>
            </div>
        </div>
        <div id='eu_close_banner_btn' className='close_banner_btn'><p>{it.L('Learn more')}</p></div>
    </div>
);

EuCloseBanner.propTypes = {
    has_margin: PropTypes.bool,
};

export default EuCloseBanner;
