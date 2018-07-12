import { observable } from 'mobx';
import BaseStore      from './base_store';

export default class ClientStore extends BaseStore {
    @observable balance;
};
