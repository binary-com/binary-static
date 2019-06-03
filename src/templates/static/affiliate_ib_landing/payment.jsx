import React       from 'react';
import PaymentLogo from '../../_common/components/payment_logo.jsx';

const Payment = () => (
    <section id='payment'>
        <h2>{it.L('Receive your earnings through your favourite payment method')}</h2>
        <div className='container center-text gr-padding-30'>
            <div className='gr-row gr-row-align-center'>
                <PaymentLogo />
            </div>
        </div>
    </section>
);

export default Payment;
