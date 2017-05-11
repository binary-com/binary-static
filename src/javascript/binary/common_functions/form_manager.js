const Validation       = require('./form_validation');
const isEmptyObject    = require('../base/utility').isEmptyObject;
const showLoadingImage = require('../base/utility').showLoadingImage;
const BinarySocket     = require('../websocket_pages/socket');

const FormManager = (() => {
    'use strict';

    const forms = {};

    const initForm = (form_selector, fields) => {
        const $form = $(`${form_selector}:visible`);
        const $btn = $form.find('button[type="submit"]');
        if ($form.length) {
            forms[form_selector] = {
                $btn_submit: $btn,
                can_submit : true,
            };
            if (Array.isArray(fields) && fields.length) {
                forms[form_selector].fields = fields;

                fields.forEach((field) => {
                    if (field.selector) {
                        field.$ = $form.find(field.selector);
                        if (!field.$.length) return;
                    }

                    field.form = form_selector;
                });
            }
        }
        // handle firefox
        $btn.removeAttr('disabled');
        Validation.init(form_selector, fields);
    };

    const getFormData = (form_selector) => {
        const data = {};
        const fields = forms[form_selector].fields;
        if (!fields) return data;
        let key,
            $selector,
            val,
            value,
            native;

        fields.forEach((field) => {
            if (!field.exclude_request) {
                $selector = $(field.form).find(field.selector);
                if ($selector.is(':visible') || field.value) {
                    val = $selector.val();
                    key = field.request_field || field.selector;
                    native = $selector.attr('data-picker') === 'native';

                    // prioritise data-value
                    // if label, take the text
                    // if checkbox, take checked value
                    // otherwise take the value
                    value = field.value ? (typeof field.value === 'function' ? field.value() : field.value) :
                        native ? val : ($selector.attr('data-value') || (/lbl_/.test(key) ? (field.value || $selector.text()) :
                            $selector.is(':checkbox') ? ($selector.is(':checked') ? 1 : 0) :
                                Array.isArray(val) ? val.join(',') : (val || '')));

                    if (!(field.exclude_if_empty && val.length === 0)) {
                        key = key.replace(/lbl_|#|\./g, '');
                        if (field.parent_node) {
                            if (!data[field.parent_node]) {
                                data[field.parent_node] = {};
                            }
                            data[field.parent_node][key] = value;
                        } else {
                            data[key] = value;
                        }
                    }
                }
            }
        });
        return data;
    };

    const disableButton = ($btn) => {
        if ($btn.length && !$btn.find('.barspinner').length) {
            $btn.attr('disabled', 'disabled');
            const $btn_text = $('<span/>', { text: $btn.text(), class: 'invisible' });
            showLoadingImage($btn, 'white');
            $btn.append($btn_text);
        }
    };

    const enableButton = ($btn) => {
        if ($btn.length && $btn.find('.barspinner').length) {
            $btn.removeAttr('disabled').html($btn.find('span').text());
        }
    };

    const handleSubmit = (options) => {
        let form,
            $btn_submit,
            can_submit;

        const onSuccess = (response = {}) => {
            if (typeof options.fnc_response_handler === 'function') {
                if (options.enable_button || 'error' in response) {
                    enableButton($btn_submit);
                    form.can_submit = true;
                }
                options.fnc_response_handler(response);
            }
        };

        $(options.form_selector).off('submit').on('submit', (evt) => {
            evt.preventDefault();
            form = forms[options.form_selector];
            $btn_submit = form.$btn_submit;
            can_submit = form.can_submit;
            if (!can_submit) return;
            if (Validation.validate(options.form_selector)) {
                const req = $.extend({}, options.obj_request, getFormData(options.form_selector));
                if (typeof options.fnc_additional_check === 'function' && !options.fnc_additional_check(req)) {
                    return;
                }
                disableButton($btn_submit);
                form.can_submit = false;
                if (isEmptyObject(req)) {
                    onSuccess();
                } else {
                    BinarySocket.send(req).then((response) => {
                        onSuccess(response);
                    });
                }
            }
        });
    };

    return {
        init        : initForm,
        handleSubmit: handleSubmit,
    };
})();

module.exports = FormManager;
