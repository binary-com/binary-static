import React from 'react';

const Statistics = () => (
    <section id='statistics'>
        <div className='container gr-row full-width center-text gr-padding-20'>
            <article className='gr-3 gr-6-p gr-12-m gr-padding-20'>
                <h1>{it.L('40K+')}</h1>
                <h3>{it.L('Partners')}</h3>
            </article>
            <article className='gr-3 gr-6-p gr-12-m gr-padding-20'>
                <h1>{it.L('$12M+')}</h1>
                <h3>{it.L('Partner earnings')}</h3>
            </article>
            <article className='gr-3 gr-6-p gr-12-m gr-padding-20'>
                <h1>{it.L('150+')}</h1>
                <h3>{it.L('Countries')}</h3>
            </article>
            <article className='gr-3 gr-6-p gr-12-m gr-padding-20'>
                <h1>{it.L('1M+')}</h1>
                <h3>{it.L('Clients')}</h3>
            </article>
        </div>
    </section>
);

export default Statistics;
