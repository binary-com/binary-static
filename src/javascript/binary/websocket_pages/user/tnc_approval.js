const Client               = require('../../base/client').Client;
const State                = require('../../base/storage').State;
const default_redirect_url = require('../../base/url').default_redirect_url;
const url_for              = require('../../base/url').url_for;
const template             = require('../../base/utility').template;

const TNCApproval = (function() {
    'use strict';

    let redirect_url;
    const hidden_class = 'invisible';

    const init = function() {
        redirect_url = sessionStorage.getItem('tnc_redirect');
        sessionStorage.removeItem('tnc_redirect');

        BinarySocket.wait('website_status', 'get_settings').then(() => {
            showTNC();
        });
    };

    const showTNC = function() {
        const terms_conditions_version = State.get(['response', 'website_status', 'website_status', 'terms_conditions_version']);
        const client_tnc_status        = State.get(['response', 'get_settings', 'get_settings', 'client_tnc_status']);
        const landing_company          = Client.get('landing_company_fullname');

        if (!terms_conditions_version || !client_tnc_status || !landing_company) {
            return;
        }

        if (terms_conditions_version === client_tnc_status) {
            redirectBack();
            return;
        }

        const $container = $('#tnc_container');
        const $tnc_msg = $container.find('#tnc_message');
        $tnc_msg.html(template($tnc_msg.html(), [
            landing_company,
            url_for(Client.get('residence') === 'jp' ? 'terms-and-conditions-jp' : 'terms-and-conditions'),
        ]));
        $container.find('#tnc_loading').remove();
        $container.find('#tnc_approval').removeClass(hidden_class);

        $container.find('#btn_accept').click(function(e) {
            e.preventDefault();
            e.stopPropagation();
            BinarySocket.send({ tnc_approval: '1' }, true).then((response) => {
                if (response.error) {
                    $('#err_message').html(response.error.message).removeClass(hidden_class);
                } else {
                    sessionStorage.setItem('check_tnc', 'checked');
                    redirectBack();
                }
            });
        });
    };

    const redirectBack = function() {
        window.location.href = redirect_url || default_redirect_url();
    };

    return {
        init   : init,
        showTNC: showTNC,
    };
})();

module.exports = TNCApproval;
