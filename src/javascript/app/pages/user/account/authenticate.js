const DocumentUploader    = require('binary-document-uploader');
const Client              = require('../../../base/client');
const displayNotification = require('../../../base/header').displayNotification;
const BinarySocket        = require('../../../base/socket');
const jpClient            = require('../../../common/country_base').jpClient;
const localize            = require('../../../../_common/localize').localize;
const Url                 = require('../../../../_common/url');
const showLoadingImage    = require('../../../../_common/utility').showLoadingImage;

const Authenticate = (() => {
    let needs_action = false;

    const onLoad = () => {
        BinarySocket.send({ get_account_status: 1 }).then((response) => {
            if (response.error) {
                $('#error_message').setVisibility(1).text(response.error.message);
            } else {
                const status = response.get_account_status.status;
                needs_action = /document_needs_action/.test(response.get_account_status.status);
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
        const file_checks = {};
        // Setup Date picker
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
            const display_name = file_name.length > 20 ? `${file_name.slice(0, 10)}...${file_name.slice(-10)}` : file_name;

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
            fileTracker($e, false);
            const default_text = $e.attr('data-placeholder');
            $e.val('').parent().find('label').text(default_text)
                .append($('<span/>', { class: 'add' }));
            // Change submit button state
            showSubmit();
        };

        /**
         * Enables the submit button if any file is selected, also adds the event handler for the button.
         * Disables the button if no files are selected.
         */
        let $button;
        const showSubmit = () => {
            let file_selected = false;
            const $ele = $('#authentication-message > div#not_authenticated');
            $button = $ele.find('#btn_submit');
            const $files = $ele.find('input[type="file"]');

            // Check if any files are selected
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
                    const [, id] = ($e.attr('id').match(/([a-z\d]+)_(\d)/) || []);
                    const name = $e.attr('data-name');
                    const $inputs = $e.closest('.fields').find('input[type="text"]');
                    const file_obj = {
                        file: e.files[0],
                        type,
                        id,
                        name,
                    };
                    if ($inputs.length) {
                        file_obj.id_number = $($inputs[0]).val();
                        file_obj.exp_date = $($inputs[1]).val();
                    }
                    fileTracker($e, true);
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
                    .then(onResponse)
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
                            passthrough   : {
                                filename: f.file.name,
                                name    : f.name,
                            },
                        };

                        const error = { message: validate(Object.assign(obj, {id: f.id})) };
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

        const fileTracker = ($ele, selected) => {
            const [, id, pos]       = ($ele.attr('id').match(/([a-z\d]+)_(\d)/) || []);
            // Keep track of front and back sides of files.
            if (selected) {
                file_checks[id]            = file_checks[id] || {};
                file_checks[id].files      = file_checks[id].files || [];
                file_checks[id].files[pos] = true;
                file_checks[id].type      = $ele.attr('accept');
                file_checks[id].label     = $ele.attr('data-name');
            } else {
                file_checks[id].files[pos] = false;
            }
        };

        // Validate user input
        const validate = (file) => {
            // Add error messages here. Error messages are mapped by index to checks.
            const error_messages = [
                localize('Invalid document format: "[_1]" for [_2]', [file.documentFormat, file_checks[file.id].label]),
                localize('File ([_1]) size exceeds the permitted limit. Maximum allowed file size: 3MB', [file_checks[file.id].label]),
                localize('ID number is required for [_1].', [file_checks[file.id].label]),
                localize('Only letters, numbers, space, underscore, and hyphen are allowed for ID number ([_1]).', [file_checks[file.id].label]),
                localize('Expiry date is required for [_1].', [file_checks[file.id].label]),
                localize('Front and reverse side photos of [_1] are required.', [file_checks[file.id].label]),
                // Japan Error message
                // localize('{JAPAN ONLY}My number card is required.'),
                localize('{JAPAN ONLY}Please select at least one file from section 1 or two different file types from section 2.'),
                localize('{JAPAN ONLY}One of [_1] or [_2] is required.', [localize('Medical insurance card'), localize('Pension book')]),
                localize('{JAPAN ONLY}One of [_1], [_2] or [_3] is required.', [localize('Resident records'),
                    localize('Registered seal certificate'), localize('Utility bill')]),
            ];
            const [format, file_size, id, id_format, expiry, proofid,multiple_side_file_check,
                // Japan validations
                other_files, section_2_0_check, section_2_1_check,
            ] = validations(file);
            let message = '';

            [format, file_size, id, id_format, expiry, proofid, multiple_side_file_check,
                // Japan validations
                other_files, section_2_0_check, section_2_1_check,
            ].forEach((e,i) => {
                if (e) message+=`${error_messages[i]}<br />`;
            });

            return message;
        };

        // Add validations here.
        function* validations (file) {
            const isJp = jpClient();
            const required_docs = ['passport', 'proofid', 'driverslicense'];
            // Check if both front and back sides are selected for following file ids.
            const multiple_side_file_ids = ['proofid', 'driverslicense', 'residencecard'];
            // Japan Only
            // check if one of the following files is selected.
            const jp_section_1   = ['driverslicense', 'residencecard', 'mynumberphotocard1'];
            const jp_section_2_0 = ['insurancecard', 'pensionbook'];
            const jp_section_2_1 = ['residentrecords', 'sealcertificate', 'utilitybill'];
            const noneOfthese = (...args) => (args.reduce(
                (a,b) => a && !(file_checks[b] && file_checks[b].files[0]), true));
            // Document format check
            yield file_checks[file.id].type.indexOf(file.documentFormat.toLowerCase()) === -1;
            // File size check. Max 3MB
            yield file.buffer && file.buffer.byteLength >= 3 * 1024 * 1024;
            // ID check for docs. Only for non-japan clients
            yield !isJp && !file.documentId && required_docs.indexOf(file.documentType.toLowerCase()) !== -1;
            // ID format check
            yield file.documentId && !/^[\w\s-]{0,30}$/.test(file.documentId);
            // Expiration date check for docs. Only for non-japan clients
            yield !isJp && !file.expirationDate && required_docs.indexOf(file.documentType.toLowerCase()) !== -1;
            // Check for front and back side
            yield !needs_action && multiple_side_file_ids.indexOf(file.id) !== -1 &&
                (file_checks[file.id].files[0] ^ file_checks[file.id].files[1]);// eslint-disable-line no-bitwise

            // Validations for japan
            // yield !needs_action && isJp && !((file_checks.mynumbercard && file_checks.mynumbercard.files[0]) ||
            //     (file_checks.mynumberphotocard && file_checks.mynumberphotocard.files[0]));
            // Check if one of the section 1&2 is file selected
            yield !needs_action && isJp && noneOfthese(...jp_section_1, ...jp_section_2_0, ...jp_section_2_1);
            // Check if both files are selected for section 2
            yield !needs_action && isJp && noneOfthese(...jp_section_1)
                && (noneOfthese(...jp_section_2_0) && !noneOfthese(...jp_section_2_1));
            yield !needs_action && isJp && noneOfthese(...jp_section_1)
                && (!noneOfthese(...jp_section_2_0) && noneOfthese(...jp_section_2_1));
        }

        const showError = (e) => {
            const $error = $('.error-msg');
            const message = e.message || e.message_to_client;
            enableButton();
            $error.setVisibility(1).html(message);
            setTimeout(() => { $error.empty().setVisibility(0); }, 3000);
        };

        const showSuccess = () => {
            const notification = localize('We are reviewing your documents. For more details [_1]contact us[_2].',
                [`<a href="${Url.urlFor('contact')}">`, '</a>']);
            displayNotification(notification , false, 'document_under_review');
            $('#not_authenticated, #not_authenticated_financial').setVisibility(0); // Just hide it
            $('#success-message').setVisibility(1);
        };

        const onResponse = (res) => {
            const dup_files = [];
            let successAny = false;
            res.forEach((file) => {
                const passthrough = file.passthrough;
                if (!file.warning) {
                    successAny = true;
                } else {
                    dup_files.push(`${passthrough.filename}(${passthrough.name})`);
                }
            });
            if (successAny) {
                showSuccess();
            } else {
                showError({message: localize('Following file(s) were already uploaded: [_1]', [`[ ${dup_files.join(', ')} ]`])});
            }
        };
    };

    return {
        onLoad,
    };
})();

module.exports = Authenticate;
