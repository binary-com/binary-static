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

const PaymentMethods = () => {
    const head = [
        { className: 'gr-padding-10', text: it.L('Method') },
        { className: 'gr-padding-10', text: it.L('Currencies') },
        { className: 'gr-padding-10', text: it.L('Min-Max Deposit') },
        { className: 'gr-padding-10', text: it.L('Min-Max Withdrawal') },
        { className: 'gr-padding-10', text: it.L('Processing Time') },
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
                        <Button url='/' text={it.L('Open an account now')} />
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
                            ],
                            [
                                { text: <PaymentLogo logo='internet_bank_transfer' /> },
                                { text: 'USD GBP EUR AUD' },
                                { text: '25 - 10,000' },
                                { text: '25 - 10,000' },
                                { text: <TableValues value={[it.L(`${deposit}${working_day}`, 1), it.L(`${withdrawal}${working_day}`, 1)]} /> },
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
                            ],
                            [
                                { text: <PaymentLogo logo='mastercard' /> },
                                { text: 'USD EUR AUD' },
                                { text: '10 - 10,000' },
                                { text: '10 - 10,000' },
                                { text: <TableValues value={[it.L(`${deposit}${instant}`), it.L(`${withdrawal}${working_day}`, 1)]} /> },
                            ],
                            [
                                { text: <PaymentLogo logo='union_pay' /> },
                                { text: 'USD' },
                                { text: '10 - 1,000' },
                                { text: 'N/A' },
                                { text: <TableValues value={[it.L(`${deposit}${instant}`), it.L(`${withdrawal}${not_applicable}`)]} /> },
                            ],
                        ],
                    }}
                />

                <TableTitle title={it.L('E-cash')} />
                <Table
                    data={{
                        thead: [ head ],
                        tbody: [
                            [
                                { text: <PaymentLogo logo='okpay' /> },
                                { text: 'USD EUR' },
                                { text: '5 - 10,000' },
                                { text: '5 - 10,000' },
                                { text: <TableValues value={[it.L(`${deposit}${instant}`), it.L(`${withdrawal}${working_day}`, 1)]} /> },
                            ],
                            [
                                { text: <PaymentLogo logo='fasapay' /> },
                                { text: 'USD' },
                                { text: '5 - 10,000' },
                                { text: '5 - 10,000' },
                                { text: <TableValues value={[it.L(`${deposit}${instant}`), it.L(`${withdrawal}${working_day}`, 1)]} /> },
                            ],
                            [
                                { text: <PaymentLogo logo='perfect_money' /> },
                                { text: 'USD EUR' },
                                { text: '5 - 10,000' },
                                { text: '5 - 10,000' },
                                { text: <TableValues value={[it.L(`${deposit}${instant}`), it.L(`${withdrawal}${working_day}`, 1)]} /> },
                            ],
                            [
                                { text: <PaymentLogo logo='skrill' /> },
                                { text: 'USD GBP EUR AUD' },
                                { text: '5 - 10,000' },
                                { text: '5 - 10,000' },
                                { text: <TableValues value={[it.L(`${deposit}${instant}`), it.L(`${withdrawal}${working_day}`, 1)]} /> },
                            ],
                            [
                                { text: <PaymentLogo logo='neteller' /> },
                                { text: 'USD GBP EUR AUD' },
                                { text: '5 - 10,000' },
                                { text: '5 - 10,000' },
                                { text: <TableValues value={[it.L(`${deposit}${instant}`), it.L(`${withdrawal}${working_day}`, 1)]} /> },
                            ],
                            [
                                { text: <PaymentLogo logo='monetaru' /> },
                                { text: 'USD GBP EUR AUD' },
                                { text: '5 - 10,000' },
                                { text: '5 - 10,000' },
                                { text: <TableValues value={[it.L(`${deposit}${instant}`), it.L(`${withdrawal}${working_day}`, 1)]} /> },
                            ],
                            [
                                { text: <PaymentLogo logo='webmoney' /> },
                                { text: 'USD EUR' },
                                { text: '5 - 10,000' },
                                { text: '5 - 10,000' },
                                { text: <TableValues value={[it.L(`${deposit}${instant}`), it.L(`${withdrawal}${working_day}`, 1)]} /> },
                            ],
                            [
                                { text: <PaymentLogo logo='qiwi' /> },
                                { text: 'USD EUR' },
                                { text: <TableValues value={['5 - 200 (USD)', '5 - 150 (EUR)']} /> },
                                { text: <TableValues value={['5 - 200 (USD)', '5 - 150 (EUR)']} /> },
                                { text: <TableValues value={[it.L(`${deposit}${instant}`), it.L(`${withdrawal}${working_day}`, 1)]} /> },
                            ],
                            [
                                { text: <PaymentLogo logo='yandex' /> },
                                { text: 'USD' },
                                { text: '25 - 10,000' },
                                { text: 'N/A' },
                                { text: <TableValues value={[it.L(`${deposit}${instant}`), it.L(`${withdrawal}${not_applicable}`)]} /> },
                            ],
                            [
                                { text: <PaymentLogo logo='paysafe' /> },
                                { text: 'USD GBP EUR AUD' },
                                { text: '5 - 1,000' },
                                { text: '5 - 750' },
                                { text: <TableValues value={[it.L(`${deposit}${instant}`), it.L(`${withdrawal}${working_day}`, 1)]} /> },
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
                                    { className: 'gr-padding-10', text: it.L('Processing Time') },
                                ],
                            ],
                            tbody: [
                                [
                                    { text: <PaymentLogo logo='bitcoin' /> },
                                    { text: 'BTC' },
                                    { text: '0.002' },
                                    { text: '0.004' },
                                    { text: <TableValues value={[it.L(`${deposit}${blockchain_confirmations}`, 3), it.L(`${withdrawal}${working_day}`, 1)]} /> },
                                ],
                                [
                                    { text: <PaymentLogo logo='bitcoin_cash' /> },
                                    { text: 'BCH' },
                                    { text: '0.01' },
                                    { text: '0.003' },
                                    { text: <TableValues value={[it.L(`${deposit}${blockchain_confirmations}`, 3), it.L(`${withdrawal}${working_day}`, 1)]} /> },
                                ],
                                [
                                    { text: <PaymentLogo logo='ethereum_black' /> },
                                    { text: 'ETH' },
                                    { text: '0.01' },
                                    { text: '0.01' },
                                    { text: <TableValues value={[it.L(`${deposit}${blockchain_confirmations}`, 3), it.L(`${withdrawal}${working_day}`, 1)]} /> },
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
