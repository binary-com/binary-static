import React from 'react';
import PropTypes from 'prop-types';

const DerivBanner = ({ has_margin }) => (
    <React.Fragment>
        <div id='deriv_banner_container' className={`invisible ui-helper-clearfix ${has_margin ? 'has_margin' : ''}`}>
            <a target='_blank' rel='noopener noreferrer' href={`${it.deriv_banner_url}interim/faq/?utm_source=binary&utm_medium=referral&utm_campaign=ww-banner-deriv-1020-en&utm_content=deriv-banner-rebranding`}>
                <img className='deriv_banner_background' src={it.url_for('images/deriv/deriv-banner-bg.png')} />
                <img className='deriv_banner_background deriv_banner_background_mobile' src={it.url_for('images/deriv/deriv-banner-bg-mobile.png')} />
                <img className='deriv_banner_chevron' src={it.url_for('images/deriv/chevron_right.svg')} />
                <h3 className='deriv_banner_standards'>{it.L('[_1] is rebranding to Deriv.com', it.website_name)}</h3>
                <img className='deriv_banner_platform' src={it.url_for('images/deriv/deriv-platform.png')} />
                <h3 className='deriv_banner_explore'>{it.L('Discover what’s new')}</h3>
            </a>
            <div className='deriv_banner_close' />
        </div>
        <div id='multiplier_banner_container' className={`invisible ui-helper-clearfix ${has_margin ? 'has_margin' : ''}`}>
            <a target='_blank' rel='noopener noreferrer' href={`${it.deriv_banner_url}trade-types/multiplier/?utm_source=binary&utm_medium=referral&utm_campaign=ww-banner-deriv-1020-en&utm_content=multiplier-banner-synthetic-indices-amplified`}>
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
    </React.Fragment>
);

DerivBanner.propTypes = {
    has_margin: PropTypes.bool,
};

export default DerivBanner;
