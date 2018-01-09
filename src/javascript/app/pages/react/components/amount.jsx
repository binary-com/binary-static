import React from 'react';
import { TextField } from './form/text_field.jsx';
import Client from '../../../base/client';

class Amount extends React.PureComponent {
    render() {
        const currencies = ['USD', 'AUD', 'GBP', 'BTC'];
        const currency   = this.props.currency;
        return (
            <fieldset>
                <select name='basis' value={this.props.basis} onChange={this.props.onChange}>
                    <option value='payout'>Payout</option>
                    <option value='stake'>Stake</option>
                </select>

                {Client.get('currency') ?
                    <span className={`symbols ${currency.toLowerCase()}`}></span> :
                    <select name='currency' value={currency || currencies[0]} onChange={this.props.onChange}>
                        {currencies.map((cur, idx) => (
                            <option key={idx} value={cur}>{cur}</option>
                        ))}
                    </select>
                }

                <TextField name='amount' value={this.props.amount} onChange={this.props.onChange} />
            </fieldset>
        );
    }
}

module.exports = Amount;
