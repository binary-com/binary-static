import BinarySocketGeneral from './socket_general';
import NetworkMonitorBase from '../../_common/base/network_monitor_base';

// TODO: implement a component to display network status and corresponding messages
const NetworkMonitor = (() => {
    const init = () => {
        NetworkMonitorBase.init(BinarySocketGeneral);
    };

    return {
        init,
    };
})();

export default NetworkMonitor;
