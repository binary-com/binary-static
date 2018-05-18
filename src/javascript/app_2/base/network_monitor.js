import BinarySocketGeneral from './socket_general';
import NetworkMonitorBase  from '../../_common/base/network_monitor_base';

// TODO: implement a component to display network status and corresponding messages
const NetworkMonitor = (() => {
    const init = (client_store) => {
        NetworkMonitorBase.init(BinarySocketGeneral.init(client_store));
    };

    return {
        init,
    };
})();

export default NetworkMonitor;
