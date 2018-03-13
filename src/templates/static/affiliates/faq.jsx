import React from 'react';
import CommissionTable from './commission_table.jsx';

const FAQ = () => (
    <React.Fragment>
        <div className='gr-padding-20 gr-parent'>
            <h3>{it.L('What is the definition of a \'client\'?')}</h3>
            <p>{it.L('A client is someone who has been referred through one of your marketing tools and who has deposited money into their [_1] account. They must fulfill the following criteria:', it.broker_name)}</p>
            <ul className='checked'>
                <li>{it.L('Have not previously been a [_1] customer.', it.broker_name)}</li>
                <li>{it.L('Have made the minimum deposit.')}</li>
                <li>{it.L('Are over 18.')}</li>
            </ul>
        </div>

        <h3>{it.L('Who can be a client on the [_1] platform?', it.broker_name)}</h3>
        <p>{it.L('Anyone over the age of 18 [who has read and agreed to the [_1] terms and conditions], and who is not resident in one of the \'closed countries\' can trade on the [_1] platform.', it.broker_name)}</p>

        <div className='gr-padding-20 gr-parent'>
            <h2>{it.L('The Program')}</h2>
            <div className='gr-padding-20 gr-parent'>
                <h3>{it.L('What is the [_1] affiliate program?', it.broker_name)}</h3>
                <p>{it.L('The affiliate program enables you to benefit from referring clients to the site. Growth and success is shared with affiliates who have the ability to bring new Clients to the site.')}</p>
                <p>{it.L('If you\'re a broker we\'d like to work with you. You will be introducing your clients to a unique and innovative product - the [_1] trading platform.', it.broker_name)}</p>
                <p>{it.L('Your clients will love the [_1] trading platform because we offer a complete trading experience tailored to the needs of an exceptionally wide range of traders.', it.broker_name)}</p>
                <p>{it.L('Novice traders can use our intuitive visual platform to learn about trading, practice trading and gain trading experience.')}</p>
                <p>{it.L('Seasoned traders can use the [_1] platform for the full advantage of the wide range of trading and analysis tools we have on offer.', it.broker_name)}</p>
            </div>

            <div className='gr-padding-20 gr-parent'>
                <h3>{it.L('Why should I become a binary options trading affiliate?')}</h3>
                <p>{it.L('Since their inception, \'binary options\' has become a popular trading product. The numerous binary options trading platforms subsequently being created, support this growing trend. By becoming an affiliate now you can profit from the fast growth of interest in this new industry.')}</p>
            </div>

            <div className='gr-padding-20 gr-parent'>
                <h3>{it.L('Why should I become an affiliate with [_1]?', it.broker_name)}</h3>
                <ul className='checked'>
                    <li>{it.L('it is the leading binary option trading platform.')}</li>
                    <li>{it.L('it has an internationally wide appeal, with an interface in English, Spanish, French, German, Portuguese, Chinese, Japanese, Italian, Thai, Polish, Russian and Indonesian.')}</li>
                    <li>{it.L('the platform is 100% web based making it instantly available for clients.')}</li>
                    <li>{it.L('the platform is user friendly and accessible to all levels of traders.')}</li>
                    <li>{it.L('the [_1] affiliate program is competitive and adaptive to your unique requirements.', it.broker_name)}</li>
                </ul>
                <p>{it.L('If you want to profit from this high demand product then your best option is to partner with the market leader. [_1] has been in the business for over 15 years, and has been successful ever since.', it.broker_name)}</p>
            </div>

            <div className='gr-padding-20 gr-parent'>
                <h3>{it.L('Is there a cost for joining?')}</h3>
                <p>{it.L('No. There\'s no cost to sign up to the affiliate program.')}</p>
            </div>

            <h3>{it.L('Can I become an affiliate even if I don\'t have a website?')}</h3>
            <p>{it.L('Yes. Please email us at <a href="mailto:[_1]">[_1]</a> for further assistance.', it.affiliate_email)}</p>
        </div>

        <div className='gr-padding-20 gr-parent'>
            <h2>{it.L('Account Management and Tracking')}</h2>
            <div className='gr-padding-20 gr-parent'>
                <h3>{it.L('How can I become an affiliate?')}</h3>
                <p>{it.L('Go to the <a href="https://login.binary.com/signup.php">sign up page</a> to register as an affiliate today.', it.broker_name)}</p>
            </div>

            <div className='gr-padding-20 gr-parent'>
                <h3>{it.L('I forgot my password, what should I do?')}</h3>
                <p>{it.L('Go to the <a href="https://login.binary.com/password-retrieve.php">password retrieval page</a>, and enter your username and e-mail address in the form fields provided to have your password e-mailed to you.')}</p>
            </div>

            <div className='gr-padding-20 gr-parent'>
                <h3>{it.L('What commission plan do you offer?')}</h3>
                <p>{it.L('Please refer to the following commission plan.')}</p>
                <CommissionTable />
            </div>

            <div className='gr-padding-20 gr-parent'>
                <h3>{it.L('How do I change my payment method?')}</h3>
                <p>{it.L('Log-in to your [_1] affiliate account and click on: Finances &rarr; Payment instructions.', it.broker_name)}</p>
            </div>

            <div className='gr-padding-20 gr-parent'>
                <h3>{it.L('How and when will I receive my affiliate earnings?')}</h3>
                <p>{it.L('By the 15th of every month, you will receive the commission earned during the previous calendar month.')}</p>
            </div>

            <div className='gr-padding-20 gr-parent'>
                <h3>{it.L('How do I know how much I have earned?')}</h3>
                <p>{it.L('Log-in to your [_1] affiliate account and click on: Reports &rarr; Traffic Report.', it.broker_name)}</p>
            </div>

            <div className='gr-padding-20 gr-parent'>
                <h3>{it.L('What other reports can I generate?')}</h3>
                <p><strong>{it.L('Detailed report:')}</strong> {it.L('The detailed report shows you your detailed traffic and income statistics. Use the filters and column selectors to break down your reporting as desired.')}</p>
                <p><strong>{it.L('Player report:')}</strong> {it.L('The player report shows a breakdown of statistics per player. Use the filters to refine the report.')}</p>
                <p><strong>{it.L('Daily Earnings:')}</strong> {it.L('The commission report shows you your daily commission earnings, per site / product.')}</p>
            </div>

            <h3>{it.L('Can I offer my referrals an incentive to sign up through my link rather than sign up directly?')}</h3>
            <p>{it.L('We prohibit the use of unauthorised incentives, gifts and payments to encourage customer sign-ups. In the event that we believe that you have engaged in such activity, we reserve the right to withhold any amounts due to you. However, if you have a specific incentive in mind, then please contact your account manager for further discussion and approval.')}</p>
        </div>

        <div className='gr-padding-20 gr-parent'>
            <h2>{it.L('Marketing and Promotion')}</h2>
            <div className='gr-padding-20 gr-parent'>
                <h3>{it.L('What marketing tools do you offer?')}</h3>
                <p>{it.L('We have a tested and proven selection of banners, links, reviews, newsletters, videos, and text ads for your use. Additionally, we have flash banners which you can grab through your affiliate account. If you would like customized tools, or an item currently not offered on the site, please contact your account manager at: <a href="mailto:[_1]">[_1]</a>.', it.affiliate_email)}</p>
            </div>

            <div className='gr-padding-20 gr-parent'>
                <h3>{it.L('Where are they located?')}</h3>
                <p>{it.L('Log-in to your [_1] affiliate account and click on: Marketing &rarr; All Media.', it.broker_name)}</p>
            </div>

            <h3>{it.L('Can you customize a banner for my site?')}</h3>
            <p>{it.L('Yes. Please contact your account manager if you would like a customized banner and provide him/her with the following information:')}</p>
            <ul className='checked'>
                <li>{it.L('Pixel size.')}</li>
                <li>{it.L('File format.')}</li>
                <li>{it.L('Desired language.')}</li>
                <li>{it.L('The URL of the site on which the banner is going to appear.')}</li>
                <li>{it.L('Banner placement.')}</li>
                <li>{it.L('Specific colors the banner should include.')}</li>
                <li>{it.L('Specific message the banner should include.')}</li>
            </ul>
        </div>

        <div className='gr-padding-20 gr-parent'>
            <h2>{it.L('Contact')}</h2>
            <div className='gr-padding-20 gr-parent'>
                <h3>{it.L('Where can I send my questions, comments and suggestions?')}</h3>
                <p>{it.L('Please contact us with whatever is on your mind at <a href=\'mailto:[_1]\'>[_1]</a>. We\'d be happy to hear from you and willing to assist you. So, feel free to share your ideas and suggestions with us.', it.affiliate_email)}</p>
            </div>
        </div>
    </React.Fragment>
);

export default FAQ;
