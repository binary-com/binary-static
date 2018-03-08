import React from 'react';
import CareersShared from '../about/careers_shared.jsx';
import { InfoBox } from '../../_common/components/elements.jsx';


const LgColumnLink = ({ image, title, text, section }) => (
    <div className='gr-6 gr-12-m'>
        <img className='gr-3 gr-centered' src={it.url_for(`images/pages/careers_for_americans/${image}.svg`)} />
        <p><strong>{title}</strong></p>
        <p>{text}</p>
        <p>
            <a href={it.url_for(`open-positions/job-details?dept=quantitative_analysis#quantitative_${section}`)}>{('Learn more')}</a>
        </p>
    </div>

);

const CareersForAmericans = () => (
    <div className='career careers-for-americans'>
        <div className='gr-parent static_full'>
            <div className='container gr-padding-20 gr-parent'>
                <div className='center-text gr-padding-10 gr-parent'>
                    <h1 className='gr-padding-10'>{('Career Opportunities for Americans')}</h1>
                    <p>{('Looking for a way out of Donald Trump\'s America? Want to do your best work and fulfil your potential in a country that\'s modern, diverse, and tolerant?')}</p>
                    <img className='gr-6 gr-centered gr-padding-10' src={it.url_for('images/pages/careers_for_americans/usa.jpg')} />
                    <p>{it.website_name}{(' is one of the world\'s most progressive companies, spread across multiple cities in Asia and Europe. We value experience, drive, and talent. Your moral standards are equally important. You must hold the same core values that define who we are, including integrity, tolerance, diversity, and equal opportunity. If you share our feelings about your new president, you might be on the right track.')}</p>
                </div>
                <div className='gr-padding-20'>
                    <h2 className='center-text'>{('Do you see yourself at ')}{it.website_name}{('?')}</h2>
                    <p className='center-text gr-padding-10'>{('Our people need to possess certain attributes, regardless of department. We want someone who loves to:')}</p>
                    <div className='gr-row'>
                        <div className='gr-6 gr-12-m'>
                            <ul className='checked'>
                                <li>{('Give their best every day.')}</li>
                                <li>{('Team up with talented people to make an impact.')}</li>
                                <li>{('Get things done in a no-nonsense manner.')}</li>
                            </ul>
                        </div>
                        <div className='gr-6 gr-12-m'>
                            <ul className='checked'>
                                <li>{('Work without bureaucracy and hierarchy.')}</li>
                                <li>{('Have the latest technologies at their disposal.')}</li>
                                <li>{('Learn and improve, day in and day out.')}</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div className='gr-padding-30 fill-bg-color center-text'>
                <div className='container gr-padding-20'>
                    <h2>{('Career Spotlight')}</h2>
                    <div className='gr-row'>
                        <LgColumnLink
                            image='data_scientist'
                            title='Data Scientist'
                            section='developer'
                            text={('Generate and execute data-driven ideas and solutions to improve products and services.')}
                        />

                        <LgColumnLink
                            image='quants_analysis'
                            title='Quantitative Analyst'
                            section='analyst'
                            text={('Develop derivatives pricing and risk management algorithms.')}
                        />
                    </div>
                </div>
            </div>
            <div className='container'>
                <p className='center-text gr-padding-10'>{('If you decide to join us, you will enjoy a market-based salary, annual performance bonus, health benefits, casual dress code, and flexi hours. We will also assist you with your work permit, and relocation for your spouse and children.')}</p>
                <div className='gr-padding-10'>
                    <h2 className='center-text'>{('Join us in one of the following locations:')}</h2>

                    <div className='gr-padding-10' />

                    <div className='gr-row'>
                        <InfoBox padding='4' header={('Msida, Malta')} text={('An old scenic fishing village turned bustling university town, thanks to service and infrastructure developments spurred by the University of Malta.')} />
                        <InfoBox padding='4' header={('Cyberjaya, Malaysia')} text={('A high-tech green township that seamlessly blends modern infrastructure with acres of green spaces and facilities to give you the ultimate work-life balance.')} />
                        <InfoBox padding='4' header={('Kuala Lumpur, Malaysia')} text={('Malaysia\'s federal capital is a city of contrast and diversity, brimming with modern infrastructure, historical attractions, and a multicultural society.')} />
                    </div>

                </div>
                <CareersShared />
            </div>
        </div>
    </div>
);

export default CareersForAmericans;
