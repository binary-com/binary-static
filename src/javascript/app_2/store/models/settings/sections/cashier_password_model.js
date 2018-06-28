import { observable, action } from 'mobx';
import WS from '../../../../data/ws_methods';

export default class CashierPasswordModel {
    @observable data = {
        cashier_pw         : '',
        verified_cashier_pw: '',
    }

    @action.bound
    handleSubmit = async (e) => {
        e.preventDefault();
        const response = await WS.sendCashierPassword(this.cashier_pw);
        if (!response.error) {
            console.log(response);
            // To-Do: Render Success Msg.
            console.log('Success!');
        } else {
            // To-DO: Render Failed Message.
            console.log(response.error.message);
        }
    }

    @action.bound
    onChange = (e) => {
        const { name, value } = e.target;
        this.data[name] = value;
    }
}
