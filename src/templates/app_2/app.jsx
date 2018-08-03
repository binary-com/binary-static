import React  from 'react';
import Head   from './head.jsx';
import Loader from '../_common/components/loader.jsx';
import GTM    from '../_common/includes/gtm.jsx';

const BinaryApp = () => (
    <html>
        <Head />
        <body className={it.language}>
            <GTM />
            <Loader is_dark_mode={true} />
            <div id='binary_app' className='binary-app' />
        </body>
    </html>
);

export default BinaryApp;
