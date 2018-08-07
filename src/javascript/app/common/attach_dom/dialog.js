const showPopup        = require('./popup');
const elementInnerHtml = require('../../../_common/common_functions').elementInnerHtml;
const localize         = require('../../../_common/localize').localize;
const urlFor           = require('../../../_common/url').urlFor;

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

                    const message = Array.isArray(options.message) ? options.message.join('<p />') : options.message;
                    elementInnerHtml(container.querySelector('#dialog_message'), localize(message));

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

                    if (options.ok_text && el_btn_ok.firstElementChild) {
                        el_btn_ok.firstElementChild.textContent = options.ok_text;
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
