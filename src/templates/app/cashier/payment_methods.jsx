import React from 'react';

const Button = ({ url, real, className, text }) => (
    <a href={it.url_for(url)} className={`toggle button ${real ? 'client_real' : 'client_logged_out'} invisible`}>
        <span className={className || undefined}>{text}</span>
    </a>
);

const Row = ({
    is_header,
    logo,
    method,
    currencies,
    deposit,
    withdrawal,
    time,
}) => {
    const deposits = Array.isArray(deposit) ? deposit : [deposit];
    const withdrawals = Array.isArray(withdrawal) ? withdrawal : [withdrawal];
    const times = Array.isArray(time) ? time : [time];
    return (
        <div className={`gr-row gr-padding-10 ${is_header ? 'table-header' : 'table-body' }`}>
            <div className='gr-2 gr-6-m'>
                { logo ?
                    <img src={it.url_for(`images/pages/home/payment/${  logo  }.svg`)} />
                    : method
                }
            </div>
            <div className='gr-2 gr-6-m'>{currencies}</div>
            <div className='gr-2 gr-hide-m'>
                { deposits.reduce((arr, e, inx) => arr === null ? [e] : [...arr, <br key={inx} />, e], null) }
            </div>
            <div className='gr-3 gr-hide-m'>
                { withdrawals.reduce((arr, e, inx) => arr === null ? [e] : [...arr, <br key={inx} />, e], null) }
            </div>
            <div className='gr-3 gr-hide-m'>
                { times.reduce((arr, e, inx) => arr === null ? [e] : [...arr, <br key={inx}/>, e], null) }
            </div>
        </div>
    );
};

const Section = ({ title, withdrawal }) => (
    <React.Fragment>
        <div className='gr-row gr-padding-10'>
            <div className='gr-12'>
                <h3>{title}</h3>
            </div>
        </div>
        <Row
            is_header
            method={it.L('Method')}
            currencies={it.L('Currencies')}
            deposit={it.L('Min-Max Deposit')}
            withdrawal={withdrawal || it.L('Min-Max Withdrawal')}
            time={it.L('Processing Time')}
        />
    </React.Fragment>
);

const PaymentMethods = () => (
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

        <div id='payment_methods'>
            <Section title={it.L('Bank wire/Money transfer')} />
            <Row
                id='int_bank_wire'
                logo='bank_transfer'
                currencies='USD GBP EUR AUD'
                deposit='500 - 100,000'
                withdrawal='500 - 100,000'
                time={[
                    it.L('Deposit: [_1] working day', 1),
                    it.L('Withdrawal: [_1] working day', 1),
                ]}
            />
            <Row
                id='local_bank_transfer'
                logo='internet_bank_transfer'
                currencies='USD GBP EUR AUD'
                deposit='25 - 10,000'
                withdrawal='25 - 10,000'
                time={[
                    it.L('Deposit: [_1] working day', 1),
                    it.L('Withdrawal: [_1] working day', 1),
                ]}
            />

            <Section title={it.L('Credit/Debit Card')} />
            <Row
                id='visa'
                logo='visa'
                currencies='USD GBP EUR AUD'
                deposit='10 - 10,000'
                withdrawal='10 - 10,000'
                time={[
                    it.L('Deposit: Instant'),
                    it.L('Withdrawal: [_1] working day', 1),
                ]}
            />
            <Row
                id='mastercard'
                logo='mastercard'
                currencies='USD EUR AUD'
                deposit='10 - 10,000'
                withdrawal='10 - 10,000'
                time={[
                    it.L('Deposit: Instant'),
                    it.L('Withdrawal: [_1] working day', 1),
                ]}
            />
            <Row
                id='cuo_credit_card'
                logo='union_pay'
                currencies='USD'
                deposit='10 - 1,000'
                withdrawal='N/A'
                time={[
                    it.L('Deposit: Instant'),
                    it.L('Withdrawal: Not applicable'),
                ]}
            />

            <Section title={it.L('E-cash')} />
            <Row
                id='okpay'
                logo='okpay'
                currencies='USD EUR'
                deposit='5 - 10,000'
                withdrawal='5 - 10,000'
                time={[
                    it.L('Deposit: Instant'),
                    it.L('Withdrawal: [_1] working day', 1),
                ]}
            />
            <Row
                id='fastpay'
                logo='fasapay'
                currencies='USD'
                deposit='5 - 10,000'
                withdrawal='5 - 10,000'
                time={[
                    it.L('Deposit: Instant'),
                    it.L('Withdrawal: [_1] working day', 1),
                ]}
            />
            <Row
                id='perfect_money'
                logo='perfect_money'
                currencies='USD EUR'
                deposit='5 - 10,000'
                withdrawal='5 - 10,000'
                time={[
                    it.L('Deposit: Instant'),
                    it.L('Withdrawal: [_1] working day', 1),
                ]}
            />
            <Row
                id='moneybrokers'
                logo='skrill'
                currencies='USD GBP EUR AUD'
                deposit='5 - 10,000'
                withdrawal='5 - 10,000'
                time={[
                    it.L('Deposit: Instant'),
                    it.L('Withdrawal: [_1] working day', 1),
                ]}
            />
            <Row
                id='neteller'
                logo='neteller'
                currencies='USD GBP EUR AUD'
                deposit='5 - 10,000'
                withdrawal='5 - 10,000'
                time={[
                    it.L('Deposit: Instant'),
                    it.L('Withdrawal: [_1] working day', 1),
                ]}
            />
            <Row
                id='moneta'
                logo='monetaru'
                currencies='USD GBP EUR AUD'
                deposit='5 - 10,000'
                withdrawal='5 - 10,000'
                time={[
                    it.L('Deposit: Instant'),
                    it.L('Withdrawal: [_1] working day', 1),
                ]}
            />
            <Row
                id='webmoney'
                logo='webmoney'
                currencies='USD EUR'
                deposit='5 - 10,000'
                withdrawal='5 - 10,000'
                time={[
                    it.L('Deposit: Instant'),
                    it.L('Withdrawal: [_1] working day', 1),
                ]}
            />
            <Row
                id='qiwi'
                logo='qiwi'
                currencies='USD EUR'
                deposit={['5 - 200 (USD)', '5 - 150 (EUR)']}
                withdrawal={['5 - 200 (USD)', '5 - 150 (EUR)']}
                time={[
                    it.L('Deposit: Instant'),
                    it.L('Withdrawal: [_1] working day', 1),
                ]}
            />
            <Row
                id='yandex'
                logo='yandex'
                currencies='USD'
                deposit='25 - 10,000'
                withdrawal='N/A'
                time={[
                    it.L('Deposit: Instant'),
                    it.L('Withdrawal: Not Applicable'),
                ]}
            />
            <Row
                id='paysafecard'
                logo='paysafe'
                currencies='USD GBP EUR AUD'
                deposit='5 - 1,000'
                withdrawal='5 - 750'
                time={[
                    it.L('Deposit: Instant'),
                    it.L('Withdrawal: [_1] working day', 1),
                ]}
            />

            <div data-show='-malta, -maltainvest'>
                <Section title={it.L('Cryptocurrencies')} withdrawal={it.L('Min Withdrawal')} />
                <Row
                    id='btc'
                    logo='bitcoin'
                    currencies='BTC'
                    deposit='0.002'
                    withdrawal='0.004'
                    time={[
                        it.L('Deposit: 3 blockchain confirmations'),
                        it.L('Withdrawal: [_1] working day', 1),
                    ]}
                />
                <Row
                    id='bch'
                    logo='bitcoin_cash'
                    currencies='BCH'
                    deposit='0.01'
                    withdrawal='0.003'
                    time={[
                        it.L('Deposit: 3 blockchain confirmations'),
                        it.L('Withdrawal: [_1] working day', 1),
                    ]}
                />
                <Row
                    id='eth'
                    logo='ethereum_black'
                    currencies='ETH'
                    deposit='0.01'
                    withdrawal='0.01'
                    time={[
                        it.L('Deposit: 3 blockchain confirmations'),
                        it.L('Withdrawal: [_1] working day', 1),
                    ]}
                />
                {/* <Row
                    id='etc'
                    currencies='ETC'
                    deposit='0.002'
                    withdrawal='0.002'
                    time={[
                        it.L('Deposit: 3 blockchain confirmations'),
                        it.L('Withdrawal: [_1] working day', 1),
                    ]}
                /> */}
                <Row
                    id='ltc'
                    logo='litecoin'
                    currencies='LTC'
                    deposit='0.1'
                    withdrawal='0.02'
                    time={[
                        it.L('Deposit: 3 blockchain confirmations'),
                        it.L('Withdrawal: [_1] working day', 1),
                    ]}
                />
            </div>
        </div>
    
        <div className='gr-padding-10'>
            <p className='hint'>* {it.L('All your deposits and withdrawals are processed by [_1] within 24 hours. However, there may be additional processing time required by your bank or money transfer service.', it.website_name)}</p>
        </div>
    </div>
);

export default PaymentMethods;
