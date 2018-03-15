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
        { className: 'gr-padding-10 method',     text: it.L('Method') },
        { className: 'gr-padding-10 currency',   text: it.L('Currencies') },
        { className: 'gr-padding-10 deposit',    text: it.L('Min-Max Deposit') },
        { className: 'gr-padding-10 withdrawal', text: it.L('Min-Max Withdrawal') },
        { className: 'gr-padding-10 processing', text: it.L('Processing Time') },
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
                                { className: 'method',     text: <PaymentLogo logo='bank_transfer' /> },
                                { className: 'currency',   text: 'USD GBP EUR AUD' },
                                { className: 'deposit',    text: '500 - 100,000' },
                                { className: 'withdrawal', text: '500 - 100,000' },
                                { className: 'processing', text: <TableValues value={[it.L(`${deposit}${working_day}`, 1), it.L(`${withdrawal}${working_day}`, 1)]} /> },
                            ],
                            [
                                { className: 'method',     text: <PaymentLogo logo='internet_bank_transfer' /> },
                                { className: 'currency',   text: 'USD GBP EUR AUD' },
                                { className: 'deposit',    text: '25 - 10,000' },
                                { className: 'withdrawal', text: '25 - 10,000' },
                                { className: 'processing', text: <TableValues value={[it.L(`${deposit}${working_day}`, 1), it.L(`${withdrawal}${working_day}`, 1)]} /> },
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
                                { className: 'method',     text: <PaymentLogo logo='visa' /> },
                                { className: 'currency',   text: 'USD GBP EUR AUD' },
                                { className: 'deposit',    text: '10 - 10,000' },
                                { className: 'withdrawal', text: '10 - 10,000' },
                                { className: 'processing', text: <TableValues value={[it.L(`${deposit}${instant}`), it.L(`${withdrawal}${working_day}`, 1)]} /> },
                            ],
                            [
                                { className: 'method',     text: <PaymentLogo logo='mastercard' /> },
                                { className: 'currency',   text: 'USD EUR AUD' },
                                { className: 'deposit',    text: '10 - 10,000' },
                                { className: 'withdrawal', text: '10 - 10,000' },
                                { className: 'processing', text: <TableValues value={[it.L(`${deposit}${instant}`), it.L(`${withdrawal}${working_day}`, 1)]} /> },
                            ],
                            [
                                { className: 'method',     text: <PaymentLogo logo='union_pay' /> },
                                { className: 'currency',   text: 'USD' },
                                { className: 'deposit',    text: '10 - 1,000' },
                                { className: 'withdrawal', text: 'N/A' },
                                { className: 'processing', text: <TableValues value={[it.L(`${deposit}${instant}`), it.L(`${withdrawal}${not_applicable}`)]} /> },
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
                                { className: 'method',     text: <PaymentLogo logo='okpay' /> },
                                { className: 'currency',   text: 'USD EUR' },
                                { className: 'deposit',    text: '5 - 10,000' },
                                { className: 'withdrawal', text: '5 - 10,000' },
                                { className: 'processing', text: <TableValues value={[it.L(`${deposit}${instant}`), it.L(`${withdrawal}${working_day}`, 1)]} /> },
                            ],
                            [
                                { className: 'method',     text: <PaymentLogo logo='fasapay' /> },
                                { className: 'currency',   text: 'USD' },
                                { className: 'deposit',    text: '5 - 10,000' },
                                { className: 'withdrawal', text: '5 - 10,000' },
                                { className: 'processing', text: <TableValues value={[it.L(`${deposit}${instant}`), it.L(`${withdrawal}${working_day}`, 1)]} /> },
                            ],
                            [
                                { className: 'method',     text: <PaymentLogo logo='perfect_money' /> },
                                { className: 'currency',   text: 'USD EUR' },
                                { className: 'deposit',    text: '5 - 10,000' },
                                { className: 'withdrawal', text: '5 - 10,000' },
                                { className: 'processing', text: <TableValues value={[it.L(`${deposit}${instant}`), it.L(`${withdrawal}${working_day}`, 1)]} /> },
                            ],
                            [
                                { className: 'method',     text: <PaymentLogo logo='skrill' /> },
                                { className: 'currency',   text: 'USD GBP EUR AUD' },
                                { className: 'deposit',    text: '5 - 10,000' },
                                { className: 'withdrawal', text: '5 - 10,000' },
                                { className: 'processing', text: <TableValues value={[it.L(`${deposit}${instant}`), it.L(`${withdrawal}${working_day}`, 1)]} /> },
                            ],
                            [
                                { className: 'method',     text: <PaymentLogo logo='neteller' /> },
                                { className: 'currency',   text: 'USD GBP EUR AUD' },
                                { className: 'deposit',    text: '5 - 10,000' },
                                { className: 'withdrawal', text: '5 - 10,000' },
                                { className: 'processing', text: <TableValues value={[it.L(`${deposit}${instant}`), it.L(`${withdrawal}${working_day}`, 1)]} /> },
                            ],
                            [
                                { className: 'method',     text: <PaymentLogo logo='monetaru' /> },
                                { className: 'currency',   text: 'USD GBP EUR AUD' },
                                { className: 'deposit',    text: '5 - 10,000' },
                                { className: 'withdrawal', text: '5 - 10,000' },
                                { className: 'processing', text: <TableValues value={[it.L(`${deposit}${instant}`), it.L(`${withdrawal}${working_day}`, 1)]} /> },
                            ],
                            [
                                { className: 'method',     text: <PaymentLogo logo='webmoney' /> },
                                { className: 'currency',   text: 'USD EUR' },
                                { className: 'deposit',    text: '5 - 10,000' },
                                { className: 'withdrawal', text: '5 - 10,000' },
                                { className: 'processing', text: <TableValues value={[it.L(`${deposit}${instant}`), it.L(`${withdrawal}${working_day}`, 1)]} /> },
                            ],
                            [
                                { className: 'method',     text: <PaymentLogo logo='qiwi' /> },
                                { className: 'currency',   text: 'USD EUR' },
                                { className: 'deposit',    text: <TableValues value={['5 - 200 (USD)', '5 - 150 (EUR)']} /> },
                                { className: 'withdrawal', text: <TableValues value={['5 - 200 (USD)', '5 - 150 (EUR)']} /> },
                                { className: 'processing', text: <TableValues value={[it.L(`${deposit}${instant}`), it.L(`${withdrawal}${working_day}`, 1)]} /> },
                            ],
                            [
                                { className: 'method',     text: <PaymentLogo logo='yandex' /> },
                                { className: 'currency',   text: 'USD' },
                                { className: 'deposit',    text: '25 - 10,000' },
                                { className: 'withdrawal', text: 'N/A' },
                                { className: 'processing', text: <TableValues value={[it.L(`${deposit}${instant}`), it.L(`${withdrawal}${not_applicable}`)]} /> },
                            ],
                            [
                                { className: 'method',     text: <PaymentLogo logo='paysafe' /> },
                                { className: 'currency',   text: 'USD GBP EUR AUD' },
                                { className: 'deposit',    text: '5 - 1,000' },
                                { className: 'withdrawal', text: '5 - 750' },
                                { className: 'processing', text: <TableValues value={[it.L(`${deposit}${instant}`), it.L(`${withdrawal}${working_day}`, 1)]} /> },
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
                                    { className: 'gr-padding-10 method',     text: it.L('Method') },
                                    { className: 'gr-padding-10 currency',   text: it.L('Currencies') },
                                    { className: 'gr-padding-10 deposit',    text: it.L('Min Deposit') },
                                    { className: 'gr-padding-10 withdrawal', text: it.L('Min Withdrawal') },
                                    { className: 'gr-padding-10 processing', text: it.L('Processing Time') },
                                ],
                            ],
                            tbody: [
                                [
                                    { className: 'method',     text: <PaymentLogo logo='bitcoin' /> },
                                    { className: 'currency',   text: 'BTC' },
                                    { className: 'deposit',    text: '0.002' },
                                    { className: 'withdrawal', text: '0.004' },
                                    { className: 'processing', text: <TableValues value={[it.L(`${deposit}${blockchain_confirmations}`, 3), it.L(`${withdrawal}${working_day}`, 1)]} /> },
                                ],
                                [
                                    { className: 'method',     text: <PaymentLogo logo='bitcoin_cash' /> },
                                    { className: 'currency',   text: 'BCH' },
                                    { className: 'deposit',    text: '0.01' },
                                    { className: 'withdrawal', text: '0.003' },
                                    { className: 'processing', text: <TableValues value={[it.L(`${deposit}${blockchain_confirmations}`, 3), it.L(`${withdrawal}${working_day}`, 1)]} /> },
                                ],
                                [
                                    { className: 'method',     text: <PaymentLogo logo='ethereum_black' /> },
                                    { className: 'currency',   text: 'ETH' },
                                    { className: 'deposit',    text: '0.01' },
                                    { className: 'withdrawal', text: '0.01' },
                                    { className: 'processing', text: <TableValues value={[it.L(`${deposit}${blockchain_confirmations}`, 3), it.L(`${withdrawal}${working_day}`, 1)]} /> },
                                ],
                                // [
                                //     { className: 'method',     text: <PaymentLogo logo='' /> },
                                //     { className: 'currency',   text: 'ETC' },
                                //     { className: 'deposit',    text: '0.002' },
                                //     { className: 'withdrawal', text: '0.002' },
                                //     { className: 'processing', text: <TableValues value={[it.L(`${deposit}${blockchain_confirmations}`, 3), it.L(`${withdrawal}${working_day}`, 1)]} /> },
                                // ],
                                [
                                    { className: 'method',     text: <PaymentLogo logo='litecoin' /> },
                                    { className: 'currency',   text: 'LTC' },
                                    { className: 'deposit',    text: '0.1' },
                                    { className: 'withdrawal', text: '0.02' },
                                    { className: 'processing', text: <TableValues value={[it.L(`${deposit}${blockchain_confirmations}`, 3), it.L(`${withdrawal}${working_day}`, 1)]} /> },
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
