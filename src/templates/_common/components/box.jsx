import React from 'react';

export const BoxInner = ({ className = '', href, image, text }) => (
    <div className={`gr-6 center-text ${className}`}>
        { href ?
            <React.Fragment>
                <a href={it.url_for(href)}>
                    <img className='gr-7 gr-centered' src={it.url_for(`images/pages/about/${image}.svg`)} />
                </a>
                <p>{text}</p>
            </React.Fragment>
            :
            <React.Fragment>
                <img className='gr-7 gr-centered' src={it.url_for(`images/pages/about/${image}.svg`)} />
                <p>{text}</p>
            </React.Fragment>
        }
    </div>
);

export const Box = ({ children }) => (
    <div className='gr-6 gr-12-m'>
        <div className='gr-row'>
            {children}
        </div>
    </div>
);
