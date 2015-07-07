//// togglePromoCodeTnC ////////////////////////////////////////////
//
// triggered when the promocode field on the account opening form
// loses focus. If a promocode is entered, additional T&C will be
// shown, and the Client will have to agree to them when opening
// the account.
//
////////////////////////////////////////////////////////////////////
var togglePromoCodeTnC = function(event)
{
    var o = $(event.target);

    if (o.val() !== '')
    {
        $('#formlayout').find('#comment').find('span').removeClass('invisible');
    }
    else
    {
        $('#formlayout').find('#comment').find('span').addClass('invisible');
    }
};

var client_form;
onLoad.queue(function() {
        client_form = new ClientForm({restricted_countries: page.settings.get('restricted_countries'), valid_loginids: page.settings.get('valid_loginids')});
});

$(function() {
    onLoad.queue_if_id_present(function () {
        $('#promotionalcode').blur(togglePromoCodeTnC);
        client_form.on_residence_change();
        select_user_country();
        if(page.client.is_logged_in) {
            client_form.set_virtual_login_id(page.client.loginid);
            client_form.set_virtual_email_id(page.client.email);
        }
    },'openAccForm');
});
