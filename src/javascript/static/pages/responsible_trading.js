const Client          = require('./../../app/base/client');
const State           = require('../../_common/storage').State;

const ResponsibleTrading = (() => {
    
    const onLoad = () => {
        
        console.log('starting....');

        const get_settings = State.getResponse('get_settings');
        const residence = Client.get('residence')
        console.log('on load get_settings:',get_settings);
        console.log('on load residence:',residence); 
      
    };


    const onUnload = () => {
        // TabSelector.onUnload();
    };

    return {
        onLoad,
        onUnload,
    };
})();

module.exports = ResponsibleTrading;
