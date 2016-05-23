var TNCApproval = (function() {
    "use strict";

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

        BinarySocket.send({"get_settings"   : "1"});
        BinarySocket.send({"website_status" : "1"});

        $('#btn-accept').click(function(e) {
            e.preventDefault();
            e.stopPropagation();
            BinarySocket.send({"tnc_approval" : "1"});
        });
    };

    var showTNC = function() {
        if(!terms_conditions_version || !client_tnc_status) {
            return;
        }

        if(terms_conditions_version === client_tnc_status) {
            redirectBack();
            return;
        }

        $('#tnc-loading').addClass(hiddenClass);
        $('#tnc_image').attr('src', page.url.url_for_static('images/pages/cashier/protection-icon.svg'));
        $('#tnc_approval').removeClass(hiddenClass);
        $('#tnc-message').html(
            text.localize('[_1] has updated its [_2]. By clicking OK, you confirm that you have read and accepted the updated [_2].')
                .replace('[_1]', page.client.get_storage_value('landing_company_name'))
                .replace(/\[_2\]/g, $('<a/>', {class: 'pjaxload', href: page.url.url_for('terms-and-conditions'), text: text.localize('Terms & Conditions')}).prop('outerHTML'))
        );
        $('#btn-accept').text(text.localize('OK'));
    };

    var responseTNCApproval = function(response) {
        if(!response.hasOwnProperty('error')) {
            redirectBack();
        }
        else {
            $('#err_message').html(response.error.message).removeClass(hiddenClass);
        }
    };

    var redirectBack = function() {
        window.location.href = redirectUrl || page.url.url_for('trading');
    };

    var apiResponse = function(response) {
        isReal = !TUser.get().is_virtual;
        if(!isReal) {
            redirectBack();
        }

        switch(response.msg_type) {
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

    return {
        init : init,
        apiResponse : apiResponse
    };
}());



pjax_config_page_require_auth("tnc_approvalws", function() {
    return {
        onLoad: function() {
            BinarySocket.init({
                onmessage: function(msg) {
                    var response = JSON.parse(msg.data);
                    if (response) {
                        TNCApproval.apiResponse(response);
                    }
                }
            });

            Content.populate();
            TNCApproval.init();
        }
    };
});
