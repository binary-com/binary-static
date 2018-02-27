const showPopup          = require('./popup');
const elementTextContent = require('../../../_common/common_functions').elementTextContent;
const getElementById     = require('../../../_common/common_functions').getElementById;
const urlFor             = require('../../../_common/url').urlFor;

const confirmDialog = (options) => (
    new Promise((resolve) => {
        showPopup({
            url               : urlFor('user/confirm'),
            popup_id          : options.id,
            form_id           : '#frm_confirm',
            content_id        : '#confirm_dialog_content',
            additionalFunction: () => {
                const el_dialog     = getElementById(options.id);
                const el_btn_ok     = getElementById('btn_ok');
                const el_btn_cancel = getElementById('btn_cancel');

                elementTextContent(getElementById('confirm_dialog_text'), options.content);

                el_btn_cancel.addEventListener('click', () => {
                    if (el_dialog) {
                        el_dialog.remove();
                    }
                    if (typeof options.onAbort === 'function') {
                        options.onAbort();
                    }
                    resolve(false);

                });
                el_btn_ok.addEventListener('click', () => {
                    if (el_dialog) {
                        el_dialog.remove();
                    }
                    if (typeof options.onConfirm === 'function') {
                        options.onConfirm();
                    }
                    resolve(true);
                });
            },
        });
    })
);

module.exports = confirmDialog;