import React from 'react';
import PropTypes from 'prop-types';

const DerivBanner = ({ content_name }) => (
    <React.Fragment>
        <div id='deriv_banner_container' data-show='-eucountry'>
            <a target='_blank' rel='noopener noreferrer' href={`https://deriv.com/interim/deriv/?utm_source=binary&utm_medium=referral&utm_campaign=deriv-launch&utm_content=${content_name}`}>
                <img className='deriv_banner_background' src={it.url_for('images/deriv/deriv-banner-bg.png')} />
                <img className='deriv_banner_background deriv_banner_background_mobile' src={it.url_for('images/deriv/deriv-banner-bg-mobile.png')} />
                <img className='deriv_banner_chevron' src={it.url_for('images/deriv/chevron_right.svg')} />
                <h3 className='deriv_banner_standards'>{it.L('[_1] is rebranding to Deriv.com', it.website_name)}</h3>
                <img className='deriv_banner_platform' src={it.url_for('images/deriv/deriv-platform.png')} />
                <h3 className='deriv_banner_explore'>{it.L('Discover what’s new')}</h3>
            </a>
        </div>
    </React.Fragment>
);

DerivBanner.propTypes = {
    content_name: PropTypes.string,
};

export default DerivBanner;
