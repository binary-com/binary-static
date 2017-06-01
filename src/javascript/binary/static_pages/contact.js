const DeskWidget = require('../common_functions/attach_dom/desk_widget');

const Contact = (() => {
    'use strict';

    const onLoad = () => {
        displayCsContacts();
        DeskWidget.showDeskLink('style', '#contact_content');
    };

    const displayCsContacts = () => {
        $('.contact-content').on('change', '#cs_telephone_number', function() {
            const val = $(this).val().split(',');
            $('#display_cs_telephone').html(val[0] + (val.length > 1 ? `<br />${val[1]}` : ''));
        });
    };

    return {
        onLoad: onLoad,
    };
})();

module.exports = Contact;
