import React       from 'react';
import Head        from './head.jsx';
import GTMNoScript from './includes/google/gtm_no_script.jsx';
import Loader      from './includes/loader.jsx';

const BinaryApp = () => (
    <html>
        <Head />
        <body className={it.language}>
            <GTMNoScript />
            <Loader />
            <div id='binary_app' className='binary-app' />
            <script
                type='text/javascript'
                dangerouslySetInnerHTML={{__html: `
                    window.onload = () => {
                        initLoader(
                            [${it.css_files.map(css_file => `'${css_file}'`).join(',')}],
                            [${it.js_files.map(js_file => `'${js_file}'`.replace('{PLACEHOLDER_FOR_LANG}', it.language.toLowerCase())).join(',')}],
                        )
                    }
                `}}
            />
        </body>
    </html>
);

export default BinaryApp;
