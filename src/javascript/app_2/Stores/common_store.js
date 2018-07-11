import { observable } from 'mobx';
import moment         from 'moment';
import BaseStore      from './base_store';

export default class CommonStore extends BaseStore {
    @observable server_time = moment.utc();
};
