import React from 'react';
import PropTypes from 'prop-types';

const RedirectBanner = ({ has_margin }) => (
    <div
        id='redirect_banner_container'
        className={`banner_container invisible ${has_margin ? 'has_margin' : ''}`}
    >
        <div className='close_banner_text'>
            <img
                src={it.url_for('images/close-banner/icon_left.png')}
                className='close_banner_img'
            />
            <div className='close_banner_text_wrapper'>
                <h3>{it.L('Binary.com is moving to Deriv on 30 November')}</h3>
                <p>{it.L('Start using Deriv with your Binary.com email and password.')}</p>
            </div>
        </div>
        <a id='redirect-link'  target='_blank' rel='noopener noreferrer' href='#'  className='close_banner_btn'><p>{it.L('Trade on Deriv')}</p></a>
        
    </div>
);

RedirectBanner.propTypes = {
    has_margin: PropTypes.bool,
};

export default RedirectBanner;
