const Onfido = require('../../../../_common/base/onfido');

const Authenticate = (() => {

    const onLoad = () => {
        const user = {
            first: 'Me',
            last : 'po',
        };
        Onfido.init(user);
    };

    return {
        onLoad,
    };
})();

module.exports = Authenticate;
