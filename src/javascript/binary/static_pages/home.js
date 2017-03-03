const BinaryPjax      = require('../base/binary_pjax');
const localize        = require('../base/localize').localize;
const url_for         = require('../base/url').url_for;
const FormManager     = require('../common_functions/form_manager');

const Home = (() => {
    'use strict';

    let clients_country;

    const onLoad = () => {
        BinarySocket.wait('website_status').then((response) => {
            clients_country = response.website_status.clients_country;
            const form_id = '#frm_verify_email';

            $('#start_now').click(() => {
                $.scrollTo($(form_id), 500, { offset: -10 });
            });

            FormManager.init(form_id, [
                { selector: '#email', validations: ['req', 'email'], request_field: 'verify_email' },
                { request_field: 'type', value: 'account_opening' },
            ]);

            FormManager.handleSubmit(form_id, {}, handler, checkCountry);
        });
    };

    const checkCountry = (req) => {
        if ((clients_country !== 'my') || /@binary\.com$/.test(req.verify_email)) {
            return true;
        }
        $('#frm_verify_email').find('div')
            .html($('<p/>', { class: 'notice-msg center-text', html: localize('Sorry, account signup is not available in your country. Please contact <a href="[_1]">customer support</a> for more information.', [url_for('contact')]) }));
        return false;
    };


    const handler = (response) => {
        const error = response.error;
        if (!error) {
            BinaryPjax.load('new_account/virtualws');
        } else {
            $('#signup_error').css({ display: 'inline-block' }).text(error.message);
        }
    };


    return {
        onLoad: onLoad,
    };
})();

module.exports = Home;
