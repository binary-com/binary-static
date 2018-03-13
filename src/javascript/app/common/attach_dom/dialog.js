const showPopup          = require('./popup');
const elementTextContent = require('../../../_common/common_functions').elementTextContent;
const urlFor             = require('../../../_common/url').urlFor;

const Dialog = (() => {
    const baseDialog = (options, is_alert = false) => (
        new Promise((resolve) => {
            showPopup({
                url               : urlFor('dialog'),
                popup_id          : options.id,
                form_id           : '#frm_confirm',
                content_id        : '#dialog_content',
                additionalFunction: (container) => {
                    const el_dialog     = container;
                    const el_btn_ok     = container.querySelector('#btn_ok');
                    const el_btn_cancel = container.querySelector('#btn_cancel');

                    if (!el_dialog) return;

                    elementTextContent(container.querySelector('#dialog_message'), options.message);

                    if (is_alert) {
                        el_btn_cancel.classList.add('invisible');
                    } else {
                        el_btn_cancel.addEventListener('click', () => {
                            el_dialog.remove();
                            if (typeof options.onAbort === 'function') {
                                options.onAbort();
                            }
                            resolve(false);
                        });
                    }

                    el_btn_ok.addEventListener('click', () => {
                        el_dialog.remove();
                        if (typeof options.onConfirm === 'function') {
                            options.onConfirm();
                        }
                        resolve(true);
                    });
                },
            });
        })
    );

    return {
        alert  : (options) => baseDialog(options, true),
        confirm: (options) => baseDialog(options),
    };
})();

module.exports = Dialog;