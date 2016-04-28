var client_form;
onLoad.queue(function() {
    client_form = new ClientForm({valid_loginids: page.settings.get('valid_loginids')});
});
