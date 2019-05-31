import React       from 'react';
import PaymentLogo from '../../_common/components/payment_logo.jsx';

const Payment = () => (
    <section className='payment-method white-bg-color'>
        <div className='container center-text full-height gr-padding-30'>
            <h2>{it.L('Receive your earnings through your favourite payment method')}</h2>
            <div className='gr-row gr-row-align-center'>
                <PaymentLogo />
            </div>
        </div>
    </section>
);

export default Payment;
