import React from 'react';
// import SeparatorLine from '../../_common/components/separator_line.jsx';

const Cyberjaya = () =>  (
    <div className='static_full cyberjaya'>
        <div className='introduction'>
            <div className='container gr-row gr-padding-20'>
                <div className='gr-12 gr-padding-20 center-text'>
                    <h1>{it.L('Cyberjaya')}</h1>
                    <h4 className='subheader'>{it.L('High-tech green township')}</h4>
                </div>
                <div className='gr-12 gr-padding-20 center-text'>
                    <h2>{it.L('Introduction')}</h2>
                </div>
                <div className='gr-row'>
                    <div className='gr-5'>
                        <img className='responsive' src={it.url_for('images/pages/careers/cyberjaya/introduction-cyberjaya.jpg')} />
                    </div>
                    <div className='gr-7'>
                        <p className='no-margin-top'>{it.L('Cyberjaya is a pioneer tech hub that lies 30 minutes away from Kuala Lumpur. Established in 1997, Cyberjaya is the heartbeat of the Multimedia Super Corridor — a government-designated zone that aims to accelerate Malaysia’s push to achieve Vision 2020.')}</p>
                        <p>{it.L('Cyberjaya is also a pioneer green township that is designed for sustainable living. It has an urban environment where almost half of its total development area is reserved for public amenities and greenery. It has also taken measures to cut carbon emissions based on a low carbon city framework, becoming a model for sustainable future cities.')}</p>
                    </div>
                </div>
            </div>
        </div>
        <div className='living fill-bg-color'>
            <div className='container gr-row gr-padding-20 center-text'>
                <div className='gr-12 gr-padding-20 center-text'>
                    <h2>{it.L('Living in Cyberjaya')}</h2>
                </div>
            </div>
        </div>
        <div className='misc'>
            <div className='container gr-row gr-padding-20 center-text'>
                <div className='gr-12 gr-padding-20 center-text'>
                    <h2>{it.L('Can\'t miss in Cyberjaya')}</h2>
                </div>
            </div>
        </div>
    </div>
);

export default Cyberjaya;
