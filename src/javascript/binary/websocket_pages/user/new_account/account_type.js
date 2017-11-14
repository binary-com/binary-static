const BinarySocket = require('../../socket');
const BinaryPjax   = require('../../../base/binary_pjax');
const Client       = require('../../../base/client');
const urlFor       = require('../../../base/url').urlFor;

const AccountType = (() => {
    let url_real,
        url_ico,
        container;
    const onLoad = () => {
        BinarySocket.wait('landing_company').then((response_lc) => {
            url_ico  = `${urlFor('new_account/realws')  }#ico`;
            url_real = urlFor(Client.getUpgradeInfo(response_lc).upgrade_link);
            container = document.getElementById('account_type_container');

            if(Client.canOpenICO() && container) {
                container.setVisibility(1);
                onSubmit();
            } else {
                BinaryPjax.load(url_real);
            }
        });

        const onSubmit = () => {
            $(container)
                .find('#btn_submit')
                .off('click')
                .on('click', () => {
                    const value = $(container).find('input[type=radio]:checked').val();
                    if (value === 'ico') {
                        BinaryPjax.load(url_ico);
                    } else {
                        BinaryPjax.load(url_real);
                    }
                });
        };
    };

    return {
        onLoad,
    };
})();

module.exports = AccountType;
