import React from 'react';

const IcoBanner = ({
    container,
    className,
}) => (
    <div id="ico_banner_container" className={container}>
        <div id="ico_banner" className={`ico-banner invisible ja-hide ${className || ''}`}>
            <div className="gr-row gr-centered">
                <div className="gr-12">
                    <div className="gr-row gr-no-gutter ico-box">
                        <div className="gr-3 gr-padding-10 ico-column left-bg"></div>
                        <div className="gr-9 gr-padding-10 ico-column">
                            <div className="gr-row gr-no-gutter">
                                <div className="gr-8 gr-12-p gr-12-m"><p>{it.L('The [_1] ICO is now live', it.website_name)}</p></div>
                                <div className="gr-4 gr-12-p gr-12-m learn-btn"><a id="ico_link_button" className="button"><span>{it.L('Participate now')}</span></a></div>
                            </div>
                        </div>
                        <div id="close_ico_banner" className="close-btn"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export default IcoBanner;