const BinaryPjax   = require('../../base/binary_pjax');
const Client       = require('../../base/client');
const Validation   = require('../../common/form_validation');
const paramsHash   = require('../../../_common/url').paramsHash;

const BitcoinVoucher = (() => {
    const form_selector = '#mainform123';
    let $container;

    const onLoad = () => {
        if (Client.get('residence') !== 'id') {
            BinaryPjax.loadPreviousUrl();
            return;
        }

        $container = $('#voucher_container').setVisibility(1);
        const show_success_message = paramsHash(window.location.href).success === 'true';
        $container.find(show_success_message ? '#message_container' : '#form_container').setVisibility(1);
        if (show_success_message) return;

        const login_id = Client.get('loginid');
        $container.find('#id123-control36043376').val(login_id);
        $container.find('#lbl_loginid').text(login_id);

        const email   = Client.get('email');
        $container.find('#id123-control36043400').val(email);
        $container.find('#lbl_email').text(email);

        Validation.init(form_selector, [
            { selector: '#id123-control36043409', validations: ['req', ['number', { type: 'float', min: 50, decimals: 2 }]] },
        ]);

        $container.find('#form_container button').on('click', (e) => {
            if (!Validation.validate(form_selector)) e.preventDefault();
        });
    };

    return {
        onLoad,
    };
})();

module.exports = BitcoinVoucher;
