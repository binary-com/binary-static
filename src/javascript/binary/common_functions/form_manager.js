const Validation = require('./form_validation');

const FormManager = (function() {
    'use strict';

    const forms = {};

    const initForm = (form_selector, fields) => {
        const $form = $(`${form_selector}:visible`);
        if ($form.length && Array.isArray(fields) && fields.length) {
            forms[form_selector] = { fields: fields };
            fields.forEach((field) => {
                if (field.selector) {
                    field.$ = $form.find(field.selector);
                    if (!field.$.length) return;
                }

                field.form = form_selector;
            });
        }
        Validation.init(form_selector, fields);
    };

    const getFormData = (form_selector) => {
        const data = {};
        const fields = forms[form_selector].fields;
        let selector,
            $selector,
            current_field,
            val;

        Object.keys(fields).forEach(function(field) {
            current_field = fields[field];
            if (!current_field.exclude_request) {
                $selector = $(current_field.form).find(current_field.selector);
                if ($selector.is(':visible') || current_field.value) {
                    val = $selector.val();
                    selector = current_field.request_field || current_field.selector;

                    // prioritise data-value
                    // if label, take the text
                    // if checkbox, take checked value
                    // otherwise take the value
                    data[selector.replace(/lbl_|#|\./g, '')] =
                        current_field.value ? current_field.value :
                            $selector.attr('data-value') || (/lbl_/.test(selector) ? (current_field.value || $selector.text()) :
                                $selector.is(':checkbox') ? ($selector.is(':checked') ? 1 : 0) :
                                    Array.isArray(val) ? val.join(',') : (val || ''));
                }
            }
        });
        return data;
    };

    const handleSubmit = (form_selector, obj_request, fnc_response_handler, fnc_additional_check) => {
        $(form_selector).off('submit').on('submit', function(evt) {
            evt.preventDefault();
            if (Validation.validate(form_selector)) {
                const req = $.extend(obj_request, getFormData(form_selector));
                if (fnc_additional_check && typeof fnc_additional_check === 'function' && !fnc_additional_check(req)) {
                    return;
                }
                BinarySocket.send(req).then((response) => {
                    if (typeof fnc_response_handler === 'function') {
                        fnc_response_handler(response);
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
