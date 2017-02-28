const BinaryPjax           = require('../../base/binary_pjax');
const Client               = require('../../base/client').Client;
const default_redirect_url = require('../../base/url').default_redirect_url;
const url_for              = require('../../base/url').url_for;
const template             = require('../../base/utility').template;

const TNCApproval = (function() {
    'use strict';

    const hidden_class = 'invisible';

    const onLoad = function() {
        requiresTNCApproval($('#btn_accept'), display, null, true);
    };

    const display = () => {
        const landing_company = Client.get('landing_company_fullname');
        if (!landing_company) return;

        const $container = $('#tnc_container');
        const $tnc_msg   = $container.find('#tnc_message');
        $tnc_msg.html(template($tnc_msg.html(), [
            landing_company,
            url_for(Client.get('residence') === 'jp' ? 'terms-and-conditions-jp' : 'terms-and-conditions'),
        ]));
        $container.find('#tnc_loading').remove();
        $container.find('#tnc_approval').removeClass(hidden_class);
    };

    const requiresTNCApproval = ($btn, funcDisplay, onSuccess, redirect_anyway) => {
        BinarySocket.wait('website_status', 'get_settings').then(() => {
            if (!Client.should_accept_tnc()) {
                redirectBack(redirect_anyway);
                return;
            }

            funcDisplay();

            $btn.click(function (e) {
                e.preventDefault();
                e.stopPropagation();
                BinarySocket.send({ tnc_approval: '1' }, true).then((response) => {
                    if (response.error) {
                        $('#err_message').html(response.error.message).removeClass(hidden_class);
                    } else {
                        BinarySocket.send({ get_settings: 1 }, true);
                        BinarySocket.send({ website_status: 1 });
                        redirectBack(redirect_anyway);
                        if (typeof onSuccess === 'function') {
                            onSuccess();
                        }
                    }
                });
            });
        });
    };

    const redirectBack = function(redirect_anyway) {
        if (redirect_anyway) {
            setTimeout(() => {
                BinaryPjax.load(default_redirect_url());
            }, 500);
        }
    };

    return {
        onLoad             : onLoad,
        requiresTNCApproval: requiresTNCApproval,
    };
})();

module.exports = TNCApproval;
