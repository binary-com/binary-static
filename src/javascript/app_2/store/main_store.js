import { observable } from 'mobx';
import moment         from 'moment';

export default class MainStore {
    @observable server_time = moment.utc();
};
