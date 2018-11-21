import React      from 'react';
import Head       from './head.jsx';
import GTMNoScript from './includes/google/gtm_no_script.jsx';
import Loading    from '../_common/components/loading.jsx';

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
