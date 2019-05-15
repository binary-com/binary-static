import React               from 'react';
import { BoxOverlayImage } from '../../_common/components/box_row.jsx';
import ImageSlider         from '../../_common/components/image_slider.jsx';

const Asuncion = () =>  (
    <div className='static_full location-dubai'>
        <div className='introduction'>
            <div className='container gr-row gr-padding-20'>
                <div className='gr-12 gr-padding-20 center-text'>
                    <h1>{it.L('Dubai')}</h1>
                    <h4 className='subheader'>{it.L('City of Gold')}</h4>
                </div>
                <div className='gr-12 gr-padding-20 gr-centered'>
                    <div className='gr-row'>
                        <div className='gr-5 gr-12-p gr-12-m'>
                            <img className='responsive' src={it.url_for('images/pages/careers/dubai/dubai-city-of-gold@2x.jpg')} />
                        </div>
                        <div className='gr-7 gr-12-p gr-12-m'>
                            <p className='no-margin-top'>{it.L('Dubai is an independent city-state and one of the seven emirates that make up the United Arab Emirates. Dubai is the largest and most advanced emirate; it has rapidly evolved from a humble port city into a global metropolis well-known for its futuristic architecture.')}</p>
                            <p>{it.L('Today, Dubai\'s state-of-the-art infrastructure and free-market economic opportunities continue to attract skilled talents and businesses from all over the world. It\'s also one of the world\'s leading tourist destinations with something for everyone, from theme parks and beaches to desert safaris and shopping havens.')}</p>
                            <p>{it.L('Our office in Dubai is located at the world-class Jumeirah Lake Towers (JLT) free zone. JLT is home to universities, commercial and residential towers, parks, and over 500 retail outlets, giving you exceptional convenience and a quality of life that you won\'t find anywhere else.')}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className='living fill-bg-color'>
            <div className='container gr-row gr-padding-30 center-text'>
                <div className='gr-12 gr-padding-20 center-text'>
                    <h2>{it.L('Living in Dubai')}</h2>
                </div>
                <div className='gr-12'>
                    <div className='container center-text'>
                        <ImageSlider
                            images={[
                                {
                                    url    : 'images/pages/careers/dubai/dubai-quality-of-life@2x.jpg',
                                    caption: it.L('Dubai offers an excellent quality of life, from safety and education to childcare and healthcare, befitting its reputation as a global, modern city with sunny weather all year round. Expats make up over 90% of Dubai\'s total population; you may never need to learn a word of Arabic since English is so widely spoken.'),
                                },
                                {
                                    url    : 'images/pages/careers/dubai/dubai-food-choices@2x.jpg',
                                    caption: it.L('When it comes to food, you\'ll be spoilt for choice. Cuisine from every part of the world can be found in Dubai, but that doesn\'t mean that local flavours should be ignored: chebab (saffron pancakes), khameer (puffed flatbreads), harees (savoury porridge), tender roasted meats, and pistachio-stuffed sweets are some of the local dishes that will excite your taste buds. There are also numerous economical options in the form of chain restaurants that cater to a variety of tastes.'),
                                },
                                {
                                    url    : 'images/pages/careers/dubai/dubai-tax-free-salary@2x.jpg',
                                    caption: it.L('In Dubai, you\'ll be earning a tax-free salary. Furthermore, health insurance coverage is provided by your employer and there are numerous dining options to suit all types of budgets. Accommodation and your children\'s education are likely to be your biggest expenses, but you will have numerous, first-rate options to choose from.'),
                                },
                            ]}
                        />
                    </div>
                </div>
            </div>
        </div>
        <div className='misc'>
            <div className='container gr-row gr-padding-30 center-text'>
                <div className='gr-12 gr-padding-20 center-text'>
                    <h2>{it.L('Can\'t miss in Dubai ')}</h2>
                </div>
                <BoxOverlayImage
                    title={it.L('Diversity')}
                    text={it.L('Dubai offers a cosmopolitan experience like no other with residents from over 200 countries speaking over 140 languages.')}
                    img_src={it.url_for('images/pages/careers/dubai/dubai-diversity@2x.jpg')}
                />
                <BoxOverlayImage
                    alignment='right'
                    title={it.L('Architecture')}
                    text={it.L('Dubai\'s iconic architecture includes the world\'s tallest building, artificial islands, gigantic malls, and more.')}
                    img_src={it.url_for('images/pages/careers/dubai/dubai-architecture@2x.jpg')}
                />
                <BoxOverlayImage
                    title={it.L('Entertainment')}
                    text={it.L('Dubai offers world-class entertainment with numerous events, places, and natural attractions to enjoy.')}
                    img_src={it.url_for('images/pages/careers/dubai/dubai-entertainment@2x.jpg')}
                />
            </div>
        </div>
    </div>
);

export default Asuncion;
