const Validation       = require('./form_validation');
const showLoadingImage = require('../base/utility').showLoadingImage;

const FormManager = (function() {
    'use strict';

    const forms = {};

    const initForm = (form_selector, fields) => {
        const $form = $(`${form_selector}:visible`);
        const $btn = $form.find('button[type="submit"]');
        if ($form.length && Array.isArray(fields) && fields.length) {
            forms[form_selector] = {
                fields     : fields,
                $btn_submit: $btn,
                can_submit : true,
            };
            fields.forEach((field) => {
                if (field.selector) {
                    field.$ = $form.find(field.selector);
                    if (!field.$.length) return;
                }

                field.form = form_selector;
            });
        }
        // handle firefox
        $btn.removeAttr('disabled');
        Validation.init(form_selector, fields);
    };

    const getFormData = (form_selector) => {
        const data = {};
        const fields = forms[form_selector].fields;
        let key,
            $selector,
            current_field,
            val,
            value;

        Object.keys(fields).forEach(function(field) {
            current_field = fields[field];
            if (!current_field.exclude_request) {
                $selector = $(current_field.form).find(current_field.selector);
                if ($selector.is(':visible') || current_field.value) {
                    val = $selector.val();
                    key = current_field.request_field || current_field.selector;

                    // prioritise data-value
                    // if label, take the text
                    // if checkbox, take checked value
                    // otherwise take the value
                    value = current_field.value ? (typeof current_field.value === 'function' ? current_field.value() : current_field.value) :
                        $selector.attr('data-value') || (/lbl_/.test(key) ? (current_field.value || $selector.text()) :
                            $selector.is(':checkbox') ? ($selector.is(':checked') ? 1 : 0) :
                                Array.isArray(val) ? val.join(',') : (val || ''));

                    key = key.replace(/lbl_|#|\./g, '');
                    if (current_field.parent_node) {
                        if (!data[current_field.parent_node]) {
                            data[current_field.parent_node] = {};
                        }
                        data[current_field.parent_node][key] = value;
                    } else {
                        data[key] = value;
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
        $(options.form_selector).off('submit').on('submit', function(evt) {
            evt.preventDefault();
            const form = forms[options.form_selector];
            const $btn_submit = form.$btn_submit;
            const can_submit = form.can_submit;
            if (!can_submit) return;
            if (Validation.validate(options.form_selector)) {
                const req = $.extend(options.obj_request || {}, getFormData(options.form_selector));
                if (typeof options.fnc_additional_check === 'function' && !options.fnc_additional_check(req)) {
                    return;
                }
                disableButton($btn_submit);
                form.can_submit = false;
                BinarySocket.send(req).then((response) => {
                    if (typeof options.fnc_response_handler === 'function') {
                        if (options.enable_button || 'error' in response) {
                            enableButton($btn_submit);
                            form.can_submit = true;
                        }
                        options.fnc_response_handler(response);
                    }
                });
            }
        });
    };

    return {
        init        : initForm,
        handleSubmit: handleSubmit,
    };
})();

module.exports = FormManager;
