const DocumentUploader        = require('@binary-com/binary-document-uploader');
const Countries               = require('i18n-iso-countries');
const Cookies                 = require('js-cookie');
const Onfido                  = require('onfido-sdk-ui');
const onfido_phrases          = require('./onfido_phrases');
const Client                  = require('../../../base/client');
const Header                  = require('../../../base/header');
const BinarySocket            = require('../../../base/socket');
const isAuthenticationAllowed = require('../../../../_common/base/client_base').isAuthenticationAllowed;
const makeOption              = require('../../../../_common/common_functions').makeOption;
const CompressImage           = require('../../../../_common/image_utility').compressImg;
const ConvertToBase64         = require('../../../../_common/image_utility').convertToBase64;
const isImageType             = require('../../../../_common/image_utility').isImageType;
const getLanguage             = require('../../../../_common/language').get;
const localize                = require('../../../../_common/localize').localize;
const toTitleCase             = require('../../../../_common/string_util').toTitleCase;
const TabSelector             = require('../../../../_common/tab_selector');
const Url                     = require('../../../../_common/url');
const showLoadingImage        = require('../../../../_common/utility').showLoadingImage;
const getDocumentData         = require('../../../../_common/utility').getDocumentData;
const getRegex                = require('../../../../_common/utility').getRegex;

/*
    To handle onfido unsupported country, we handle the functions separately,
    the name of the functions will be original name + uns abbreviation of `unsupported`
*/
const Authenticate = (() => {
    let is_any_upload_failed     = false;
    let is_any_upload_failed_uns = false;
    let account_status    = {};
    let file_checks          = {};
    let file_checks_uns      = {};
    let onfido_sdk,
        available_document_list,
        residence_list,
        selected_country,
        $button,
        $submit_status,
        $submit_table,
        $button_uns,
        $submit_status_uns,
        $submit_table_uns;

    const init = () => {
        file_checks    = {};
        $submit_status = $('.submit-status');
        $submit_table  = $submit_status.find('table tbody');

        // Setup accordion
        $('#not_authenticated .files').accordion({
            heightStyle: 'content',
            collapsible: true,
            active     : false,
        });
        // Setup Date picker
        $('#not_authenticated .date-picker').datepicker({
            dateFormat : 'yy-mm-dd',
            changeMonth: true,
            changeYear : true,
            minDate    : '+6m',
        });

        $('#not_authenticated .file-picker').on('change', onFileSelected);

        const language            = getLanguage();
        const language_based_link = ['ID', 'RU', 'PT'].includes(language) ? `_${language}` : '';
        const $not_authenticated  = $('#not_authenticated');
        const link = Url.urlForCurrentDomain(`https://marketing.binary.com/authentication/Authentication_Process${language_based_link}.pdf`);

        $not_authenticated.setVisibility(1);

        $not_authenticated.find('.learn_more').setVisibility(1).find('a').attr('href', link);

        if (isIdentificationNoExpiry(Client.get('residence'))) {
            $('#expiry_datepicker_proofid').setVisibility(0);
            $('#exp_date_2').datepicker('setDate', '2099-12-31');
        }
    };

    const getAccountStatus = () => new Promise((resolve) => {
        BinarySocket.wait('get_account_status').then((response) => {
            const authentication_response = response.get_account_status;
            resolve(authentication_response);
        });
    });

    const initUnsupported = () => {
        file_checks_uns    = {};
        $submit_status_uns = $('.submit-status-uns');
        $submit_table_uns  = $submit_status_uns.find('table tbody');

        // Setup accordion
        $('#not_authenticated_uns .files').accordion({
            heightStyle: 'content',
            collapsible: true,
            active     : false,
        });
        // Setup Date picker
        $('#not_authenticated_uns .date-picker').datepicker({
            dateFormat : 'yy-mm-dd',
            changeMonth: true,
            changeYear : true,
            minDate    : '+6m',
        });
        $('#not_authenticated_uns .file-picker').on('change', onFileSelectedUns);

        const language               = getLanguage();
        const language_based_link    = ['ID', 'RU', 'PT'].includes(language) ? `_${language}` : '';
        const $not_authenticated_uns = $('#not_authenticated_uns');
        const link = Url.urlForCurrentDomain(`https://marketing.binary.com/authentication/Authentication_Process${language_based_link}.pdf`);

        $not_authenticated_uns.find('.learn_more').setVisibility(1).find('a').attr('href', link);

        if (isIdentificationNoExpiry(Client.get('residence'))) {
            $('#expiry_datepicker_proofid').setVisibility(0);
            $('#exp_date_2').datepicker('setDate', '2099-12-31');
        }
    };

    /**
     * Checks for countries of residence with no ID expiry date.
     * @param {string} residence
    */
    const isIdentificationNoExpiry = (residence) => /(ng|za|lk|in|sg|id|mm|vn|br|mx|co)/.test(residence);

    /**
     * Listens for file changes.
     * @param {*} event
     */
    const onFileSelected = (event) => {
        if (!event.target.files || !event.target.files.length) {
            resetLabel(event);
            return;
        }
        const $target      = $(event.target);
        const file_name    = event.target.files[0].name || '';
        const display_name = file_name.length > 20 ? `${file_name.slice(0, 10)}..${file_name.slice(-8)}` : file_name;

        $target.attr('data-status', '')
            .parent().find('label')
            .off('click')
            // Prevent opening file selector.
            .on('click', (e) => {
                if ($(e.target).is('span.remove')) e.preventDefault();
            })
            .text(display_name)
            .removeClass('error')
            .addClass('selected')
            .append($('<span/>', { class: 'remove' }))
            .find('.remove')
            .click((e) => {
                if ($(e.target).is('span.remove')) resetLabel(event);
            });

        // Hide success message on another file selected
        hideSuccess();
        // Change submit button state
        enableDisableSubmit();
    };

    const onFileSelectedUns = (event) => {
        if (!event.target.files || !event.target.files.length) {
            resetLabelUns(event);
            return;
        }
        const $target      = $(event.target);
        const file_name    = event.target.files[0].name || '';
        const display_name = file_name.length > 20 ? `${file_name.slice(0, 10)}..${file_name.slice(-8)}` : file_name;
        $target.attr('data-status', '')
            .parent().find('label')
            .off('click')
            // Prevent opening file selector.
            .on('click', (e) => {
                if ($(e.target).is('span.remove')) e.preventDefault();
            })
            .text(display_name)
            .removeClass('error')
            .addClass('selected')
            .append($('<span/>', { class: 'remove' }))
            .find('.remove')
            .click((e) => {
                if ($(e.target).is('span.remove')) resetLabelUns(event);
            });

        // Hide success message on another file selected
        hideSuccessUns();
        // Change submit button state
        enableDisableSubmitUns();
    };

    // Reset file-selector label
    const resetLabel = (event) => {
        const $target = $(event.target);
        let default_text = toTitleCase($target.attr('id').split('_')[0]);
        if (default_text !== 'Add') {
            default_text = default_text === 'Back' ? localize('Reverse Side') : localize('Front Side');
        }
        fileTracker($target, false);
        // Remove previously selected file and set the label
        $target.val('').parent().find('label').text(default_text).removeClass('selected error')
            .append($('<span/>', { class: 'add' }));
        // Change submit button state
        enableDisableSubmit();
    };

    // Reset file-selector label
    const resetLabelUns = (event) => {
        const $target = $(event.target);
        let default_text = toTitleCase($target.attr('id').split('_')[0]);
        if (default_text !== 'Add') {
            default_text = default_text === 'Back' ? localize('Reverse Side') : localize('Front Side');
        }
        fileTracker($target, false);
        // Remove previously selected file and set the label
        $target.val('').parent().find('label').text(default_text).removeClass('selected error')
            .append($('<span/>', { class: 'add' }));
        // Change submit button state
        enableDisableSubmitUns();
    };

    /**
     * Enables the submit button if any file is selected, also adds the event handler for the button.
     * Disables the button if it no files are selected.
     */
    const enableDisableSubmit = () => {
        const $not_authenticated = $('#authentication-message > div#not_authenticated');
        const $files             = $not_authenticated.find('input[type="file"]');
        $button = $not_authenticated.find('#btn_submit');

        const file_selected  = $('label[class~="selected"]').length;
        const has_file_error = $('label[class~="error"]').length;

        if (file_selected && !has_file_error) {
            if ($button.hasClass('button')) return;
            $('#resolve_error').setVisibility(0);
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

    /**
     * Enables the submit button if any file is selected, also adds the event handler for the button.
     * Disables the button if it no files are selected.
     */
    const enableDisableSubmitUns = () => {
        const $not_authenticated = $('#not_authenticated_uns');
        const $files             = $not_authenticated.find('input[type="file"]');
        $button_uns = $not_authenticated.find('#btn_submit_uns');

        const file_selected  = $('label[class~="selected"]').length;
        const has_file_error = $('label[class~="error"]').length;

        if (file_selected && !has_file_error) {
            if ($button_uns.hasClass('button')) return;
            $('#resolve_error').setVisibility(0);
            $button_uns.removeClass('button-disabled')
                .addClass('button')
                .off('click') // To avoid binding multiple click events
                .click(() => submitFilesUns($files));
        } else {
            if ($button_uns.hasClass('button-disabled')) return;
            $button_uns.removeClass('button')
                .addClass('button-disabled')
                .off('click');
        }
    };

    const showButtonLoading = () => {
        if ($button.length && !$button.find('.barspinner').length) {
            const $btn_text = $('<span/>', { text: $button.find('span').text(), class: 'invisible' });
            showLoadingImage($button.find('span'), 'white');
            $button.find('span').append($btn_text);
        }
    };

    const showButtonLoadingUns = () => {
        if ($button_uns.length && !$button_uns.find('.barspinner').length) {
            const $btn_text = $('<span/>', { text: $button_uns.find('span').text(), class: 'invisible' });
            showLoadingImage($button_uns.find('span'), 'white');
            $button_uns.find('span').append($btn_text);
        }
    };

    const removeButtonLoading = () => {
        if ($button.length && $button.find('.barspinner').length) {
            $button.find('>span').html($button.find('>span>span').text());
        }
    };

    const removeButtonLoadingUns = () => {
        if ($button_uns.length && $button_uns.find('.barspinner').length) {
            $button_uns.find('>span').html($button_uns.find('>span>span').text());
        }
    };

    /**
     * On submit button click
     */
    const submitFiles = ($files) => {
        if ($button.length && $button.find('.barspinner').length) { // it's still in submit process
            return;
        }
        // Disable submit button
        showButtonLoading();
        const files = [];
        is_any_upload_failed = false;
        $submit_table.children().remove();
        $files.each((i, e) => {
            if (e.files && e.files.length) {
                const $e        = $(e);
                const id        = $e.attr('id');
                const type      = `${($e.attr('data-type') || '').replace(/\s/g, '_').toLowerCase()}`;
                const name      = $e.attr('data-name');
                const page_type = $e.attr('data-page-type');
                const $inputs   = $e.closest('.fields').find('input[type="text"]');
                const file_obj  = {
                    file     : e.files[0],
                    chunkSize: 16384, // any higher than this sends garbage data to websocket currently.
                    class    : id,
                    type,
                    name,
                    page_type,
                };
                if ($inputs.length) {
                    file_obj.id_number = $($inputs[0]).val();
                    file_obj.exp_date  = $($inputs[1]).val();
                }
                fileTracker($e, true);
                files.push(file_obj);

                let display_name = name;
                if (/front|back/.test(id)) {
                    display_name += ` - ${/front/.test(id) ? localize('Front Side') : localize('Reverse Side')}`;
                }

                $submit_table.append($('<tr/>', { id: file_obj.type, class: id })
                    .append($('<td/>', { text: display_name }))                           // document type, e.g. Passport - Front Side
                    .append($('<td/>', { text: e.files[0].name, class: 'filename' }))     // file name, e.g. sample.pdf
                    .append($('<td/>', { text: localize('Pending'), class: 'status' }))   // status of uploading file, first set to Pending
                );
            }
        });
        $submit_status.setVisibility(1);
        processFiles(files);
    };

    /**
     * On submit button click
     */
    const submitFilesUns = ($files) => {
        if ($button_uns.length && $button_uns.find('.barspinner').length) { // it's still in submit process
            return;
        }
        // Disable submit button
        showButtonLoadingUns();
        const files = [];
        is_any_upload_failed_uns = false;
        $submit_table_uns.children().remove();
        $files.each((i, e) => {
            if (e.files && e.files.length) {
                const $e        = $(e);
                const id        = $e.attr('id');
                const type      = `${($e.attr('data-type') || '').replace(/\s/g, '_').toLowerCase()}`;
                const name      = $e.attr('data-name');
                const page_type = $e.attr('data-page-type');
                const $inputs   = $e.closest('.fields').find('input[type="text"]');
                const file_obj  = {
                    file     : e.files[0],
                    chunkSize: 16384, // any higher than this sends garbage data to websocket currently.
                    class    : id,
                    type,
                    name,
                    page_type,
                };
                if ($inputs.length) {
                    file_obj.id_number = $($inputs[0]).val();
                    file_obj.exp_date  = $($inputs[1]).val();
                }
                fileTrackerUns($e, true);
                files.push(file_obj);

                let display_name = name;
                if (/front|back/.test(id)) {
                    display_name += ` - ${/front/.test(id) ? localize('Front Side') : localize('Reverse Side')}`;
                }

                $submit_table_uns.append($('<tr/>', { id: file_obj.type, class: id })
                    .append($('<td/>', { text: display_name }))                           // document type, e.g. Passport - Front Side
                    .append($('<td/>', { text: e.files[0].name, class: 'filename' }))     // file name, e.g. sample.pdf
                    .append($('<td/>', { text: localize('Pending'), class: 'status' }))   // status of uploading file, first set to Pending
                );
            }
        });
        $submit_status_uns.setVisibility(1);
        processFilesUns(files);
    };

    const cancelUpload = () => {
        removeButtonLoading();
        enableDisableSubmit();
    };

    const processFiles = (files) => {
        const uploader = new DocumentUploader({ connection: BinarySocket.get() }); // send 'debug: true' here for debugging
        let idx_to_upload     = 0;
        let has_file_error = false;

        readFiles(files).then((files_to_process) => {
            files_to_process.forEach((file) => {
                if (file.message) {
                    has_file_error = true;
                    showError(file);
                }
            });

            if (has_file_error) {
                cancelUpload();
                return;
            }
            
            compressImageFiles(files_to_process).then((processed_files) => {
                const total_to_upload = processed_files.length;

                if (!total_to_upload) {
                    cancelUpload();
                    return;
                }

                const isLastUpload = () => total_to_upload === idx_to_upload + 1;

                // sequentially send files
                const uploadFile = () => {
                    const $status = $submit_table.find(`.${processed_files[idx_to_upload].passthrough.class} .status`);
                    $status.text(`${localize('Submitting')}...`);
                    uploader.upload(processed_files[idx_to_upload]).then((api_response) => {
                        onResponse(api_response, isLastUpload());
                        if (!api_response.error && !api_response.warning) {
                            $status.text(localize('Submitted')).append($('<span/>', { class: 'checked' }));
                            $(`#${api_response.passthrough.class}`).attr('type', 'hidden'); // don't allow users to change submitted files
                            $(`label[for=${api_response.passthrough.class}]`).removeClass('selected error').find('span').attr('class', 'checked');
                        }
                        uploadNextFile();
                    }).catch((error) => {
                        is_any_upload_failed = true;
                        showError({
                            message: error.message || localize('Failed'),
                            class  : error.passthrough ? error.passthrough.class : '',
                        });
                        uploadNextFile();
                    });
                };
                const uploadNextFile = () => {
                    if (!isLastUpload()) {
                        idx_to_upload += 1;
                        uploadFile();
                    }
                };
                uploadFile();
            });
        });
    };

    const processFilesUns = (files) => {
        const uploader = new DocumentUploader({ connection: BinarySocket.get() }); // send 'debug: true' here for debugging
        let idx_to_upload     = 0;
        let is_any_file_error = false;

        compressImageFilesUns(files).then((files_to_process) => {
            readFilesUns(files_to_process).then((processed_files) => {
                processed_files.forEach((file) => {
                    if (file.message) {
                        is_any_file_error = true;
                        showErrorUns(file);
                    }
                });
                const total_to_upload = processed_files.length;
                if (is_any_file_error || !total_to_upload) {
                    removeButtonLoadingUns();
                    enableDisableSubmitUns();
                    return; // don't start submitting files until all front-end validation checks pass
                }

                const isLastUpload = () => total_to_upload === idx_to_upload + 1;
                // sequentially send files
                const uploadFile = () => {
                    const $status = $submit_table_uns.find(`.${processed_files[idx_to_upload].passthrough.class} .status`);
                    $status.text(`${localize('Submitting')}...`);
                    uploader.upload(processed_files[idx_to_upload]).then((api_response) => {
                        onResponseUns(api_response, isLastUpload());
                        if (!api_response.error && !api_response.warning) {
                            $status.text(localize('Submitted')).append($('<span/>', { class: 'checked' }));
                            $(`#${api_response.passthrough.class}`).attr('type', 'hidden'); // don't allow users to change submitted files
                            $(`label[for=${api_response.passthrough.class}]`).removeClass('selected error').find('span').attr('class', 'checked');
                        }
                        uploadNextFile();
                    }).catch((error) => {
                        is_any_upload_failed_uns = true;
                        showErrorUns({
                            message: error.message || localize('Failed'),
                            class  : error.passthrough ? error.passthrough.class : '',
                        });
                        uploadNextFile();
                    });
                };
                const uploadNextFile = () => {
                    if (!isLastUpload()) {
                        idx_to_upload += 1;
                        uploadFile();
                    }
                };
                uploadFile();
            });
        });
    };

    const compressImageFiles = (files) => {
        const promises = [];
        files.forEach((f) => {
            const promise = new Promise((resolve) => {
                if (isImageType(f.filename)) {
                    const $status = $submit_table.find(`.${f.passthrough.class} .status`);
                    const $filename = $submit_table.find(`.${f.passthrough.class} .filename`);
                    $status.text(`${localize('Compressing Image')}...`);

                    ConvertToBase64(f.file).then((img) => {
                        CompressImage(img).then((compressed_img) => {
                            const file_arr = f;
                            file_arr.file = compressed_img;
                            $filename.text(file_arr.file.name);
                            resolve(file_arr);
                        });
                    });
                } else {
                    resolve(f);
                }
            });
            promises.push(promise);
        });

        return Promise.all(promises);
    };

    const compressImageFilesUns = (files) => {
        const promises = [];
        files.forEach((f) => {
            const promise = new Promise((resolve) => {
                if (isImageType(f.file.name)) {
                    const $status = $submit_table_uns.find(`.${f.class} .status`);
                    const $filename = $submit_table_uns.find(`.${f.class} .filename`);
                    $status.text(`${localize('Compressing Image')}...`);

                    ConvertToBase64(f.file).then((img) => {
                        CompressImage(img).then((compressed_img) => {
                            const file_arr = f;
                            file_arr.file = compressed_img;
                            $filename.text(file_arr.file.name);
                            resolve(file_arr);
                        });
                    });
                } else {
                    resolve(f);
                }
            });
            promises.push(promise);
        });

        return Promise.all(promises);
    };

    // Returns file promise.
    const readFiles = (files) => {
        const promises = [];
        files.forEach((f) => {
            const fr      = new FileReader();
            const promise = new Promise((resolve) => {
                fr.onload = () => {
                    const $status = $submit_table.find(`.${f.class} .status`);
                    $status.text(`${localize('Checking')}...`);

                    const format = (f.file.type.split('/')[1] || (f.file.name.match(/\.([\w\d]+)$/) || [])[1] || '').toUpperCase();
                    const obj    = {
                        file          : f.file,
                        filename      : f.file.name,
                        buffer        : fr.result,
                        documentType  : f.type,
                        pageType      : f.page_type,
                        documentFormat: format,
                        documentId    : f.id_number || undefined,
                        expirationDate: f.exp_date || undefined,
                        chunkSize     : f.chunkSize,
                        passthrough   : {
                            filename: f.file.name,
                            name    : f.name,
                            class   : f.class,
                        },
                    };

                    const error = { message: validate(obj) };
                    if (error && error.message) {
                        resolve({
                            message: error.message,
                            class  : f.class,
                        });
                    } else {
                        $status.text(localize('Checked')).append($('<span/>', { class: 'checked' }));
                    }

                    resolve(obj);
                };

                fr.onerror = () => {
                    resolve({
                        message: localize('Unable to read file [_1]', f.file.name),
                        class  : f.class,
                    });
                };
                // Reading file.
                fr.readAsArrayBuffer(f.file);
            });

            promises.push(promise);
        });

        return Promise.all(promises);
    };

    // Returns file promise.
    const readFilesUns = (files) => {
        const promises = [];
        files.forEach((f) => {
            const fr      = new FileReader();
            const promise = new Promise((resolve) => {
                fr.onload = () => {
                    const $status = $submit_table_uns.find(`.${f.class} .status`);
                    $status.text(`${localize('Checking')}...`);

                    const format = (f.file.type.split('/')[1] || (f.file.name.match(/\.([\w\d]+)$/) || [])[1] || '').toUpperCase();
                    const obj    = {
                        filename      : f.file.name,
                        buffer        : fr.result,
                        documentType  : f.type,
                        pageType      : f.page_type,
                        documentFormat: format,
                        documentId    : f.id_number || undefined,
                        expirationDate: f.exp_date || undefined,
                        chunkSize     : f.chunkSize,
                        passthrough   : {
                            filename: f.file.name,
                            name    : f.name,
                            class   : f.class,
                        },
                    };

                    const error = { message: validate(obj) };
                    if (error && error.message) {
                        resolve({
                            message: error.message,
                            class  : f.class,
                        });
                    } else {
                        $status.text(localize('Checked')).append($('<span/>', { class: 'checked' }));
                    }

                    resolve(obj);
                };

                fr.onerror = () => {
                    resolve({
                        message: localize('Unable to read file [_1]', f.file.name),
                        class  : f.class,
                    });
                };
                // Reading file.
                fr.readAsArrayBuffer(f.file);
            });

            promises.push(promise);
        });

        return Promise.all(promises);
    };

    const fileTracker = ($e, selected) => {
        const doc_type = ($e.attr('data-type') || '').replace(/\s/g, '_').toLowerCase();
        const file_type = ($e.attr('id').match(/\D+/g) || [])[0];
        // Keep track of front and back sides of files.
        if (selected) {
            file_checks[doc_type] = file_checks[doc_type] || {};
            file_checks[doc_type][file_type] = true;
        } else if (file_checks[doc_type]) {
            file_checks[doc_type][file_type] = false;
        }
    };

    const fileTrackerUns = ($e, selected) => {
        const doc_type = ($e.attr('data-type') || '').replace(/\s/g, '_').toLowerCase();
        const file_type = ($e.attr('id').match(/\D+/g) || [])[0];
        // Keep track of front and back sides of files.
        if (selected) {
            file_checks_uns[doc_type] = file_checks_uns[doc_type] || {};
            file_checks_uns[doc_type][file_type] = true;
        } else if (file_checks_uns[doc_type]) {
            file_checks_uns[doc_type][file_type] = false;
        }
    };

    const onErrorResolved = (error_field, class_name, reverse_class_name) => {
        const id = error_field ? `${error_field}_${class_name.match(/\d+/)[0]}` : reverse_class_name;
        $(`#${id}`).one('input change', () => {
            $(`label[for=${class_name}]`).removeClass('error');
            enableDisableSubmit();
        });
    };

    // Validate user input
    const validate = (file) => {
        const required_docs = ['passport', 'national_identity_card', 'driving_licence'];
        const doc_name = {
            passport              : localize('Passport'),
            national_identity_card: localize('Identity card'),
            driving_licence       : localize('Driving licence'),
        };

        const accepted_formats_regex = /selfie/.test(file.passthrough.class)
            ? /^(PNG|JPG|JPEG|GIF)$/i
            : /^(PNG|JPG|JPEG|GIF|PDF)$/i;

        if (!(file.documentFormat || '').match(accepted_formats_regex)) {
            return localize('Invalid document format.');
        }
        if (file.buffer && file.buffer.byteLength >= 8 * 1024 * 1024) {
            return localize('File ([_1]) size exceeds the permitted limit. Maximum allowed file size: [_2]', [file.filename, '8MB']);
        }
        if (!file.documentId && required_docs.indexOf(file.documentType.toLowerCase()) !== -1)  {
            onErrorResolved('id_number', file.passthrough.class);
            return localize('ID number is required for [_1].', doc_name[file.documentType]);
        }
        if (file.documentId && !/^[\w\s-]{0,30}$/.test(file.documentId)) {
            onErrorResolved('id_number', file.passthrough.class);
            return localize('Only letters, numbers, space, underscore, and hyphen are allowed for ID number ([_1]).', doc_name[file.documentType]);
        }
        if (!file.expirationDate
            && required_docs.indexOf(file.documentType.toLowerCase()) !== -1
            && !(isIdentificationNoExpiry(Client.get('residence')) && file.documentType === 'national_identity_card')
        ) {
            onErrorResolved('exp_date', file.passthrough.class);
            return localize('Expiry date is required for [_1].', doc_name[file.documentType]);
        }

        return null;
    };

    const showError = (obj_error) => {
        removeButtonLoading();
        const $error      = $('#msg_form');
        const $file_error = $submit_table.find(`.${obj_error.class} .status`);
        const message     = obj_error.message;
        if ($file_error.length) {
            $file_error.text(message).addClass('error-msg');
            $(`label[for=${obj_error.class}]`).addClass('error');
            $('#resolve_error').setVisibility(1);
        } else {
            $error.text(message).setVisibility(1);
        }
        enableDisableSubmit();
    };

    const showErrorUns = (obj_error) => {
        removeButtonLoadingUns();
        const $error      = $('#msg_form_uns');
        const $file_error = $submit_table_uns.find(`.${obj_error.class} .status`);
        const message     = obj_error.message;
        if ($file_error.length) {
            $file_error.text(message).addClass('error-msg');
            $(`label[for=${obj_error.class}]`).addClass('error');
            $('#resolve_error_uns').setVisibility(1);
        } else {
            $error.text(message).setVisibility(1);
        }
        enableDisableSubmitUns();
    };

    const showSuccess = () => {
        BinarySocket.send({ get_account_status: 1 }, { forced: true }).then(response => {
            account_status = response.get_account_status;
            Header.displayAccountStatus();
            removeButtonLoading();
            $button.setVisibility(0);
            $('.submit-status').setVisibility(0);
            $('#not_authenticated').setVisibility(0);
            showCTAButton('identity', 'pending');
            $('#pending_poa').setVisibility(1);
        });
    };

    const showSuccessUns = () => {
        BinarySocket.send({ get_account_status: 1 }, { forced: true }).then(response => {
            account_status = response.get_account_status;
            Header.displayAccountStatus();
            removeButtonLoadingUns();
            $button_uns.setVisibility(0);
            $('.submit-status-uns').setVisibility(0);
            $('#not_authenticated_uns').setVisibility(0);

            showCTAButton('document', 'pending');
            $('#upload_complete').setVisibility(1);
            $('#msg_personal_details').setVisibility(0);
        });
    };

    const hideSuccess = () => {
        if ($button) {
            $button.setVisibility(1);
        }
        $('#pending_poa').setVisibility(0);
    };

    const hideSuccessUns = () => {
        if ($button_uns) {
            $button_uns.setVisibility(1);
        }
        $('#upload_complete').setVisibility(0);
    };

    const onResponse = (response, is_last_upload) => {
        if (response.warning || response.error) {
            is_any_upload_failed = true;
            showError({
                message: response.message || (response.error ? response.error.message : localize('Failed')),
                class  : response.passthrough.class,
            });
        } else if (is_last_upload && !is_any_upload_failed) {
            showSuccess();
        }
    };

    const onResponseUns = (response, is_last_upload) => {
        if (response.warning || response.error) {
            is_any_upload_failed_uns = true;
            showErrorUns({
                message: response.message || (response.error ? response.error.message : localize('Failed')),
                class  : response.passthrough.class,
            });
        } else if (is_last_upload && !is_any_upload_failed_uns) {
            showSuccessUns();
        }
    };

    const initTab = () => {
        TabSelector.onLoad();
    };

    const initOnfidoVerification = async () => {
        $('#idv-container').setVisibility(0);
        $('#authentication_tab').setVisibility(1);
        Url.updateParamsWithoutReload({ authentication_tab: 'poi' }, true);
        TabSelector.updateTabDisplay();

        const country_code = selected_country.value;
        const documents_supported = selected_country.identity.services.onfido.documents_supported;
        const service_token_response = await getOnfidoServiceToken(country_code);
        let has_personal_details_error = false;

        if (
            service_token_response.error &&
            service_token_response.error.code === 'MissingPersonalDetails'
        ) {
            has_personal_details_error = true;
            const personal_fields_errors = {
                address_city    : localize('Town/City'),
                address_line_1  : localize('First line of home address'),
                address_postcode: localize('Postal Code/ZIP'),
                address_state   : localize('State/Province'),
                email           : localize('Email address'),
                phone           : localize('Telephone'),
                place_of_birth  : localize('Place of birth'),
                residence       : localize('Country of Residence'),
            };

            const missing_personal_fields = Object.keys(service_token_response.error.details)
                .map(field => (personal_fields_errors[field].toLowerCase() || field));

            const error_msgs = missing_personal_fields ? missing_personal_fields.join(', ') : '';

            $('#missing_personal_fields').html(error_msgs);
        }

        if (has_personal_details_error) {
            $('#personal_details_error').setVisibility(1);
        } else if (!$('#onfido').is(':parent')) {
            $('#onfido').setVisibility(1);
            const onfido_country_code = country_code.length < 3 ?
                Countries.alpha2ToAlpha3(country_code.toUpperCase()) : country_code;
    
            const onfido_documents = Array.isArray(documents_supported) ?
                documents_supported : Object.keys(documents_supported).map(d => documents_supported[d].display_name);
    
            try {
                onfido_sdk = await Onfido.init({
                    containerId: 'onfido',
                    language   : {
                        locale       : getLanguage().toLowerCase() || 'en',
                        phrases      : onfido_phrases,
                        mobilePhrases: onfido_phrases,
                    },
                    token   : service_token_response.token,
                    useModal: false,
                    onComplete(data) {
                        handleComplete(data);
                    },
                    steps: [
                        {
                            type   : 'document',
                            options: {
                                documentTypes: {
                                    passport       : onfido_documents.some(doc => /Passport/g.test(doc)),
                                    driving_licence: onfido_documents.some(doc => /Driving Licence/g.test(doc)) ? {
                                        country: onfido_country_code,
                                    } : false,
                                    national_identity_card: onfido_documents.some(doc => /National Identity Card/g.test(doc)) ? {
                                        country: onfido_country_code,
                                    } : false,
                                },
                            },
                        },
                        'face',
                    ],
                });
                $('#authentication_loading').setVisibility(0);
            } catch (err) {
                $('#error_occured').setVisibility(1);
                $('#authentication_loading').setVisibility(0);
            }
        }
    };

    const showCTAButton = async (type, status) => {
        BinarySocket.send({ get_account_status: 1 }, { forced: true }).then(response => {
            account_status = response.get_account_status;
            const { needs_verification } = account_status.authentication;
            
            const type_required = type === 'identity' ? 'poi' : 'poa';
            const type_pending = type === 'identity' ? 'poa' : 'poi';
            const description_status = status !== 'verified';
    
            $(`#text_verified_${type_pending}_required, #text_pending_${type_pending}_required`).setVisibility(0);
            $(`#button_verified_${type_pending}_required, #button_pending_${type_pending}_required`).setVisibility(0);
    
            if (needs_verification.includes(type)) {
                $(`#text_${status}_${type_required}_required`).setVisibility(1);
                $(`#button_${status}_${type_required}_required`).setVisibility(1);
            } else if (description_status) {
                $(`#text_${status}_${type_pending}_pending`).setVisibility(1);
            }
        });
    };

    const handleComplete = (data) => {
        const document_ids = Object.keys(data).map(key => data[key].id);

        BinarySocket.send({
            notification_event: 1,
            category          : 'authentication',
            event             : 'poi_documents_uploaded',
            args              : {
                documents: document_ids,
            },
        }).then(() => {
            onfido_sdk.tearDown();
            $('#authentication_loading').setVisibility(1);
            setTimeout(() => {
                BinarySocket.send({ get_account_status: 1 }, { forced: true }).then(response => {
                    account_status = response.get_account_status;
                    $('#msg_personal_details').setVisibility(0);
                    $('#upload_complete').setVisibility(1);
                    Header.displayAccountStatus();
                    $('#authentication_loading').setVisibility(0);

                    showCTAButton('document', 'pending');
                });
            }, 4000);
        });
    };

    const getOnfidoServiceToken = (country_code) => new Promise((resolve) => {
        const onfido_cookie = Cookies.get('onfido_token');
        const onfido_country_code = country_code.length !== 2
            ? Countries.alpha3ToAlpha2(country_code.toUpperCase()) : country_code;

        if (!onfido_cookie) {
            BinarySocket.send({
                service_token: 1,
                service      : 'onfido',
                country      : onfido_country_code,
            }).then((response) => {
                if (response.error) {
                    resolve({ error: response.error });
                    return;
                }
                const token = response.service_token.onfido.token;
                const in_90_minutes = 1 / 16;
                Cookies.set('onfido_token', token, {
                    expires : in_90_minutes,
                    secure  : true,
                    sameSite: 'strict',
                });
                resolve({ token });
            });
        } else {
            resolve({ token: onfido_cookie });
        }
    });

    const cleanElementVisibility = () => {
        $('#personal_details_error').setVisibility(0);
        $('#limited_poi').setVisibility(0);
        $('#idv-container').setVisibility(0);
    };

    const handleCountrySelector = async () => {
        $('#authentication_tab').setVisibility(0);
        $('#idv-container').setVisibility(1);
        const $residence_dropdown = $('#country_dropdown');
        const next_button = document.getElementById('button_next_country_selected');
        const { idv, onfido } = account_status.authentication.identity.services;
        const { submissions_left: idv_submissions_left } = idv;
        const { submissions_left: onfido_submissions_left } = onfido;
        const is_idv_disallowed = account_status.status.some(ac => ac === 'idv_disallowed');

        selected_country = null;
        await BinarySocket.send({ residence_list: 1 })
            .then(response => residence_list = response.residence_list);

        if (!selected_country) {
            next_button.classList.add('button-disabled');
        }

        $('#authentication_loading').setVisibility(0);
 
        if (residence_list.length > 0) {
            $('#idv_country_selector').setVisibility(1);

            $residence_dropdown.append(makeOption({
                text       : localize('Please select the country of document issuance'),
                class      : 'placeholder',
                value      : 'initial',
                is_disabled: 'disabled',
            }));

            residence_list.forEach((residence) => {
                $residence_dropdown.append(makeOption({
                    text : residence.text,
                    value: residence.value,
                }));
            });

            $residence_dropdown.html($residence_dropdown.html());

            if (selected_country) {
                $residence_dropdown.val(selected_country.value);
            } else {
                $residence_dropdown.val('initial');
            }

            $residence_dropdown.on('change', (e) => {
                const dropdown_country = residence_list.find(r => r.value === e.target.value);
                if (dropdown_country) {
                    selected_country = dropdown_country;
                }
                if (selected_country) {
                    next_button.classList.remove('button-disabled');
                }
            });

            next_button.addEventListener('click', () => {
                if (selected_country) {
                    const is_idv_supported = selected_country.identity.services.idv.is_country_supported;
                    const is_onfido_supported = selected_country.identity.services.onfido.is_country_supported;
                    $('#idv_country_selector').setVisibility(0);

                    if (is_idv_supported && !is_idv_disallowed && Number(idv_submissions_left) > 0) {
                        handleIdvDocumentSubmit();
                    } else if (is_onfido_supported && Number(onfido_submissions_left) > 0) {
                        initOnfidoVerification();
                    } else {
                        handleManual();
                    }
                }
            });
        }
    };

    const handleIdvDocumentSubmit = async () => {
        $('#idv_document_submit').setVisibility(1);

        const $documents = $('#document_type');
        const $example = $('#document_example_format');
        const $personal_detail_msg = $('#idv_personal_detail_msg');
        const left_container = document.getElementById('idv_document_left');
        const right_container = document.getElementById('idv_document_right');
        const example_format_text = document.getElementById('document_example_format');
        const document_input = document.getElementById('document_number');
        const document_sample_img = document.getElementById('document_sample_image');
        const back_button = document.getElementById('idv_document_submit_back_btn');
        const verify_button = document.getElementById('idv_document_submit_verify_btn');

        // Reset all states in case user navigates back and forth
        document_input.value = '';
        document_input.disabled = true;
        document_sample_img.src = '';
        right_container.setVisibility(0);
        $personal_detail_msg.setVisibility(0);
        verify_button.classList.add('button-disabled');
        left_container.classList.remove('show-sample-image');
        example_format_text.classList.remove('error-text');
        $example.html('');

        const country_code = selected_country.value;
        const { has_visual_sample, documents_supported } = selected_country.identity.services.idv;

        let document_type,
            document_number;
        
        const filtered_documents =
            country_code === 'gh'
                ? Object.keys(documents_supported).filter(d => d !== 'voter_id')
                : Object.keys(documents_supported);

        available_document_list = filtered_documents.map(d => {
            const { new_display_name, example_format, sample_image } = getDocumentData(country_code, d);
            const { format:regex, display_name } = documents_supported[d];
            return { id: d, text: new_display_name || display_name, example_format, sample_image, regex };
        });

        if (selected_country) {
            const $enabled_options = $('<select/>');
            $enabled_options.append(makeOption({
                text       : localize('Choose the document type'),
                value      : 'initial',
                is_disabled: 'disabled',
            }));
            
            available_document_list.forEach((doc) => {
                $enabled_options.append(makeOption({
                    text       : doc.text,
                    value      : doc.id,
                    is_disabled: false,
                }));
            });

            $documents.html($enabled_options.html());
            $documents.val('initial');

            const validateInput = () => {
                const input_value = document_input.value;
                const { example_format, regex } = document_type;
                const format_regex = getRegex(regex);

                if (format_regex.test(input_value)) {
                    document_number = input_value;
                    verify_button.classList.remove('button-disabled');
                    example_format_text.classList.remove('error-text');
                } else {
                    const error_text = localize('Please enter the correct format. Example:');
                    $example.html(`${error_text} ${example_format}`);
                    example_format_text.classList.add('error-text');

                    if (!verify_button.classList.contains('button-disabled')) {
                        verify_button.classList.add('button-disabled');
                    }
                }

                if (input_value === '') {
                    example_format_text.classList.remove('error-text');
                }
            };

            // Update Sample Image and Example Format on Dropdown Change (If Available)
            $documents.on('change', (e) => {
                document_type = available_document_list.find(d => d.id === e.target.value);
                validateInput();
                const { sample_image, example_format } = document_type;
                
                if (has_visual_sample && sample_image) {
                    document_sample_img.src = sample_image;
                    right_container.setVisibility(1);
                    left_container.classList.add('show-sample-image');
                } else {
                    document_sample_img.src = '';
                    right_container.setVisibility(0);
                    left_container.classList.remove('show-sample-image');
                }

                if ($documents[0].selectedOptions){
                    $example.html(`Example: ${example_format}`);
                }

                if (document_type) {
                    $personal_detail_msg.setVisibility(1);
                    document_input.disabled = false;
                }
            });

            document_input.addEventListener('keyup', (e) => {
                e.preventDefault();
                validateInput();
            });

            back_button.addEventListener('click', (e) => {
                e.preventDefault();
                $('#idv_document_submit').setVisibility(0);
                handleCountrySelector();
            });

            verify_button.addEventListener('click', async (e) => {
                e.preventDefault();
                const submit_data = {
                    identity_verification_document_add: 1,
                    document_number,
                    document_type                     : document_type.id,
                    issuing_country                   : selected_country.value,
                };
                await BinarySocket.send(submit_data).then(response => {
                    if (response.error) {
                        // Show some error message to user
                    } else {
                        // Success - Update authentication object with new status
                        BinarySocket.send({ get_account_status: 1 }, { forced: true }).then(res => {
                            account_status = res.get_account_status;
                            const needs_verification = account_status.authentication.needs_verification;
                            const needs_poa = needs_verification.length && needs_verification.includes('document');
                            $('#idv_document_submit').setVisibility(0);
                            if (needs_poa) {
                                $('#authentication_tab').setVisibility(1);
                                $('#idv_submit_pending_need_poa').setVisibility(1);
                                Url.updateParamsWithoutReload({ authentication_tab: 'poi' }, true);
                                TabSelector.updateTabDisplay();
                                $('#idv_pending_submit_poa_btn').on('click', () => {
                                    init();
                                    $('#not_authenticated').setVisibility(1);
                                    Url.updateParamsWithoutReload({ authentication_tab: 'poa' }, true);
                                    TabSelector.updateTabDisplay();
                                });
                            } else {
                                $('#idv_submit_pending').setVisibility(1);
                            }
                        });
                    }
                });
            });
        }
    };

    const handleIdv = async () => {
        $('#authentication_tab').setVisibility(0);
        account_status = await getAccountStatus();
        const is_idv_disallowed = account_status.status.some(ac => ac === 'idv_disallowed');
        const { idv, onfido } = account_status.authentication.identity.services;
        const { status, submissions_left: idv_submissions_left } = idv;
        const { submissions_left: onfido_submissions_left } = onfido;
        const needs_poa = account_status.authentication.needs_verification.length && account_status.authentication.needs_verification.includes('document');
        $('#idv-container').setVisibility(1);

        switch (status) {
            case 'pending':
                if (needs_poa) {
                    $('#authentication_tab').setVisibility(1);
                    $('#idv_submit_pending_need_poa').setVisibility(1);
                    $('#idv_pending_submit_poa_btn').on('click', () => {
                        $('#not_authenticated').setVisibility(1);
                        Url.updateParamsWithoutReload({ authentication_tab: 'poa' }, true);
                        $('#poa').setVisibility(1);
                        TabSelector.updateTabDisplay();
                    });
                } else {
                    if (is_idv_disallowed) {
                        $('#authentication_tab').setVisibility(1);
                        Url.updateParamsWithoutReload({ authentication_tab: 'poi' }, true);
                        TabSelector.updateTabDisplay();
                        $('#poa').setVisibility(1);
                    }
                    $('#idv_submit_pending').setVisibility(1);
                }
                break;
            case 'rejected':
                $('#idv_document_failed').setVisibility(1);
                $('#idv_document_failed_upload_btn').setVisibility(0);
                // If IDV has remaining attempt
                if (Number(idv_submissions_left) > 0) {
                    $('#idv_document_failed_try_again_btn').on('click', () => {
                        $('#idv_document_failed').setVisibility(0);
                        handleCountrySelector();
                    });
                } else {
                    $('#idv_document_failed_try_again_btn').setVisibility(0);
                    $('#idv_document_failed_text').setVisibility(1);
                    $('#idv_document_failed_upload_btn').setVisibility(1);
                    $('#idv_document_failed_upload_btn').on('click', () => {
                        $('#idv_document_failed').setVisibility(0);
                        if (Number(onfido_submissions_left) > 0) {
                            handleCountrySelector();
                        } else {
                            handleManual();
                        }
                    });
                }
                break;
            case 'verified':
                if (needs_poa) {
                    $('#authentication_tab').setVisibility(1);
                    Url.updateParamsWithoutReload({ authentication_tab: 'poi' }, true);
                    TabSelector.updateTabDisplay();
                    $('#idv_document_verified_need_poa').setVisibility(1);
                    $('#idv_verified_poa_btn').on('click', () => {
                        $('#poa').setVisibility(1);
                        Url.updateParamsWithoutReload({ authentication_tab: 'poa' }, true);
                        TabSelector.updateTabDisplay();
                    });
                } else {
                    const is_visible = 1;
                    if (is_idv_disallowed) {
                        $('#authentication_tab').setVisibility(is_visible);
                        Url.updateParamsWithoutReload({ authentication_tab: 'poa' }, true);
                        TabSelector.updateTabDisplay();
                        $('#poa').setVisibility(is_visible);
                        $('#idv_document_verified_poi').setVisibility(is_visible);
                    } else {
                        $('#idv_document_verified').setVisibility(is_visible);
                    }
                }
                break;
            case 'expired':
                $('#idv_document_expired').setVisibility(1);
                $('#idv_expired_btn').on('click', () => {
                    $('#idv_document_expired').setVisibility(0);
                    handleCountrySelector(is_idv_disallowed);
                });
                break;
            default:
                break;
        }
    };

    const handleOnfido = async () => {
        $('#idv-container').setVisibility(0);
        account_status = await getAccountStatus();
        const needs_poa = account_status.authentication.needs_verification.length && account_status.authentication.needs_verification.includes('document');
        const {
            status,
            submissions_left,
            last_rejected: rejected_reasons,
        } = account_status.authentication.identity.services.onfido;
        const is_idv_disallowed = account_status.status.some(ac => ac === 'idv_disallowed');
        $('#authentication_tab').setVisibility(1);
    
        switch (status) {
            case 'none':
                handleCountrySelector();
                break;
            case 'pending':
                $('#upload_complete').setVisibility(1);
                showCTAButton('document', 'pending');
                break;
            case 'suspected':
                $('#unverified').setVisibility(1);
                break;
            case 'rejected':
                if (Number(submissions_left) < 1) {
                    $('#limited_poi').setVisibility(1);
                } else {
                    const maximum_reasons = rejected_reasons.slice(0, 3);
                    const has_minimum_reasons = rejected_reasons.length > 3;
                    $('#last_rejection_poi').setVisibility(1);
    
                    maximum_reasons.forEach(reason => {
                        $('#last_rejection_list').append(`<li>${reason}</li>`);
                    });
    
                    $('#last_rejection_button').off('click').on('click', () => {
                        $('#last_rejection_poi').setVisibility(0);
                        handleCountrySelector();
                    });

                    if (has_minimum_reasons) {
                        $('#last_rejection_more').setVisibility(1);
                        $('#last_rejection_more').off('click').on('click', () => {
                            $('#last_rejection_more').setVisibility(0);
                            $('#last_rejection_less').setVisibility(1);
                            $('#last_rejection_list').empty();
        
                            rejected_reasons.forEach(reason => {
                                $('#last_rejection_list').append(`<li>${reason}</li>`);
                            });
                        });
                        $('#last_rejection_less').off('click').on('click', () => {
                            $('#last_rejection_less').setVisibility(0);
                            $('#last_rejection_more').setVisibility(1);
                            $('#last_rejection_list').empty();
        
                            maximum_reasons.forEach(reason => {
                                $('#last_rejection_list').append(`<li>${reason}</li>`);
                            });
                        });
                    }
                }
                break;
            case 'verified':
                $('#authentication_tab').setVisibility(1);
                Url.updateParamsWithoutReload({ authentication_tab: 'poi' }, true);
                TabSelector.updateTabDisplay();
                if (needs_poa || is_idv_disallowed) {
                    Url.updateParamsWithoutReload({ authentication_tab: 'poa' }, true);
                    $('#poa').setVisibility(1);
                    TabSelector.updateTabDisplay();
                }
                showCTAButton('document', 'verified');
                $('#verified').setVisibility(1);
                break;
            case 'expired':
                $('#expired_poi').setVisibility(1);
                $('#expired_button').off('click').on('click', () => {
                    $('#expired_poi').setVisibility(0);
                    handleCountrySelector();
                });
                break;
            default:
                break;
        }
    };

    const handleManual = () => {
        $('#idv-container').setVisibility(0);
        $('#authentication_tab').setVisibility(1);
        $('#msg_personal_details').setVisibility(1);
        TabSelector.updateTabDisplay();
        $('#not_authenticated_uns').setVisibility(1);
        initUnsupported();
    };

    const initAuthentication = async () => {
        account_status = await getAccountStatus();
        if (!account_status || account_status.error) {
            $('#error_occured').setVisibility(1);
            return;
        }

        const authentication_object = account_status.authentication;
        const allow_poi_resubmission = account_status.status.some(s => s === 'allow_poi_resubmission');

        const { attempts, document, identity } = authentication_object;
        const is_idv_disallowed = account_status.status.some(ac => ac === 'idv_disallowed');
        const identity_status = identity.status;
        const identity_last_attempt = attempts.latest;
        const is_fully_authenticated = identity.status === 'verified' && document.status === 'verified';
        const needs_verification = account_status.authentication.needs_verification;
        const needs_poa = needs_verification.length && needs_verification.includes('document');

        if (identity_status === 'none' || allow_poi_resubmission) {
            handleCountrySelector();
        } else if (is_fully_authenticated) {
            $('#authentication_verified').setVisibility(1);
        // For statuses set from BO, last attempt will be null
        } else if (!identity_last_attempt) {
            $('#authentication_tab').setVisibility(1);
            switch (identity_status) {
                case 'pending':
                    showCTAButton('document', 'pending');
                    $('#upload_complete').setVisibility(1);
                    break;
                case 'suspected':
                    $('#unverified').setVisibility(1);
                    break;
                case 'rejected':
                    $('#limited_poi').setVisibility(1);
                    break;
                case 'verified':
                    $('#verified').setVisibility(1);

                    if (is_idv_disallowed) {
                        $('#authentication_tab').setVisibility(1);
                        Url.updateParamsWithoutReload({ authentication_tab: 'poi' }, true);
                        TabSelector.updateTabDisplay();
                        $('#poa').setVisibility(1);
                    }
                    break;
                case 'expired':
                    $('#expired_poi').setVisibility(1);
                    $('#expired_button').off('click').on('click', () => {
                        $('#expired_poi').setVisibility(0);
                        handleCountrySelector();
                    });
                    break;
                default:
                    break;
            }
        } else {
            switch (identity_last_attempt.service) {
                case 'idv':
                    handleIdv();
                    break;
                case 'onfido':
                    handleOnfido();
                    break;
                case 'manual':
                    handleManual();
                    break;
                default:
                    break;
            }
        }

        if (!needs_poa) {
            switch (document.status) {
                case 'none': {
                    init();
                    $('#not_authenticated').setVisibility(1);
                    break;
                }
                case 'pending':
                    $('#pending_poa').setVisibility(1);
                    break;
                case 'suspected':
                case 'rejected':
                    $('#unverified_poa').setVisibility(1);
                    break;
                case 'verified':
                    showCTAButton('document', 'verified');
                    $('#verified_poa').setVisibility(1);
                    break;
                case 'expired':
                    $('#expired_poa').setVisibility(1);
                    break;
                default:
                    break;
            }
        } else {
            init();
            $('#not_authenticated').setVisibility(1);
        }

        $('#authentication_loading').setVisibility(0);
        TabSelector.updateTabDisplay();
    };

    const onLoad = async () => {
        cleanElementVisibility();
        account_status = await getAccountStatus();

        if (isAuthenticationAllowed()) {
            initTab();
            initAuthentication();
        } else {
            $('#authentication_tab').setVisibility(0);
            $('#authentication_loading').setVisibility(0);
            $('#authentication_unneeded').setVisibility(1);
        }
    };

    const onUnload = () => {
        if (onfido_sdk) {
            onfido_sdk.tearDown();
        }

        TabSelector.onUnload();
    };

    return {
        onLoad,
        onUnload,
    };
})();

module.exports = Authenticate;
