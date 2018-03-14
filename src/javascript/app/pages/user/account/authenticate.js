const DocumentUploader    = require('binary-document-uploader');
const Client              = require('../../../base/client');
const displayNotification = require('../../../base/header').displayNotification;
const BinarySocket        = require('../../../base/socket');
const localize            = require('../../../../_common/localize').localize;
const toTitleCase         = require('../../../../_common/string_util').toTitleCase;
const Url                 = require('../../../../_common/url');
const showLoadingImage    = require('../../../../_common/utility').showLoadingImage;

const Authenticate = (() => {
    const onLoad = () => {
        BinarySocket.send({ get_account_status: 1 }).then((response) => {
            if (response.error) {
                $('#error_message').setVisibility(1).text(response.error.message);
            } else {
                const status = response.get_account_status.status;
                if (!/authenticated/.test(status)) {
                    init();
                    const $not_authenticated = $('#not_authenticated').setVisibility(1);
                    let link = 'https://marketing.binary.com/authentication/2017_Authentication_Process.pdf';
                    if (Client.isAccountOfType('financial')) {
                        $('#not_authenticated_financial').setVisibility(1);
                        link = 'https://marketing.binary.com/authentication/2017_MF_Authentication_Process.pdf';
                    }
                    $not_authenticated.find('.learn_more').setVisibility(1).find('a').attr('href', link);
                } else if (!/age_verification/.test(status)) {
                    $('#needs_age_verification').setVisibility(1);
                } else {
                    $('#fully_authenticated').setVisibility(1);
                }
            }
        });
    };

    const init = () => {
        // Setup accordion
        $('.files').accordion({
            heightStyle: 'content',
            collapsible: true,
            active     : false,
        });
        // Setup Date picker
        const file_checks = {};
        $('.date-picker').datepicker({
            dateFormat : 'yy-mm-dd',
            changeMonth: true,
            changeYear : true,
            minDate    : '+6m',
        });

        $('.file-picker').on('change', onFileSelected);

        /**
         * Listens for file changes.
         * @param {*} event
         */
        function onFileSelected (event) {
            if (!event.target.files || !event.target.files.length) {
                resetLabel(event);
                return;
            }
            // Change submit button state
            showSubmit();
            const $e = $(event.target);
            const file_name = event.target.files[0].name || '';
            const display_name = file_name.length > 10 ? `${file_name.slice(0, 5)}..${file_name.slice(-5)}` : file_name;

            // Keep track of front and back sides of files.
            const doc_type = ($e.attr('data-type') || '').replace(/\s/g, '_').toLowerCase();
            const file_type = ($e.attr('id').match(/\D+/g) || [])[0];
            file_checks[doc_type] = file_checks[doc_type] || {};
            file_checks[doc_type][file_type] = true;

            $e.parent()
                .find('label')
                .off('click')
                // Prevent opening file selector.
                .on('click', (e) => {
                    if ($(e.target).is('span.remove')) e.preventDefault();
                })
                .text(display_name)
                .append($('<span/>', { class: 'remove' }))
                .find('.remove')
                .click(() => resetLabel(event));
        };

        // Reset file-selector label
        const resetLabel = (event) => {
            const $e = $(event.target);
            let default_text = toTitleCase($e.attr('id').split('_')[0]);
            default_text = default_text === 'Back' ? localize('Reverse Side')
                : localize('Front Side');
            // Keep track of front and back sides of files.
            const doc_type = ($e.attr('data-type') || '').replace(/\s/g, '_').toLowerCase();
            const file_type = ($e.attr('id').match(/\D+/g) || [])[0];
            file_checks[doc_type][file_type] = false;
            // Remove previously selected file and set the label
            $e.val('').parent().find('label').text(default_text)
                .append($('<span/>', { class: 'add' }));
            // Change submit button state
            showSubmit();
        };

        /**
         * Enables the submit button if any file is selected, also adds the event handler for the button.
         * Disables the button if it no files are selected.
         */
        let $button;
        const showSubmit = () => {
            let file_selected = false;
            const $ele = $('#authentication-message > div#not_authenticated');
            $button = $ele.find('#btn_submit');
            const $files = $ele.find('input[type="file"]');

            // Check if any files are selected or not.
            $files.each((i, e) => {
                if (e.files && e.files.length) {
                    file_selected = true;
                }
            });

            if (file_selected) {
                if ($button.hasClass('button')) return;
                $button.removeClass('button-disabled')
                    .addClass('button')
                    .off('click') // To avoid binding multiple click events
                    .click(() => submitFiles($files));
            } else {
                if ($button.hasClass('button-disabled')) return;
                $button.removeClass('button')
                    .addClass('button-disabled')
                    .off('click');
            }
        };

        const disableButton = () => {
            if ($button.length && !$button.find('.barspinner').length) {
                const $btn_text = $('<span/>', { text: $button.find('span').text(), class: 'invisible' });
                showLoadingImage($button.find('span'), 'white');
                $button.find('span').append($btn_text);
            }
        };

        const enableButton = () => {
            if ($button.length && $button.find('.barspinner').length) {
                $button.find('>span').html($button.find('>span>span').text());
            }
        };

        /**
         * On submit button click
         */
        const submitFiles = ($files) => {
            // Disable submit button
            disableButton();
            const files = [];
            $files.each((i, e) => {
                if (e.files && e.files.length) {
                    const $e = $(e);
                    const type = `${($e.attr('data-type') || '').replace(/\s/g, '_').toLowerCase()}`;
                    const $inputs = $e.closest('.fields').find('input[type="text"]');
                    const file_obj = {
                        file: e.files[0],
                        type,
                    };
                    if ($inputs.length) {
                        file_obj.id_number = $($inputs[0]).val();
                        file_obj.exp_date = $($inputs[1]).val();
                    }
                    files.push(file_obj);
                }
            });
            processFiles(files);
        };

        const processFiles = (files) => {
            const promises = [];
            const uploader = new DocumentUploader({ connection: BinarySocket.get() });

            readFiles(files).then((objects) => {
                objects.forEach(obj => promises.push(uploader.upload(obj)));
                Promise.all(promises)
                    .then(() => showSuccess())
                    .catch(showError);
            }).catch(showError);
        };

        // Returns file promise.
        const readFiles = (files) => {
            const promises = [];
            files.forEach((f) => {
                const fr = new FileReader();
                const promise = new Promise((resolve, reject) => {
                    fr.onload = () => {
                        const format = (f.file.type.split('/')[1] || (f.file.name.match(/\.([\w\d]+)$/) || [])[1] || '').toUpperCase();
                        const obj = {
                            filename      : f.file.name,
                            buffer        : fr.result,
                            documentType  : f.type,
                            documentFormat: format,
                            documentId    : f.id_number || undefined,
                            expirationDate: f.exp_date || undefined,
                        };

                        const error = { message: validate(obj) };
                        if (error && error.message) reject(error);

                        resolve(obj);
                    };

                    fr.onerror = () => {
                        reject(`Unable to read file ${f.file.name}`);
                    };
                    // Reading file.
                    fr.readAsArrayBuffer(f.file);
                });

                promises.push(promise);
            });

            return Promise.all(promises);
        };

        // Validate user input
        const validate = (file) => {
            const required_docs = ['passport', 'proofid', 'driverslicense'];
            const doc_name = {
                passport      : localize('Passport'),
                proofid       : localize('Identity card'),
                driverslicense: localize('Driving licence'),
            };

            if (!(file.documentFormat || '').match(/^(PNG|JPG|JPEG|GIF|PDF)$/i)) {
                return localize('Invalid document format: "[_1]"', [file.documentFormat]);
            }
            if (file.buffer && file.buffer.byteLength >= 3 * 1024 * 1024) {
                return localize('File ([_1]) size exceeds the permitted limit. Maximum allowed file size: 3MB', [file.filename]);
            }
            if (!file.documentId && required_docs.indexOf(file.documentType.toLowerCase()) !== -1)  {
                return localize('ID number is required for [_1].', [doc_name[file.documentType]]);
            }
            if (file.documentId && !/^[\w\s-]{0,30}$/.test(file.documentId)) {
                return localize('Only letters, numbers, space, underscore, and hyphen are allowed for ID number ([_1]).', [doc_name[file.documentType]]);
            }
            if (!file.expirationDate && required_docs.indexOf(file.documentType.toLowerCase()) !== -1) {
                return localize('Expiry date is required for [_1].', [doc_name[file.documentType]]);
            }
            if (file_checks.proofid && (file_checks.proofid.front_file ^ file_checks.proofid.back_file)) { // eslint-disable-line no-bitwise
                return localize('Front and reverse side photos of [_1] are required.', [doc_name.proofid]);
            }
            if (file_checks.driverslicense &&
                (file_checks.driverslicense.front_file ^ file_checks.driverslicense.back_file)) { // eslint-disable-line no-bitwise
                return localize('Front and reverse side photos of [_1] are required.', [doc_name.driverslicense]);
            }
            return null;
        };

        const showError = (e) => {
            const $error = $('.error-msg');
            const message = e.message || e.message_to_client;
            enableButton();
            $error.setVisibility(1).text(message);
            setTimeout(() => { $error.empty().setVisibility(0); }, 3000);
        };

        const showSuccess = () => {
            const msg = localize('We are reviewing your documents. For more details [_1]contact us[_2].',
                [`<a href="${Url.urlFor('contact')}">`, '</a>']);
            displayNotification(msg, false, 'document_under_review');
            $('#not_authenticated, #not_authenticated_financial').setVisibility(0); // Just hide it
            $('#success-message').setVisibility(1);
        };
    };

    return {
        onLoad,
    };
})();

module.exports = Authenticate;
