const Client               = require('../../base/client').Client;
const State                = require('../../base/storage').State;
const default_redirect_url = require('../../base/url').default_redirect_url;
const url_for              = require('../../base/url').url_for;
const template             = require('../../base/utility').template;

const TNCApproval = (function() {
    'use strict';

    const hidden_class = 'invisible';

    const init = function() {
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
            const terms_conditions_version = State.get(['response', 'website_status', 'website_status', 'terms_conditions_version']);
            const client_tnc_status        = State.get(['response', 'get_settings', 'get_settings', 'client_tnc_status']);

            if (Client.get('is_virtual') || !terms_conditions_version || terms_conditions_version === client_tnc_status) {
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
                        BinarySocket.send({ get_settings: '1' }, true);
                        sessionStorage.setItem('check_tnc', 'checked');
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
        const redirect_url = sessionStorage.getItem('tnc_redirect');
        sessionStorage.removeItem('tnc_redirect');
        if (redirect_url || redirect_anyway) {
            window.location.href = redirect_url || default_redirect_url();
        }
    };

    return {
        init               : init,
        requiresTNCApproval: requiresTNCApproval,
    };
})();

module.exports = TNCApproval;
