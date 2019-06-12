import React       from 'react';
import PaymentLogo from '../../_common/components/payment_logo.jsx';

const Payment = () => (
    <section id='payment' className='gr-row gr-row-align-center center-text gr-padding-30'>
        <div className='gr-12'>
            <h2>{it.L('Receive your earnings through your favourite payment method')}</h2>
        </div>
        <div className='gr-9'>
            <div className='gr-row gr-row-align-center'>
                <PaymentLogo />
            </div>
        </div>
    </section>
);

export default Payment;
