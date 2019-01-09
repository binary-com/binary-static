const BinaryPjax     = require('../../../../base/binary_pjax');
const Client         = require('../../../../base/client');
const BinarySocket   = require('../../../../base/socket');
const showPopup      = require('../../../../common/attach_dom/popup');
const getElementById = require('../../../../../_common/common_functions').getElementById;
const urlFor         = require('../../../../../_common/url').urlFor;

const TopUpVirtualPopup = (() => {
    const onLoad = () => {
        BinarySocket.wait('balance').then((response) => {
            if (+response.balance.balance < 1000 && !Client.get('hide_top_up')) {
                const form_id   = '#frm_confirm';
                const popup_id  = 'top_up_virtual_pop_up';
                const popup_url = urlFor('user/top_up_virtual_pop_up');
                showPopup({
                    form_id,
                    popup_id,
                    url               : popup_url,
                    content_id        : '#top_up',
                    additionalFunction: () => {
                        const el_cancel = getElementById('cancel');
                        const el_popup  = getElementById(popup_id);
                        el_cancel.addEventListener('click', () => {
                            if (el_popup) {
                                el_popup.remove();
                            }
                        });
                        const el_chk_hide_top_up = getElementById('chk_hide_top_up');
                        el_chk_hide_top_up.addEventListener('click', () => {
                            if (el_chk_hide_top_up.checked) {
                                Client.set('hide_top_up', 1);
                            } else {
                                Client.set('hide_top_up', 0);
                            }
                        });
                    },
                    onAccept: () => {
                        BinarySocket.send({ topup_virtual: '1' }).then((response_top_up) => {
                            const el_popup = getElementById(popup_id);
                            if (el_popup) {
                                el_popup.remove();
                            }
                            if (response_top_up.error) {
                                showPopup({
                                    form_id,
                                    popup_id,
                                    url               : popup_url,
                                    content_id        : '#top_up_error',
                                    additionalFunction: () => {
                                        getElementById('top_up_error_message').textContent = response_top_up.error.message;
                                    },
                                });
                            } else {
                                showPopup({
                                    form_id,
                                    popup_id,
                                    url               : popup_url,
                                    content_id        : '#top_up_success',
                                    additionalFunction: () => {
                                        getElementById('client_loginid').textContent = Client.get('loginid');
                                        const el_redirect  = getElementById('statement_redirect');
                                        const el_new_popup = getElementById(popup_id);
                                        el_redirect.addEventListener('click', () => {
                                            if (el_new_popup) {
                                                el_new_popup.remove();
                                            }
                                            BinaryPjax.load(urlFor('user/statementws'));
                                        });
                                    },
                                });
                            }
                        });
                    },
                });
            }
        });
    };

    return {
        onLoad,
    };
})();

module.exports = TopUpVirtualPopup;
