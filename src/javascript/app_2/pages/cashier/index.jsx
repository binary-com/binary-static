import React from 'react';
import Breadcrumb from '../../components/elements/breadcrumbs.jsx';
import Button from '../../components/form/button.jsx';
import { localize } from '../../../_common/localize';
import { connect } from '../../store/connect';

const Card = ({ title, subtitle, buttons }) => (
    <div className='card'>
        <p className='card-title'>{localize(title)}</p>
        <p className='card-subtitle'>{localize(subtitle)}</p>
        <div className='card-btn-group'>
            { buttons.map((button) => (<Button className='secondary effect' key={button.id} text={button.text} />)) }
        </div>
    </div>
);

class Cashier extends React.PureComponent {
    constructor(props) {
        super(props);

        const { active_account, paymentagent_list } = this.props;

        this.state = {
            is_disabled     : active_account.is_disabled,
            is_virtual      : active_account.is_virtual,
            is_crypto       : this.isCryptocurrency(active_account.currency) && !(active_account.is_virtual),
            has_paymentagent: (paymentagent_list.length || false) && !(active_account.is_virtual),
        };
    }

    isCryptocurrency = (currency) => (/^(BCH|BTC|ETH|LTC)/.test(currency));

    render() {
        return (
            <div className='default'>
                <Breadcrumb routes= {
                [{
                    name: 'Cashier',
                    href: '',
                }, {
                    name: 'Getting started',
                    href: '',
                }, {
                    name: 'Some',
                }]}
                />
                <p>View available payment methods <a href='' className='link'>here</a></p>

                <div className='grid-4'>
                    {
                        (!this.state.is_virtual && !this.state.is_crypto) &&
                        <Card
                            title='Bank-wire, credit card, e-cash wallet'
                            subtitle='Deposit or withdraw to your account via bank-wire, credit card, or e-cash wallet.'
                            buttons={[
                                {id: 'btn_deposit', text: 'Deposit', link: ''},
                                {id: 'btn_withdraw', text: 'Withdraw', link: ''}]}
                        />
                    }
                    {
                        (this.state.has_paymentagent && !this.state.is_crypto) &&
                        <Card
                            title='Payment Agent'
                            subtitle='For e-cash methods or local currencies not supported by Binary.com.'
                            buttons={[
                                { id: 'btn_pa_deposit',  text: 'Deposit',  link: ''},
                                { id: 'btn_pa_withdraw', text: 'Withdraw', link: ''}]}
                        />
                    }
                    {
                        !this.state.is_virtual &&
                        <Card
                            title='Transfer Between Accounts'
                            subtitle='Transfer funds between your gaming accounts and financial accounts.'
                            buttons={[{ id: 'btn_transfer',  text: 'Transfer',  link: ''}]}
                        />
                    }
                    {
                        !!this.state.is_virtual &&
                        <Card
                            title='Top up Virtual Account'
                            subtitle='Top up your virtual account with an additional USD 10,000.00 if your balance falls below USD 1,000.00.'
                            buttons={[{ id: 'btn_topup',   text: 'Get USD 10,000.00',  link: ''}]}
                        />
                    }
                    {
                        this.state.is_crypto &&
                        <Card
                            title='Cryptocurrency'
                            subtitle='Manage the funds in your cryptocurrency account.'
                            buttons={[
                                { id: 'btn_deposit',  text: 'Deposit',  link: ''},
                                { id: 'btn_withdraw', text: 'Withdraw', link: ''} ]}
                        />
                    }
                </div>
            </div>
        );
    }
}

export default connect(
    ({ ui }) => ({
        active_account   : ui.active_account,
        paymentagent_list: ui.paymentagent_list,
    })
)(Cashier);
