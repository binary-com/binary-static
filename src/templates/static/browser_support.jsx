import React from 'react';

const Browsers = ({
    id,
    href,
    company,
    header,
    items = [],
}) => (
    <div className='gr-6 gr-12-m'>
        <a id={id} target='_blank' href={href} className='li-boxes-content-icon' rel='noopener noreferrer'>{company}</a>
        <div className='li-2-boxes-content li-boxes-content-extra-height'>
            <h2>{header}</h2>
            <ul>
                { items.map((item, idx) => (
                    <li key={idx}>{item}</li>
                ))}
            </ul>
        </div>
    </div>
);

const BrowserSupport = () => (
    <React.Fragment>
        <div className='gr-12 static_full'>
            <h1>{it.L('Login trouble')}</h1>
            <p>{it.L('If you are experiencing difficulties logging into your account, please verify that cookies are enabled in your browser. This website uses cookies to store your login ID and password (in encrypted format) on your PC during your login session.')}</p>
            <p>{it.L('To enable cookies, follow the instructions below for the browser version that you are using.')}</p>
        </div>

        <div className='gr-parent clear'>
            <div className='gr-row'>
                <Browsers
                    id='chrome'
                    href='https://www.google.com/chrome/'
                    company='Binary (C.R.) S.A.'
                    header='Chrome 51+'
                    items={[
                        it.L('Go to "<strong>Chrome Menu (Customize and control Google Chrome)</strong>" dropdown and select <strong>Settings</strong>.'),
                        it.L('Click on the <strong>Show advanced settings</strong>.'),
                        it.L('Click on the <strong>Content settings</strong> button under <strong>Privacy</strong> menu.'),
                        it.L('Select <strong>Allow local data to be set (recommended)</strong>.'),
                        it.L('Click on the <strong>Done</strong> button to save your settings.'),
                    ]}
                />
                <Browsers
                    id='firefox'
                    href='https://www.mozilla.org/en-US/firefox/new/'
                    company='Binary (IOM) Ltd'
                    header='Mozilla Firefox 47+'
                    items={[
                        it.L('<strong>Open menu</strong> and select <strong>Preferences</strong>.'),
                        it.L('Click on the <strong>Privacy</strong> tab.'),
                        it.L('Set "<strong>Firefox will</strong>" to "<strong>Remember history</strong>".'),
                        it.L('Click on the <strong>OK</strong> button to save your settings.'),
                    ]}
                />
            </div>
        </div>

        <div className='gr-parent clear'>
            <div className='gr-row'>
                <Browsers
                    id='safari'
                    href='https://www.apple.com/safari/'
                    company='Binary (Europe) Ltd'
                    header='Safari 9.x+'
                    items={[
                        it.L('Go to the <strong>Safari</strong> menu and select <strong>Preferences</strong>.'),
                        it.L('Click on the <strong>Privacy</strong> tab.'),
                        it.L('Set "<strong>Block cookies:</strong>" to <strong>Never</strong>.'),
                        it.L('Click on the <strong>X</strong> button at the top right to save and close.'),
                    ]}
                />
                <Browsers
                    id='opera'
                    href='https://www.opera.com/'
                    company='Binary (C.R.) S.A.'
                    header='Opera 38+'
                    items={[
                        it.L('Go to the <strong>Tools</strong> menu and select <strong>Preferences</strong>.'),
                        it.L('Click on the <strong>Advanced</strong> tab.'),
                        it.L('Select <strong>Cookies</strong> from the left column.'),
                        it.L('Select <strong>Accept cookies</strong>.'),
                        it.L('Click on the <strong>OK</strong> button to save and close.'),
                    ]}
                />
            </div>
        </div>

        <div className='gr-parent'>
            <div className='gr-row'>
                <Browsers
                    id='internet_explorer'
                    href='https://www.microsoft.com/windows/internet-explorer/default.aspx'
                    company='Binary Ltd'
                    header='Microsoft Internet Explorer 11+'
                    items={[
                        it.L('Go to the <strong>Tools</strong> menu and select <strong>Internet Options</strong>.'),
                        it.L('Click on the <strong>Privacy</strong> tab.'),
                        it.L('Click on the <strong>Advanced</strong> button.'),
                        it.L('Select the <strong>Override automatic cookie handling</strong>.'),
                        it.L('Select <strong>Accept</strong> for both <strong>First-party Cookies</strong> and <strong>Third-party Cookies</strong>.'),
                        it.L('Click on the <strong>OK</strong> button to save and close.'),
                    ]}
                />
                <Browsers
                    id='microsoft_edge'
                    href='https://www.microsoft.com/en-us/download/details.aspx?id=48126'
                    company='Binary Ltd'
                    header='Microsoft Edge 12+'
                    items={[
                        it.L('Go to the <strong>More actions</strong> menu and select <strong>Settings</strong>.'),
                        it.L('Under <strong>Advanced Settings</strong>, click on the <strong>View advanced settings</strong> button.'),
                        it.L('Under the <strong>Cookies</strong> section, select the "<strong>Don\'t block cookies</strong>" option.'),
                        it.L('Click anywhere outside the menu to save and close.'),
                    ]}
                />
            </div>
        </div>
        <div className='gr-padding-20 clear' />
    </React.Fragment>
);

export default BrowserSupport;
