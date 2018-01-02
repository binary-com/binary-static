import React from 'react';

const PullRequests = () => (
    <React.Fragment>
        <div className='container'>
            <div className='static_full'>
                <h1>{it.L('Get paid for pull requests')}</h1>

                <p>{it.L('To encourage transparency and improve the performance and functionality of our website, [_1] has open-sourced the entire front-end of our codebase, and we are now actively encouraging the community to contribute to its development. ', it.website_name)}</p>
                <p>{it.L('We\'ll pay for any pull request that is accepted and merged into the master codebase.')}</p>

                <img src={it.url_for('images/pages/partners/tech.svg')} />
            </div>
        </div>
        <div className='fill-bg-color'>
            <div className=' gr-padding-30 container'>
                <div className='gr-padding-10'>
                    <h2>{it.L('Which projects are available?')}</h2>
                    <p>{it.L('All [_1] [_2]front-end platforms and libraries[_3] are eligible.', it.website_name, '<a target="_blank" href="https://developers.binary.com/open-source/">', '</a>')}</p>
                </div>

                <div className='gr-padding-10'>
                    <h2>{it.L('How do I submit a pull request?')}</h2>
                    <ul className='gr-row bullet'>
                        <li className='gr-6 gr-12-m'>{it.L('Fork the relevant Github repository')}</li>
                        <li className='gr-6 gr-12-m'>{it.L('Make your code changes in your fork')}</li>
                        <li className='gr-6 gr-12-m'>{it.L('Submit a pull request to master in the original GitHub repository ')}</li>
                        <li className='gr-6 gr-12-m'>{it.L('Send an email to [_1] to ask our development team to review your pull request', '<a href="mailto:pull-requests@binary.com">pull-requests@binary.com</a>')}</li>
                    </ul>
                </div>

                <div className='gr-padding-10'>
                    <h2>{it.L('How do I test my changes?')}</h2>
                    <p>{it.L('All [_1] front-end projects are deployed using the Github pages facility. Please familiarize yourself with that facility, and read the deployment instructions in each relevant repository.', it.website_name)}</p>
                </div>

                <div className='gr-padding-10'>
                    <h2>{it.L('What kind of changes can I submit?')}</h2>
                    <ul className='gr-row bullet'>
                        <li className='gr-6 gr-12-m'>{it.L('New features')}</li>
                        <li className='gr-6 gr-12-m'>{it.L('Better charting facilities')}</li>
                        <li className='gr-6 gr-12-m'>{it.L('New technical indicators')}</li>
                        <li className='gr-6 gr-12-m'>{it.L('Improved usability')}</li>
                        <li className='gr-6 gr-12-m'>{it.L('Improved browser compatibility')}</li>
                        <li className='gr-6 gr-12-m'>{it.L('Improved responsiveness')}</li>
                        <li className='gr-6 gr-12-m'>{it.L('Faster rendering')}</li>
                        <li className='gr-6 gr-12-m'>{it.L('Bug fixes')}</li>
                        <li className='gr-6 gr-12-m'>{it.L('Improved documentation')}</li>
                        <li className='gr-6 gr-12-m'>{it.L('Better test coverage')}</li>
                    </ul>
                </div>

                <div className='gr-padding-10'>
                    <h2>{it.L('Can I write a new front-end from scratch?')}</h2>
                    <p>{it.L('Sure. We welcome projects such as new mobile apps, chatbot apps, browser extensions, and new charting tools.')}</p>
                </div>

                <div className='gr-padding-10'>
                    <h2>{it.L('Can I submit security vulnerabilities?')}</h2>
                    <p>{it.L('Yes, but we\'d prefer you to submit security vulnerabilities via our [_1]bug bounty[_2] program.', '<a target=\'_blank\' href=\'https://hackerone.com/binary\' rel=\'noopener noreferrer\'>', '</a>')}</p>
                </div>

                <div className='gr-padding-10'>
                    <h2>{it.L('Can I contribute to back-end code?')}</h2>
                    <p>{it.L('Our back-end code is mainly in Perl, and our open-source contributions may be found on [_1]CPAN[_2]. The corresponding source code can be found in our [_3]Github repositories[_2] that start with the prefix "perl-". We welcome contributions to these repositories, notably improved documentation and test coverage.', '<a target=\'_blank\' href=\'http://search.cpan.org/~binary\' rel=\'noopener noreferrer\'>', '</a>', '<a target=\'_blank\' href=\'https://github.com/binary-com\' rel=\'noopener noreferrer\'>')}</p>
                </div>

                <div className='gr-padding-10'>
                    <h2>{it.L('How will I get paid?')}</h2>
                    <p>{it.L('We only pay for pull requests that are approved by our development team and merged into master. If the development team approves your pull request, we\'ll pay you in cryptocurrency. You can choose Bitcoin, Litecoin or Ether. ')}</p>
                </div>

                <div className='gr-padding-10'>
                    <h2>{it.L('What can I expect to get paid?')}</h2>
                    <p>{it.L('Our development team will determine how much you get paid. You can expect the following range of payments:')}</p>
                    <ul className='gr-row bullet'>
                        <li className='gr-6 gr-12-m'>{it.L('Trivial changes – generally $5-20')}</li>
                        <li className='gr-6 gr-12-m'>{it.L('Smallish changes – generally $20-50')}</li>
                        <li className='gr-6 gr-12-m'>{it.L('Average-sized changes – generally $50-250')}</li>
                        <li className='gr-6 gr-12-m'>{it.L('Medium-sized changes – generally $250-750')}</li>
                        <li className='gr-6 gr-12-m'>{it.L('Large changes – generally $750-2,500')}</li>
                        <li className='gr-6 gr-12-m'>{it.L('Very large changes/entire new projects – $2,500-10,000')}</li>
                    </ul>
                </div>

                <div className='gr-padding-10'>
                    <h2>{it.L('Do I retain ownership of the code?')}</h2>
                    <p>{it.L('No. Once your pull request is merged into master by our development team, and you have been paid, you have effectively handed over the rights to the code. It then becomes part of the master [_1] codebase under the open-source license of the relevant repository.', it.website_name)}</p>
                </div>
                <div className='gr-padding-10'>
                    <h2>{it.L('If rewards are not agreed in advance, how do I know I\'ll be paid fairly?')}</h2>
                    <p>{it.L('We want to keep improving our platform, so, it\'s in our interest to pay contributors fairly. If we don\'t, then you\'ll stop contributing pull requests, which will make this project self-defeating.')}</p>
                </div>
                <div className='gr-padding-10'>
                    <h2>{it.L('Can I work for [_1] full-time?', it.website_name)}</h2>
                    <p>{it.L('We are always on the lookout for talent – please apply via our <a target=\'_blank\' href=\'[_1]\'>careers</a> page.', it.url_for('careers'))}</p>
                </div>

                <div className='gr-padding-10'>
                    <h2>{it.L('Can I discuss the codebases with the [_1] development team?', it.website_name)}</h2>
                    <p>{it.L('Of course! Please send an email to <a href="mailto:[_1]">[_1]</a> to request an invite to our Slack channel.', 'pull-requests@binary.com') }</p>
                </div>

                <div className='section'>
                    <i>{it.L('The [_1] team', it.website_name)}</i>
                </div>
            </div>
        </div>
    </React.Fragment>
);

export default PullRequests;
