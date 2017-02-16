const showLoadingImage = require('../../base/utility').showLoadingImage;
const template         = require('../../base/utility').template;
const localize         = require('../../base/localize').localize;
const Client           = require('../../base/client').Client;
const url_for_static   = require('../../base/url').url_for_static;
const url_for          = require('../../base/url').url_for;
const default_redirect_url = require('../../base/url').default_redirect_url;
const Content          = require('../../common_functions/content').Content;

const TNCApproval = (function() {
    'use strict';

    let terms_conditions_version,
        client_tnc_status,
        hiddenClass,
        redirectUrl,
        isReal;


    const init = function() {
        hiddenClass = 'invisible';
        showLoadingImage($('#tnc-loading'));

        redirectUrl = sessionStorage.getItem('tnc_redirect');
        sessionStorage.removeItem('tnc_redirect');

        BinarySocket.send({ get_settings: '1' }, true);
        BinarySocket.send({ website_status: '1' });

        $('#btn-accept').click(function(e) {
            e.preventDefault();
            e.stopPropagation();
            BinarySocket.send({ tnc_approval: '1' });
        });
    };

    const showTNC = function() {
        if (!terms_conditions_version || !client_tnc_status || !Client.get('landing_company_fullname')) {
            return;
        }

        if (terms_conditions_version === client_tnc_status) {
            redirectBack();
            return;
        }

        $('#tnc-loading').addClass(hiddenClass);
        $('#tnc_image').attr('src', url_for_static('images/pages/cashier/protection-icon.svg'));
        $('#tnc_approval').removeClass(hiddenClass);
        const $tnc_msg = $('#tnc-message');
        const tnc_message = template($tnc_msg.html(), [
            Client.get('landing_company_fullname'),
            Client.get('residence') === 'jp' ?
            url_for('terms-and-conditions-jp') :
            url_for('terms-and-conditions'),
        ]);
        $tnc_msg.html(tnc_message).removeClass(hiddenClass);
        $('#btn-accept').text(localize('OK'));
    };

    const responseTNCApproval = function(response) {
        if (!response.hasOwnProperty('error')) {
            sessionStorage.setItem('check_tnc', 'checked');
            redirectBack();
        } else {
            $('#err_message').html(response.error.message).removeClass(hiddenClass);
        }
    };

    const redirectBack = function() {
        window.location.href = redirectUrl || default_redirect_url();
    };

    const apiResponse = function(response) {
        isReal = !Client.get('is_virtual');
        if (!isReal) {
            redirectBack();
        }

        switch (response.msg_type) {
            case 'website_status':
                terms_conditions_version = response.website_status.terms_conditions_version;
                showTNC();
                break;
            case 'get_settings':
                client_tnc_status = response.get_settings.client_tnc_status || '-';
                showTNC();
                break;
            case 'tnc_approval':
                responseTNCApproval(response);
                break;
            default:
                break;
        }
    };

    const onLoad = function() {
        BinarySocket.init({
            onmessage: function(msg) {
                const response = JSON.parse(msg.data);
                if (response) {
                    apiResponse(response);
                }
            },
        });

        Content.populate();
        TNCApproval.init();
    };

    return {
        init   : init,
        showTNC: showTNC,
        onLoad : onLoad,
    };
})();

module.exports = {
    TNCApproval: TNCApproval,
};
