import ClientStore  from './client_store';
import CommonStore  from './common_store';
import ModulesStore from './Modules';
import UIStore      from './ui_store';

export class RootStore {
    constructor() {
        this.client  = new ClientStore(this);
        this.common  = new CommonStore();
        this.modules = new ModulesStore(this);
        this.ui      = new UIStore();
    }
}

const root_store = new RootStore();

export default root_store;
