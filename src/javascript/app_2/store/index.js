import ClientStore from './client_store';
import CommonStore from './common_store';
import TradeStore  from './trade_store';
import UIStore     from './ui_store';

export default class MainStore {
    client = new ClientStore();
    common = new CommonStore();
    trade  = new TradeStore(this);
    ui     = new UIStore();
};
