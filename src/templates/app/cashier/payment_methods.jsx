import React from 'react';
import { Table } from '../../_common/components/elements.jsx';

const Button = ({ url, real, className, text }) => (
    <a href={it.url_for(url)} className={`toggle button ${real ? 'client_real' : 'client_logged_out'} invisible`}>
        <span className={className || undefined}>{text}</span>
    </a>
);

const TableTitle = ({ title, className }) => (
    <h3 className={`gr-padding-10${className ? ` ${className}` : ''}`}>{title}</h3>
);

const PaymentLogo = ({ logo }) => (
    <img src={it.url_for(`images/pages/home/payment/${ logo }.svg`)} />
);

const TableValues = ({ value }) => {
    const values = Array.isArray(value) ? value : [value];
    return (
        <React.Fragment>
            { values.reduce((arr, e, inx) => arr === null ? [e] : [...arr, <br key={inx}/>, e], null) }
        </React.Fragment>
    );
};

const ReferenceLink = ({ href, className = '', title = '' }) => (
    <a
        className={`payment-methods__reference ${className} ${!href ? 'payment-methods__reference--disabled' : ''}`}
        href={href}
        target='_blank'
        aria-disabled={!href}
        title={title}
        rel='noopener noreferrer'
    />
);

const ReferenceLinks = ({ pdf_file, video_link }) => (
    <React.Fragment>
        <ReferenceLink
            className='payment-methods__reference-pdf'
            href={pdf_file && it.url_for(`download/payment/${pdf_file}`)}
            title={pdf_file || it.L('PDF reference is not available for this method')}
        />
        <ReferenceLink
            className='payment-methods__reference-video'
            href={video_link}
            title={video_link ? it.L('Video tutorial') : it.L('Video tutorial is not available for this method')}
        />
    </React.Fragment>
);

const PaymentMethods = () => {
    const head = [
        { className: 'gr-padding-10', text: it.L('Method') },
        { className: 'gr-padding-10', text: it.L('Currencies') },
        { className: 'gr-padding-10', text: it.L('Min-Max Deposit') },
        { className: 'gr-padding-10', text: it.L('Min-Max Withdrawal') },
        { className: 'gr-padding-10', text: `${it.L('Processing Time')}*` },
        { className: 'gr-padding-10', text: it.L('Reference') },
    ];

    const deposit                  = 'Deposit: ';
    const withdrawal               = 'Withdrawal: ';
    const working_day              = '[_1] working day';
    const instant                  = 'Instant';
    const not_applicable           = 'Not applicable';
    const blockchain_confirmations = '[_1] blockchain confirmations';

    return (
        <div id='cashier-content'>
            <h1>{it.L('Available payment methods')}</h1>
            <div className='gr-12'>
                <div id='payment_method_suggestions gr-padding-10' className='center-text'>
                    <div className='gr-padding-10 invisible upgrademessage'>
                        <a className='button' />
                    </div>
                    <p>
                        <Button url='new-account' text={it.L('Open an account now')} />
                        <Button url='cashier/forwardws?action=deposit'  real className='deposit'  text={it.L('Deposit')} />
                        <Button url='cashier/forwardws?action=withdraw' real className='withdraw' text={it.L('Withdraw')} />
                    </p>
                </div>
            </div>

            <div id='payment_methods' className='table-container'>
                <TableTitle title={it.L('Bank wire/Money transfer')} className='no-margin' />
                <Table
                    data={{
                        thead: [ head ],
                        tbody: [
                            [
                                { text: <PaymentLogo logo='bank_transfer' /> },
                                { text: 'USD GBP EUR AUD' },
                                { text: '500 - 100,000' },
                                { text: '500 - 100,000' },
                                { text: <TableValues value={[it.L(`${deposit}${working_day}`, 1), it.L(`${withdrawal}${working_day}`, 1)]} /> },
                                { text: <ReferenceLinks pdf_file='Binary.com_BankWire.pdf' video_link='https://youtu.be/fbnOZAf-04Y' /> },
                            ],
                            [
                                { text: <PaymentLogo logo='internet_bank_transfer' /> },
                                { text: 'USD GBP EUR' },
                                { text: '25 - 10,000' },
                                { text: '25 - 10,000' },
                                { text: <TableValues value={[it.L(`${deposit}${working_day}`, 1), it.L(`${withdrawal}${working_day}`, 1)]} /> },
                                { text: <ReferenceLinks /> },
                            ],
                            [
                                { text: <PaymentLogo logo='paysec' /> },
                                { text: 'USD' },
                                { text: '25 - 10,000' },
                                { text: '25 - 10,000' },
                                { text: <TableValues value={[it.L(`${deposit}${instant}`), it.L(`${withdrawal}${working_day}`, 1)]} /> },
                                { text: <ReferenceLinks pdf_file='Binary.com_PaySec.pdf' video_link='https://youtu.be/DTVspCgnx0M' /> },
                            ],
                        ],
                    }}
                />

                <TableTitle title={it.L('Credit/Debit Card')} />
                <Table
                    data={{
                        thead: [ head ],
                        tbody: [
                            [
                                { text: <PaymentLogo logo='visa' /> },
                                { text: 'USD GBP EUR AUD' },
                                { text: '10 - 10,000' },
                                { text: '10 - 10,000' },
                                { text: <TableValues value={[it.L(`${deposit}${instant}`), it.L(`${withdrawal}${working_day}`, 1)]} /> },
                                { text: <ReferenceLinks pdf_file='Binary.com_Credit&Debit.pdf' video_link='https://youtu.be/n_qQbML_qAI' /> },
                            ],
                            [
                                { text: <PaymentLogo logo='mastercard' /> },
                                { text: 'USD GBP EUR AUD' },
                                { text: '10 - 10,000' },
                                { text: '10 - 10,000' },
                                { text: <TableValues value={[it.L(`${deposit}${instant}`), it.L(`${withdrawal}${working_day}`, 1)]} /> },
                                { text: <ReferenceLinks pdf_file='Binary.com_Credit&Debit.pdf' video_link='https://youtu.be/n_qQbML_qAI' /> },
                            ],
                        ],
                    }}
                />


                <div className='gr-padding-10'>
                    <p className='hint'>* {it.L('Mastercard withdrawals are only available to cards issued in an European country. If you do not meet this requirement, you may use an e-wallet method for withdrawal.')}</p>
                </div>

                <TableTitle title={it.L('E-wallet')} />
                <Table
                    data={{
                        thead: [ head ],
                        tbody: [
                            [
                                { text: <PaymentLogo logo='fasapay' /> },
                                { text: 'USD' },
                                { text: '5 - 10,000' },
                                { text: '5 - 10,000' },
                                { text: <TableValues value={[it.L(`${deposit}${instant}`), it.L(`${withdrawal}${working_day}`, 1)]} /> },
                                { text: <ReferenceLinks pdf_file='Binary.com_Fasapay.pdf' video_link='https://youtu.be/PTHLbIRLP58' /> },
                            ],
                            [
                                { text: <PaymentLogo logo='perfect_money' /> },
                                { text: 'USD EUR' },
                                { text: '5 - 10,000' },
                                { text: '5 - 10,000' },
                                { text: <TableValues value={[it.L(`${deposit}${instant}`), it.L(`${withdrawal}${working_day}`, 1)]} /> },
                                { text: <ReferenceLinks pdf_file='Binary.com_PerfectMoney.pdf' video_link='https://youtu.be/fBt71VBp2Pw' /> },
                            ],
                            [
                                { text: <PaymentLogo logo='skrill' /> },
                                { text: 'USD GBP EUR AUD' },
                                { text: '5 - 10,000' },
                                { text: '5 - 10,000' },
                                { text: <TableValues value={[it.L(`${deposit}${instant}`), it.L(`${withdrawal}${working_day}`, 1)]} /> },
                                { text: <ReferenceLinks pdf_file='Binary.com_Skrill.pdf' video_link='https://youtu.be/pQDVDC-mWuA' /> },
                            ],
                            [
                                { text: <PaymentLogo logo='neteller' /> },
                                { text: 'USD GBP EUR AUD' },
                                { text: '5 - 10,000' },
                                { text: '5 - 10,000' },
                                { text: <TableValues value={[it.L(`${deposit}${instant}`), it.L(`${withdrawal}${working_day}`, 1)]} /> },
                                { text: <ReferenceLinks pdf_file='Binary.com_Neteller.pdf' video_link='https://youtu.be/uHjRXzMQ8FY' /> },
                            ],
                            [
                                { text: <PaymentLogo logo='webmoney' /> },
                                { text: 'USD EUR' },
                                { text: '5 - 10,000' },
                                { text: '5 - 10,000' },
                                { text: <TableValues value={[it.L(`${deposit}${instant}`), it.L(`${withdrawal}${working_day}`, 1)]} /> },
                                { text: <ReferenceLinks pdf_file='Binary.com_WebMoney.pdf' video_link='https://youtu.be/e0THC3c-fEE' /> },
                            ],
                            [
                                { text: <PaymentLogo logo='qiwi' /> },
                                { text: 'USD EUR' },
                                { text: <TableValues value={['5 - 200 (USD)', '5 - 150 (EUR)']} /> },
                                { text: <TableValues value={['5 - 200 (USD)', '5 - 150 (EUR)']} /> },
                                { text: <TableValues value={[it.L(`${deposit}${instant}`), it.L(`${withdrawal}${working_day}`, 1)]} /> },
                                { text: <ReferenceLinks pdf_file='Binary.com_Qiwi.pdf' video_link='https://youtu.be/CMAF29cn9XQ' /> },
                            ],
                            [
                                { text: <PaymentLogo logo='yandex' /> },
                                { text: 'USD' },
                                { text: '25 - 10,000' },
                                { text: 'N/A' },
                                { text: <TableValues value={[it.L(`${deposit}${instant}`), it.L(`${withdrawal}${not_applicable}`)]} /> },
                                { text: <ReferenceLinks /> },
                            ],
                            [
                                { text: <PaymentLogo logo='paysafe' /> },
                                { text: 'USD GBP EUR AUD' },
                                { text: '5 - 1,000' },
                                { text: '5 - 750' },
                                { text: <TableValues value={[it.L(`${deposit}${instant}`), it.L(`${withdrawal}${working_day}`, 1)]} /> },
                                { text: <ReferenceLinks pdf_file='Binary.com_PaySafeCard.pdf' video_link='https://youtu.be/5QzGc1nleQo' /> },
                            ],
                        ],
                    }}
                />

                <div data-show='-malta, -maltainvest'>
                    <TableTitle title={it.L('Cryptocurrencies')} withdrawal={it.L('Min Withdrawal')} />
                    <Table
                        data={{
                            thead: [
                                [
                                    { className: 'gr-padding-10', text: it.L('Method') },
                                    { className: 'gr-padding-10', text: it.L('Currencies') },
                                    { className: 'gr-padding-10', text: it.L('Min Deposit') },
                                    { className: 'gr-padding-10', text: it.L('Min Withdrawal') },
                                    { className: 'gr-padding-10', text: `${it.L('Processing Time')}*` },
                                    { className: 'gr-padding-10', text: it.L('Reference') },
                                ],
                            ],
                            tbody: [
                                [
                                    { text: <PaymentLogo logo='bitcoin' /> },
                                    { text: 'BTC' },
                                    { text: '0.002' },
                                    { text: '0.0003' },
                                    { text: <TableValues value={[it.L(`${deposit}${blockchain_confirmations}`, 3), it.L(`${withdrawal}${working_day}`, 1)]} /> },
                                    { text: <ReferenceLinks pdf_file='Binary.com_Bitcoin.pdf' video_link='https://youtu.be/StIW7CviBTw' /> },
                                ],
                                [
                                    { text: <PaymentLogo logo='bitcoin_cash' /> },
                                    { text: 'BCH' },
                                    { text: '0.01' },
                                    { text: '0.003' },
                                    { text: <TableValues value={[it.L(`${deposit}${blockchain_confirmations}`, 3), it.L(`${withdrawal}${working_day}`, 1)]} /> },
                                    { text: <ReferenceLinks pdf_file='Binary.com_BitcoinCash.pdf' video_link='https://youtu.be/jmTx7QMi-Tg' /> },
                                ],
                                [
                                    { text: <PaymentLogo logo='ethereum_black' /> },
                                    { text: 'ETH' },
                                    { text: '0.01' },
                                    { text: '0.01' },
                                    { text: <TableValues value={[it.L(`${deposit}${blockchain_confirmations}`, 3), it.L(`${withdrawal}${working_day}`, 1)]} /> },
                                    { text: <ReferenceLinks pdf_file='Binary.com_Ethereum.pdf' video_link='https://youtu.be/B7EVLt3lIMs' /> },
                                ],
                                // [
                                //     { text: <PaymentLogo logo='' /> },
                                //     { text: 'ETC' },
                                //     { text: '0.002' },
                                //     { text: '0.002' },
                                //     { text: <TableValues value={[it.L(`${deposit}${blockchain_confirmations}`, 3), it.L(`${withdrawal}${working_day}`, 1)]} /> },
                                // ],
                                [
                                    { text: <PaymentLogo logo='litecoin' /> },
                                    { text: 'LTC' },
                                    { text: '0.1' },
                                    { text: '0.02' },
                                    { text: <TableValues value={[it.L(`${deposit}${blockchain_confirmations}`, 3), it.L(`${withdrawal}${working_day}`, 1)]} /> },
                                    { text: <ReferenceLinks pdf_file='Binary.com_Litecoin.pdf' video_link='https://youtu.be/DJhP5UjKPpI' /> },
                                ],
                            ],
                        }}
                    />
                </div>
            </div>

            <div className='gr-padding-10'>
                <p className='hint'>* {it.L('All your deposits and withdrawals are processed by [_1] within 24 hours. However, there may be additional processing time required by your bank or money transfer service.', it.website_name)}</p>
            </div>
        </div>
    );
};

export default PaymentMethods;
