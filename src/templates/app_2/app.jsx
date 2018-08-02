import classNames from 'classnames';
import React      from 'react';
import Head       from './head.jsx';
import Loading    from '../_common/components/loading.jsx';
import GTM        from '../_common/includes/gtm.jsx';

const BinaryApp = () => (
    <html>
        <Head />
        <body className={classNames(it.language, 'body-bg__dark')}>
            <GTM />
            <div id='binary_app' className='binary-app'>
                <Loading />
            </div>
        </body>
    </html>
);

export default BinaryApp;
