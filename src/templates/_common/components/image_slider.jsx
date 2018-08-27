import React from 'react';

const ImageSlider = ({ id, className, images }) => (
    <div id={id} className={className}>
        <div id='img_slider' className='image-slider gr-row gr-row-align-center'>
            <div className='align-self-center gr-1'>
                <img className='go-left gr-12 gr-no-gutter gr-centered' src={it.url_for('images/pages/home/arrow_left.svg')} />
            </div>
            <div className='gr-10 no-scroll'>
                <ul id='slide_wrapper' className='slide-wrapper'>
                    {images.map((image, idx) => (
                        <li key={idx} className='slider-image'>
                            <img className='responsive' src={it.url_for(image.url)} />
                            {!!image.caption &&
                            <div className='image-caption'>
                                <p>{image.caption}</p>
                            </div>
                            }
                        </li>
                    ))}
                </ul>
            </div>
            <div className='align-self-center gr-1'>
                <img className='go-right gr-12 gr-no-gutter gr-centered' src={it.url_for('images/pages/home/arrow_right.svg')} />
            </div>
        </div>
    </div>
);

export default ImageSlider;
