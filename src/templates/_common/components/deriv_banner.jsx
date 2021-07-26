import React from 'react';
import PropTypes from 'prop-types';

const DerivBanner = ({ has_margin }) => (
    <div id='multiplier_banner_container' className={`invisible ui-helper-clearfix ${has_margin ? 'has_margin' : ''}`}>
        <a id='multiplier-link' target='_blank' rel='noopener noreferrer' href='#'>
            <div className='multiplier_banner_title'>
                <img className='multiplier_banner_logo' src={it.url_for('images/deriv/deriv-logo.svg')} />
                <h3>{it.L('Multipliers')}</h3>
                <img className='multiplier_banner_phone' src={it.url_for('images/deriv/phone.png')} />
            </div>
            <div className='multiplier_banner_text'>
                <div>
                    <h3>{it.L('Synthetic indices AMPLIFIED')}</h3>
                    <p>{it.L('Try Multipliers on DTrader')}</p>
                </div>
                <div>
                    <div className='multiplier_banner_btn'>{it.L('Try now')}</div>
                </div>
            </div>
        </a>
        <div className='deriv_banner_close' />
    </div>
);

DerivBanner.propTypes = {
    has_margin: PropTypes.bool,
};

export default DerivBanner;
