const Client           = require('../../../base/client');
const BinaryPjax       = require('../../../base/binary_pjax');
const urlFor           = require('../../../base/url').urlFor;
const jpClient         = require('../../../common_functions/country_base').jpClient;
const BinarySocket     = require('../../socket');

const AccountType = (() => {
    let url_real,
        url_ico,
        container;
    const onLoad = () => {
        BinarySocket.wait('landing_company').then((response_lc) => {
            url_real = urlFor(Client.getUpgradeInfo(response_lc).upgrade_link);
            url_ico  = urlFor('new_account/realws') + '#ico';
            container = document.getElementById('account_type_container');

            if(Client.canOpenICO()) {
                container.setVisibility(1);
                addEventListener();
            } else {
                BinaryPjax.load(url_real);
            }
        });

        const addEventListener = () => {
            $(container)
                .find('#btn_submit')
                .off('click')
                .on('click', (e) => {
                    $(container)
                        .find('input[type=radio]')
                        .each((i, ele) => {
                            if(ele.checked) {
                                if(ele.value === 'ico') {
                                    BinaryPjax.load(url_ico);
                                } else {
                                    BinaryPjax.load(url_real);
                                }
                            }
                        });
                });
        }
    }

    return {
        onLoad,
    }
})();

module.exports = AccountType;
