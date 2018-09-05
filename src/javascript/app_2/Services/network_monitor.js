import { BinarySocketGeneral } from './index';
import NetworkMonitorBase      from '../../_common/base/network_monitor_base'; // eslint-disable-line import/order

// TODO: implement a component to display network status and corresponding messages
const NetworkMonitor = (() => {
    const init = (store) => {
        NetworkMonitorBase.init(BinarySocketGeneral.init(store));
    };

    return {
        init,
    };
})();

export default NetworkMonitor;
