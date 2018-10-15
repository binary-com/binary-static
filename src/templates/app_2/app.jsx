import React      from 'react';
import Head       from './head';
import GTMNoScript from './includes/google/gtm_no_script';
import Loading    from '../_common/components/loading';

const BinaryApp = () => (
    <html>
        <Head />
        <body className={it.language}>
            <GTMNoScript />
            <div id='binary_app' className='binary-app'>
                <Loading />
            </div>
        </body>
    </html>
);

export default BinaryApp;
