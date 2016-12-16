var showLoadingImage = require('../../base/utility').showLoadingImage;
var template         = require('../../base/utility').template;
var Content          = require('../../common_functions/content').Content;
var text = require('../../base/localize').text;

var TNCApproval = (function() {
    'use strict';

    var terms_conditions_version,
        client_tnc_status,
        hiddenClass,
        redirectUrl,
        isReal;


    var init = function() {
        hiddenClass = 'invisible';
        showLoadingImage($('#tnc-loading'));

        redirectUrl = sessionStorage.getItem('tnc_redirect');
        sessionStorage.removeItem('tnc_redirect');

        BinarySocket.send({ get_settings: '1' });
        BinarySocket.send({ website_status: '1' });

        $('#btn-accept').click(function(e) {
            e.preventDefault();
            e.stopPropagation();
            BinarySocket.send({ tnc_approval: '1' });
        });
    };

    var showTNC = function() {
        if (!terms_conditions_version || !client_tnc_status || !page.client.get_storage_value('landing_company_name')) {
            return;
        }

        if (terms_conditions_version === client_tnc_status) {
            redirectBack();
            return;
        }

        $('#tnc-loading').addClass(hiddenClass);
        $('#tnc_image').attr('src', page.url.url_for_static('images/pages/cashier/protection-icon.svg'));
        $('#tnc_approval').removeClass(hiddenClass);
        var tnc_message = template($('#tnc-message').html(), [
            page.client.get_storage_value('landing_company_name'),
            page.client.residence === 'jp' ?
            page.url.url_for('terms-and-conditions-jp') :
            page.url.url_for('terms-and-conditions'),
        ]);
        $('#tnc-message').html(tnc_message).removeClass(hiddenClass);
        $('#btn-accept').text(text.localize('OK'));
    };

    var responseTNCApproval = function(response) {
        if (!response.hasOwnProperty('error')) {
            sessionStorage.setItem('check_tnc', (sessionStorage.getItem('check_tnc') || '').split(page.client.loginid).join());
            redirectBack();
        } else {
            $('#err_message').html(response.error.message).removeClass(hiddenClass);
        }
    };

    var redirectBack = function() {
        window.location.href = redirectUrl || page.url.default_redirect_url();
    };

    var apiResponse = function(response) {
        isReal = !TUser.get().is_virtual;
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

    var onLoad = function() {
        BinarySocket.init({
            onmessage: function(msg) {
                var response = JSON.parse(msg.data);
                if (response) {
                    TNCApproval.apiResponse(response);
                }
            },
        });

        Content.populate();
        TNCApproval.init();
    };

    return {
        init       : init,
        apiResponse: apiResponse,
        showTNC    : showTNC,
        onLoad     : onLoad,
    };
})();

module.exports = {
    TNCApproval: TNCApproval,
};
