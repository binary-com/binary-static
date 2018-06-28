import { observable, action } from 'mobx';

export default class ApiTokenModel {
    @observable data = {
        token_name: '',
    }

    @action.bound
    onChange = (e) => {
        const { name, value } = e.target;
        this.data[name] = value;
    }
}
