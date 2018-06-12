import { observable } from 'mobx';
import moment         from 'moment';

export default class CommonStore {
    @observable server_time = moment.utc();
};
