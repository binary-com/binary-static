import React from 'react';
import { List } from '../../_common/components/elements.jsx';
import SignupTour from '../signup_tour.jsx';

const Box = ({ boxes }) => (
    <div className='gr-row center-text'>
        { boxes.map((box, inx) => (
            <div key={inx} className='list gr-6 gr-no-gutter-t gr-no-gutter-p gr-no-gutter-m'>
                <div className='section fill-bg-color section-jp'>
                    <a href={`#${box.id}`}>
                        <div id={`${box.id}-img`} />
                        <div className='section-header'>{box.header}</div>
                    </a>
                </div>
            </div>
        ))}
    </div>
);

const Download = ({ doc, text, className }) => (
    <div className='center-text gr-padding-10'>
        <a className='button' href={`${it.japan_docs_url  }/documents/${  doc  }.pdf`} target='_blank'>
            <span className={className || undefined}>{text || it.L('{JAPAN ONLY}Download')}</span>
        </a>
    </div>
);

const GetStarted = () => (
    <div className='get-started-jp gr-row static_full'>
        <div className='gr-3 gr-hide-m'>
            <div className='sidebar'>
                <List
                    className='nav'
                    items={[
                        { className: 'how-to-open-an-account',    href: '#how-to-open-an-account',    text: it.L('{JAPAN ONLY}How to Open an Account') },
                        { className: 'identification-documents',  href: '#identification-documents',  text: it.L('{JAPAN ONLY}Identification Documents') },
                        { className: 'options-basic-knowledge',   href: '#options-basic-knowledge',   text: it.L('{JAPAN ONLY}Options Basic Knowledge') },
                        { className: 'trading-guide',             href: '#trading-guide',             text: it.L('{JAPAN ONLY}Trading Guide') },
                        { className: 'summary-of-specifications', href: '#summary-of-specifications', text: it.L('{JAPAN ONLY}Summary of Specifications') },
                        { className: 'pre-contract-documents',    href: '#pre-contract-documents',    text: it.L('{JAPAN ONLY}Pre-Contract Documents') },
                    ]}
                />
            </div>
        </div>

        <div className='gr-6 gr-12-m gr-parent' id='index'>
            <Box
                boxes={[
                    { id: 'how-to-open-an-account',   header: it.L('{JAPAN ONLY}How to Open an Account') },
                    { id: 'identification-documents', header: it.L('{JAPAN ONLY}Identification Documents') },
                ]}
            />
            <Box
                boxes={[
                    { id: 'options-basic-knowledge', header: it.L('{JAPAN ONLY}Options Basic Knowledge') },
                    { id: 'trading-guide',           header: it.L('{JAPAN ONLY}Trading Guide') },
                ]}
            />
            <Box
                boxes={[
                    { id: 'summary-of-specifications', header: it.L('{JAPAN ONLY}Summary of Specifications') },
                    { id: 'pre-contract-documents',    header: it.L('{JAPAN ONLY}Pre-Contract Documents') },
                ]}
            />
        </div>

        <div className='gr-6 gr-12-m gr-parent contents' style={{display: 'none'}}>
            <div id='content-how-to-open-an-account'>
                <h1>{it.L('{JAPAN ONLY}How to Open an Account')}</h1>
                <p>{it.L('{JAPAN ONLY}You can apply to open an account online. Simply click <a href="[_1]">here</a> to begin the process by opening a demo account.  Once you are familiar with our site and comfortable in your knowledge of binary options we invite you to upgrade to a Real Money Account.', it.url_for('home-jp'))}</p>
                <p>
                    {it.L('{JAPAN ONLY}Our Real Money Account opening procedure has 4 steps:')}
                    <ol>
                        <li>{it.L('{JAPAN ONLY}Enter your personal information, and acknowledge our terms and conditions.')}</li>
                        <li>{it.L('{JAPAN ONLY}Take our Knowledge Test to confirm your understanding of options.')}</li>
                        <li>
                            {it.L('{JAPAN ONLY}Email us copies of your Identification Documents and My Number card.')}
                            <p className='hint'>{it.L('{JAPAN ONLY}Please click <a href="#identification-documents">here</a> for further information.')}</p>
                        </li>
                        <li>{it.L('{JAPAN ONLY}Activate your account by confirming your authorisation code which we will post to your registered address.')}</li>
                    </ol>
                </p>
                <p>{it.L('{JAPAN ONLY}Our Customer Support staff will contact you at each stage to guide you through the process. Please also download our full guide to opening an account:')}</p>
                <Download doc='binary_account_open_guide' />
            </div>

            <div id='content-identification-documents'>
                <h1>{it.L('{JAPAN ONLY}Identification Documents')}</h1>
                <p>{it.L('{JAPAN ONLY}We are required to request copies of your My Number Card as well as proof of registered address. Your details will be kept secure and only used for the specific purposes of verifying your credentials, as required by law.')}</p>
                <p>{it.L('{JAPAN ONLY}For full details of the documents we can accept please download the following guide:')}</p>
                <Download doc='binary_id_guide' />
            </div>

            <div id='content-options-basic-knowledge'>
                <h1>{it.L('{JAPAN ONLY}Options Basic Knowledge')}</h1>
                <p>{it.L('{JAPAN ONLY}In order to open a trading account for you we will need to test your knowledge of options to ensure you have the necessary understanding of the products and risks of binary option trading.')}</p>
                <p>{it.L('{JAPAN ONLY}Please download our Options Basic Knowledge guides which cover all the essential concepts, terminalogy and required information:')}</p>
                <div className='gr-row'>
                    <div className='gr-6 gr-12-m gr-12-p'>
                        <Download doc='binary_kihon_chishiki_1' className='link-size-box' text={it.L('{JAPAN ONLY}Introduction to Binary Options')} />
                        <Download doc='binary_kihon_chishiki_2' className='link-size-box' text={it.L('{JAPAN ONLY}Purchase, Settlement & Resale')} />
                        <Download doc='binary_kihon_chishiki_3' className='link-size-box' text={it.L('{JAPAN ONLY}Options Basics')} />
                    </div>
                    <div className='gr-6 gr-12-m gr-12-p'>
                        <Download doc='binary_kihon_chishiki_4' className='link-size-box' text={it.L('{JAPAN ONLY}Trading & Hedging')} />
                        <Download doc='binary_kihon_chishiki_5' className='link-size-box' text={it.L('{JAPAN ONLY}Option Pricing')} />
                        <Download doc='binary_kihon_chishiki_6' className='link-size-box' text={it.L('{JAPAN ONLY}Regulation & Tax')} />
                    </div>
                </div>
            </div>

            <div id='content-trading-guide'>
                <h1>{it.L('{JAPAN ONLY}Trading Guide')}</h1>
                <p>{it.L('{JAPAN ONLY}Please download our Full Trading Guide which describes in detail how to use our trading screens and other features of our website:')}</p>
                <Download doc='binary_operation_manual' />
            </div>

            <div id='content-summary-of-specifications'>
                <h1>{it.L('{JAPAN ONLY}Summary of Specifications')}</h1>
                <p>{it.L('{JAPAN ONLY}Please download our Summary of Specifications which lists all the details of our trade types, rules and conditions for trading etc.')}</p>
                <Download doc='binary_torihiki_gaiyou' />
            </div>

            <div id='content-pre-contract-documents'>
                <h1>{it.L('{JAPAN ONLY}Pre-Contract Documents')}</h1>
                <p>{it.L('{JAPAN ONLY}Please download our Pre-Contract Documents which you must confirm you have read, understood and agree with, when upgrading to a real money account.')}</p>
                <Download doc='binary_maeshomen' />
            </div>
        </div>

        <SignupTour is_jp />
    </div>
);

export default GetStarted;
