const Client       = require('../../../base/client');
const BinarySocket = require('../../socket');

const Authenticate = (() => {
    const onLoad = () => {
        BinarySocket.send({ get_account_status: 1 }).then((response) => {
            if (response.error) {
                $('#error_message').setVisibility(1).text(response.error.message);
            } else {
                const get_account_status = response.get_account_status;
                const should_authenticate = +get_account_status.prompt_client_to_authenticate;
                if (should_authenticate) {
                    const status = get_account_status.status;
                    if (!/authenticated/.test(status)) {
                        $(`#not_authenticated${Client.isAccountOfType('financial') ? '_financial' : ''}`).setVisibility(1);
                        init();
                    } else if (!/age_verification/.test(status)) {
                        $('#needs_age_verification').setVisibility(1);
                    }
                } else {
                    $('#fully_authenticated').setVisibility(1);
                }
            }
        });
    };

    const init = () => {
        // Setup accordion
        $(".files").accordion({
            heightStyle: 'content',
            collapsible: true,
            active: false
        });
        // Setup Date picker
        const date = new Date();
        $('.date-picker').datepicker({
            dateFormat: 'yy-mm-dd',
            changeMonth: true,
            changeYear: true,
            minDate: date,
        });

        $('.file-picker').on('change', (event) => {
            if (!event.target.files) return;
            const file_name = event.target.files[0].name || '';
            const display_name = file_name.slice(0, 5) + '..' + file_name.slice(-5);
            $(event.target).parent().find('label').html(display_name)
                .append($('<img/>', { class: 'remove' }))
                .find('.remove').click((e) => {
                    const default_text = event.target.id.split('_')[0]
                        .replace(/^\w/, w => w.toUpperCase());
                    $(event.target).val('') // Remove previously selected file.
                    $(event.target).parent().find('label').html(default_text)
                        .append($('<img/>', { class: 'add' }))
                });
        });
    };

    return {
        onLoad,
    };
})();

module.exports = Authenticate;
