import { observable, action } from 'mobx';

export default class AccountPasswordModel {
    @observable data = {
        current_password : '',
        new_password     : '',
        verified_password: '',
    }

    @action.bound
    onChange = (e) => {
        const { name, value } = e.target;
        this.data[name] = value;
    }
}
