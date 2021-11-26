import React from 'react';
import PropTypes from 'prop-types';

const GameCloseBanner = ({ has_margin }) => (
    <div
        id='close_banner_container'
        className={`container banner_container invisible ${has_margin ? 'has_margin' : ''}`}
    >
        <div className='close_banner_text'>
            <img
                src={it.url_for('images/close-banner/icon_left.png')}
                className='close_banner_img'
            />
            <div className='close_banner_text_wrapper'>
                <h3>Your Gaming Account is scheduled to be closed</h3>
                <p>Please proceed to withdraw your funds before 30 November 2021.</p>
            </div>
        </div>
        <div id='close_banner_btn' className='close_banner_btn'><p>{it.L('Learn more')}</p></div>
    </div>
);

GameCloseBanner.propTypes = {
    has_margin: PropTypes.bool,
};

export default GameCloseBanner;
