const showPopup        = require('./popup');
const elementInnerHtml = require('../../../_common/common_functions').elementInnerHtml;
const urlFor           = require('../../../_common/url').urlFor;

// use this function if you need a simple popup with just a confirm or also a cancel button
// if you need to show a form with some validations, use showPopup() instead
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
                    const el_title      = container.querySelector('#dialog_title');
                    const el_footnote   = container.querySelector('#dialog_footnote');

                    if (!el_dialog) return;

                    // Used for setting the dialog title, message, and footnote
                    const setMessage = (option_item, $selector) => {
                        const item = Array.isArray(options[option_item]) ? options[option_item].join('<p />') : options[option_item];
                        elementInnerHtml(container.querySelector($selector), item);
                    };

                    // Set title if `localized_title` field in `options` param exists
                    if (options.localized_title && el_title) {
                        el_title.setVisibility(1);
                        setMessage('localized_title', '#dialog_title');
                    }

                    // Set dialog message
                    setMessage('localized_message', '#dialog_message');

                    // Set footnote if `localized_footnote` field in `options` param exists
                    if (options.localized_footnote && el_footnote) {
                        el_footnote.setVisibility(1);
                        setMessage('localized_footnote', '#dialog_footnote');
                    }

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

                    if (options.cancel_text && el_btn_cancel.firstElementChild) {
                        el_btn_cancel.firstElementChild.textContent = options.cancel_text;
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
