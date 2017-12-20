import React from 'react';
import CareersShared from '../about/careers_shared.jsx';
import { InfoBox } from '../../_common/components/elements.jsx';


const LgColumnLink = ({
    image,
    title,
    text,
    section,
}) => (
    <div className='gr-6 gr-12-m'>
        <img className='gr-3 gr-centered' src={it.url_for(`/images/pages/careers_for_americans/${image}.svg`)} />
        <p><strong>{title}</strong></p>
        <p>{text}</p>
        <p>
            <a href={it.url_for(`open-positions/job-details?dept=quantitative_analysis#quantitative_${section}`)}>{it.L('Learn more')}</a>
        </p>
    </div>

);

const CareersForAmericans = () => (

<div className='career careers-for-americans'>
    <div className='gr-parent static_full'>
        <div className='container gr-padding-20 gr-parent'>
                <p>{'Looking for a way out of Donald Trump\'s America?'}</p>
            <div className='center-text gr-padding-10 gr-parent'>
                <h1 className='gr-padding-10'>{it.L('Career Opportunities for Americans')}</h1>
                <p>{it.L('Looking for a way out of Donald Trump\'s America? Want to do your best work and fulfil your potential in a country that\'s modern, diverse, and tolerant?')}</p>
                <img className='gr-6 gr-centered gr-padding-10' src={it.url_for('/images/pages/careers_for_americans/usa.jpg')} />
                <p>{it.L('[_1] is one of the world\'s most progressive companies, spread across multiple cities in Asia and Europe. We value experience, drive, and talent. Your moral standards are equally important. You must hold the same core values that define who we are, including integrity, tolerance, diversity, and equal opportunity. If you share our feelings about your new president, you might be on the right track.', it.website_name)}</p>
            </div>
            <div className='gr-padding-20'>
                <h2 className='center-text'>{it.L('Do you see yourself at [_1]?',it.website_name)}</h2>
                <p className='center-text gr-padding-10'>{it.L('Our people need to possess certain attributes, regardless of department. We want someone who loves to:')}</p>
                <div className='gr-row'>
                    <div className='gr-6 gr-12-m'>
                        <ul className='checked'>
                            <li>{it.L('Give their best every day.')}</li>
                            <li>{it.L('Team up with talented people to make an impact.')}</li>
                            <li>{it.L('Get things done in a no-nonsense manner.')}</li>
                        </ul>
                    </div>
                    <div className='gr-6 gr-12-m'>
                        <ul className='checked'>
                            <li>{it.L('Work without bureaucracy and hierarchy.')}</li>
                            <li>{it.L('Have the latest technologies at their disposal.')}</li>
                            <li>{it.L('Learn and improve, day in and day out.')}</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <div className='gr-padding-30 fill-bg-color center-text'>
            <div className='container gr-padding-20'>
                <h2>{it.L('Career Spotlight')}</h2>
                <div className='gr-row'>
                    <LgColumnLink image='data_scientist' title='Data Scientist' section='developer'
                        text={it.L('Generate and execute data-driven ideas and solutions to improve products and services.')} />

                    <LgColumnLink image='quants_analysis' title='Quantitative Analyst' section='analyst'
                        text={it.L('Develop derivatives pricing and risk management algorithms.')} />
                </div>
            </div>
        </div>
        <div className='container'>
            <p className='center-text gr-padding-10'>{it.L('If you decide to join us, you will enjoy a market-based salary, annual performance bonus, health benefits, casual dress code, and flexi hours. We will also assist you with your work permit, and relocation for your spouse and children.')}</p>
            <div className='gr-padding-10'>
                <h2 className='center-text'>{it.L('Join us in one of the following locations:')}</h2>

                <div className='gr-padding-10'></div>

                <div className='gr-row'>
                    <InfoBox padding='4' header={it.L('Msida, Malta')} text={it.L('An old scenic fishing village turned bustling university town, thanks to service and infrastructure developments spurred by the University of Malta.')} />
                    <InfoBox padding='4' header={it.L('Cyberjaya, Malaysia')} text={it.L('A high-tech green township that seamlessly blends modern infrastructure with acres of green spaces and facilities to give you the ultimate work-life balance.')} />
                    <InfoBox padding='4' header={it.L('Kuala Lumpur, Malaysia')} text={it.L('Malaysia\'s federal capital is a city of contrast and diversity, brimming with modern infrastructure, historical attractions, and a multicultural society.')} />
                </div>

            </div>
            <CareersShared />
        </div>
    </div>
</div>

);

export default CareersForAmericans;
