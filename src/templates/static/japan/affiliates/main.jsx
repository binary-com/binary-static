import React from 'react';
import Register from '../../affiliates/register.jsx';

const Main = () => (
    <React.Fragment>
        <p>{it.L('{JAPAN ONLY}Are you an Investment professional or conduct financial markets training?')}</p>
        <p>{it.L('{JAPAN ONLY}Do you run a website or publish an FX blog?')}</p>
        <p>{it.L('{JAPAN ONLY}Do you publish a newsletter or manage a mailing list?')}</p>
        <p>{it.L('{JAPAN ONLY}Earn money by becoming an Affiliate. You will receive commission on each account through your referrals.')}</p>

        <Register lang='ja' />

        <div className='gr-padding-20'>
            <h2>{it.L('{JAPAN ONLY}Are your site visitors interested in:')}</h2>
            <ul className='checked'>
                <li>{it.L('{JAPAN ONLY}Learning to trade online?')}</li>
                <li>{it.L('{JAPAN ONLY}Discovering an easy to use, limited-risk, award-winning platform?')}</li>
                <li>{it.L('{JAPAN ONLY}Foreign Exchange markets')}</li>
                <li>{it.L('{JAPAN ONLY}Earning a second income in their spare time?')}</li>
            </ul>
            <p>{it.L('{JAPAN ONLY}We will provide you with all the tools you need to turn your traffic into a revenue stream')}</p>
        </div>

        <Register lang='ja' />

        <div className='gr-padding-20'>
            <h2>{it.L('{JAPAN ONLY}Why become an Affiliate?')}</h2>
            <ul className='checked'>
                <li>{it.L('{JAPAN ONLY}Long-term partnership with an establish international financial trading service')}</li>
                <li>{it.L('{JAPAN ONLY}Great pay-outs. Earn &yen;20,000 on every qualifying referral')}</li>
                <li>{it.L('{JAPAN ONLY}Professional service')}</li>
                <li>{it.L('{JAPAN ONLY}High quality promotional materials with online reporting tools')}</li>
                <li>{it.L('{JAPAN ONLY}A dedicated affiliate team to provide you with the best service possible')}</li>
                <li>{it.L('{JAPAN ONLY}Award-winning, internationally patented financial trading platform, newly introduced to Japan')}</li>
                <li>{it.L('{JAPAN ONLY}You will be provided with all the tools, to turn your traffic into a lucrative revenue stream')}</li>
            </ul>
        </div>

        <div className='gr-padding-20'>
            <h2>{it.L('{JAPAN ONLY}Generous Commission Structure')}</h2>
            <p>{it.L('{JAPAN ONLY}You will earn &yen;20,000 commission on for each client whom you introduced to our trading platform, and who then <a href=[_1]>opens and trades a real money account.</a>', `${it.url_for('terms-and-conditions-jp')}#affiliates&section-8`)}</p>
        </div>

        <div className='gr-padding-20'>
            <h2>{it.L('{JAPAN ONLY}Best Tracking with "Forever Cookies"')}</h2>
            <p>{it.L('{JAPAN ONLY}Your ID will be stored in a cookie and identified every time a prospect clicks on your affiliate link and lands on [_1] and in that event, opens an account with us.', it.broker_name)}</p>
        </div>

        <div className='gr-padding-20'>
            <h2>{it.L('{JAPAN ONLY}On-time Payments Every Time')}</h2>
            <p>{it.L('Our International Affiliate Program has been delivering payments on time and, every time, since our official launch in March, 2004. In Japan, your commission will be credited to your affiliate account within thirty days after the close of a calendar month in which your referrals have met the qualifying conditions.')} </p>
        </div>

        <div className='gr-padding-20'>
            <h2>{it.L('{JAPAN ONLY}A True Partnership')}</h2>

            <p>{it.L('{JAPAN ONLY}We offer an informative and entertaining way to advertise online; including text ads, customer landing pages and invitations to promotional and educational events for your site visitors.')}</p>
            <p>{it.L('{JAPAN ONLY}If you introduce our website to potential clients, you will earn as soon as one of them opens a real account with [_1] and begins trading. ', it.broker_name)}<span>{it.L('Please see our <a href=[_1]>terms and conditions</a> for details of payout qualifications.', it.url_for('terms-and-conditions-jp') )}</span></p>
            <p>{it.L('{JAPAN ONLY}After we complete mandatory regulatory checks on your website, you will be approved as an affiliate, and provided with everything necessary for you to start right away.')}</p>
            <p>{it.L('{JAPAN ONLY}So, what are you waiting for? Please join us as an affiliate today.')}</p>
        </div>

        <Register lang='ja' />
    </React.Fragment>
);

export default Main;
