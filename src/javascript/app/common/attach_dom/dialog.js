const showPopup          = require('./popup');
const elementTextContent = require('../../../_common/common_functions').elementTextContent;
const getElementById     = require('../../../_common/common_functions').getElementById;
const urlFor             = require('../../../_common/url').urlFor;

const alert = (options) => (
    new Promise((resolve) => {
        showPopup({
            url               : urlFor('dialog'),
            popup_id          : options.id,
            form_id           : '#frm_confirm',
            content_id        : '#dialog_content',
            additionalFunction: () => {
                const el_dialog = getElementById(options.id);
                const el_btn_ok = getElementById('btn_ok');

                elementTextContent(getElementById('dialog_message'), options.message);

                getElementById('btn_cancel').classList.add('invisible');

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

const confirm = (options) => (
    new Promise((resolve) => {
        showPopup({
            url               : urlFor('dialog'),
            popup_id          : options.id,
            form_id           : '#frm_confirm',
            content_id        : '#dialog_content',
            additionalFunction: () => {
                const el_dialog = getElementById(options.id);
                const el_btn_ok = getElementById('btn_ok');
                const el_btn_cancel = getElementById('btn_cancel');

                elementTextContent(getElementById('dialog_message'), options.message);

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

module.exports = {
    alert,
    confirm,
};