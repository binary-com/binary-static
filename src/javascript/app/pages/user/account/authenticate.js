const DocumentUploader    = require('@binary-com/binary-document-uploader');
const Cookies             = require('js-cookie');
const Onfido              = require('onfido-sdk-ui');
const Client              = require('../../../base/client');
const Header              = require('../../../base/header');
const BinarySocket        = require('../../../base/socket');
const CompressImage       = require('../../../../_common/image_utility').compressImg;
const ConvertToBase64     = require('../../../../_common/image_utility').convertToBase64;
const isImageType         = require('../../../../_common/image_utility').isImageType;
const getLanguage         = require('../../../../_common/language').get;
const localize            = require('../../../../_common/localize').localize;
const toTitleCase         = require('../../../../_common/string_util').toTitleCase;
const TabSelector         = require('../../../../_common/tab_selector');
const Url                 = require('../../../../_common/url');
const showLoadingImage    = require('../../../../_common/utility').showLoadingImage;
const State               = require('../../../../_common/storage').State;

const Authenticate = (() => {
    let is_any_upload_failed = false;
    let file_checks          = {};
    let onfido,
        $button,
        $submit_status,
        $submit_table;

    const getOnfidoServiceToken = () => new Promise((resolve, reject) => {
        const onfido_cookie = Cookies.get('onfido_token');
        if (onfido_cookie) {
            resolve(onfido_cookie);
        } else {
            BinarySocket.send({
                service_token: 1,
                service      : 'onfido',
            }).then((response) => {
                if (response.error) reject(Error(response.error.message));
                const token = response.service_token.token;
                resolve(token);
                const in_90_minutes = 1 / 16;
                Cookies.set('onfido_token', token, {
                    expires: in_90_minutes,
                    secure : true,
                });
            });

        }
    });

    const initOnfido = async () => {
        $('#onfido').setVisibility(1);
        try {
            const sdk_token = await getOnfidoServiceToken();
            onfido = Onfido.init({
                containerId: 'onfido',
                language   : {
                    locale : getLanguage().toLowerCase() || 'en',
                    /*
                        TODO: will move to steps after this issue resolved
                        https://github.com/onfido/onfido-sdk-ui/issues/391
                    */
                    phrases: { welcome: { next_button: localize('Verify identity') } },
                },
                token     : sdk_token,
                useModal  : false,
                onComplete: handleComplete,
                steps     : [
                    {
                        type   : 'welcome',
                        options: {
                            title       : localize('Verify it\'s you'),
                            nextButton  : localize('Submit button'),
                            descriptions: [
                                localize('Please verify your identity. This will only take a couple of minutes.'),
                            ],
                        },
                    },
                    'document',
                    'face',
                ],
            });
            $('#authentication_loading').setVisibility(0);
        } catch (err) {
            $('#error_occured').setVisibility(1);
            $('#authentication_loading').setVisibility(0);
        }
    };

    const handleComplete = () => {
        BinarySocket.send({ reset_password: 1, loginid: Client.get('loginid') }).then(() => {
            onfido.tearDown();
            $('#upload_complete').setVisibility(1);
        });
    };

    const init = () => {
        file_checks    = {};
        $submit_status = $('.submit-status');
        $submit_table  = $submit_status.find('table tbody');

        // Setup accordion
        $('.files').accordion({
            heightStyle: 'content',
            collapsible: true,
            active     : false,
        });
        // Setup Date picker
        $('.date-picker').datepicker({
            dateFormat : 'yy-mm-dd',
            changeMonth: true,
            changeYear : true,
            minDate    : '+6m',
        });

        $('.file-picker').on('change', onFileSelected);
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

    const showButtonLoading = () => {
        if ($button.length && !$button.find('.barspinner').length) {
            const $btn_text = $('<span/>', { text: $button.find('span').text(), class: 'invisible' });
            showLoadingImage($button.find('span'), 'white');
            $button.find('span').append($btn_text);
        }
    };

    const removeButtonLoading = () => {
        if ($button.length && $button.find('.barspinner').length) {
            $button.find('>span').html($button.find('>span>span').text());
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

    const processFiles = (files) => {
        const uploader = new DocumentUploader({ connection: BinarySocket.get() }); // send 'debug: true' here for debugging
        let idx_to_upload     = 0;
        let is_any_file_error = false;

        compressImageFiles(files).then((files_to_process) => {
            readFiles(files_to_process).then((processed_files) => {
                processed_files.forEach((file) => {
                    if (file.message) {
                        is_any_file_error = true;
                        showError(file);
                    }
                });
                const total_to_upload = processed_files.length;
                if (is_any_file_error || !total_to_upload) {
                    removeButtonLoading();
                    enableDisableSubmit();
                    return; // don't start submitting files until all front-end validation checks pass
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

    const compressImageFiles = (files) => {
        const promises = [];
        files.forEach((f) => {
            const promise = new Promise((resolve) => {
                if (isImageType(f.file.name)) {
                    const $status = $submit_table.find(`.${f.class} .status`);
                    const $filename = $submit_table.find(`.${f.class} .filename`);
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

    const onErrorResolved = (error_field, class_name, reverse_class_name) => {
        const id = error_field ? `${error_field}_${class_name.match(/\d+/)[0]}` : reverse_class_name;
        $(`#${id}`).one('input change', () => {
            $(`label[for=${class_name}]`).removeClass('error');
            enableDisableSubmit();
        });
    };

    // Validate user input
    const validate = (file) => {
        const required_docs = ['passport', 'proofid', 'driverslicense'];
        const doc_name = {
            passport      : localize('Passport'),
            proofid       : localize('Identity card'),
            driverslicense: localize('Driving licence'),
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
            && !(isIdentificationNoExpiry(Client.get('residence')) && file.documentType === 'proofid')
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

    const showSuccess = () => {
        BinarySocket.send({ get_account_status: 1 }, { forced: true }).then(() => {
            Header.displayAccountStatus();
        });
        setTimeout(() => {
            removeButtonLoading();
            $button.setVisibility(0);
            $('.submit-status').setVisibility(0);
            $('#pending_poa').setVisibility(1);
        }, 3000);
    };

    const hideSuccess = () => {
        if ($button) {
            $button.setVisibility(1);
        }
        $('#pending_poa').setVisibility(0);
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

    const initTab = () => {
        TabSelector.onLoad();
    };

    const getAuthenticationStatus = () => new Promise((resolve) => {
        BinarySocket.wait('get_account_status').then(() => {
            const authentication_response = State.getResponse('get_account_status.authentication');
            resolve(authentication_response);
        });
    });

    const initAuthentication = async () => {
        const authentication_status = await getAuthenticationStatus();
        if (!authentication_status || authentication_status.error) {
            $('#error_occured').setVisibility(1);
            return;
        }
        const { identity, document } = authentication_status;

        if (!identity.further_resubmissions_allowed) {
            switch (identity.status) {
                case 'none':
                    initOnfido();
                    break;
                case 'pending':
                    $('#upload_complete').setVisibility(1);
                    break;
                case 'rejected':
                    $('#unverified').setVisibility(1);
                    break;
                case 'verified':
                    $('#verified').setVisibility(1);
                    break;
                case 'suspected':
                    $('#unverified').setVisibility(1);
                    break;
                default:
                    break;
            }
        } else {
            initOnfido();
        }
        switch (document.status) {
            case 'none': {
                init();
                $('#not_authenticated').setVisibility(1);
                const language            = getLanguage();
                const language_based_link = ['ID', 'RU', 'PT'].includes(language) ? `_${language}` : '';
                const $not_authenticated  = $('#not_authenticated');
                let link = Url.urlForCurrentDomain(`https://marketing.binary.com/authentication/Authentication_Process${language_based_link}.pdf`);

                $not_authenticated.setVisibility(1);

                if (Client.isAccountOfType('financial')) {
                    $('#not_authenticated_financial').setVisibility(1);
                    link = Url.urlForCurrentDomain('https://marketing.binary.com/authentication/MF_Authentication_Process.pdf');
                }

                $not_authenticated.find('.learn_more').setVisibility(1).find('a').attr('href', link);

                if (isIdentificationNoExpiry(Client.get('residence'))) {
                    $('#expiry_datepicker_proofid').setVisibility(0);
                    $('#exp_date_2').datepicker('setDate', '2099-12-31');
                }
                break;
            }
            case 'pending':
                $('#pending_poa').setVisibility(1);
                break;
            case 'rejected':
                $('#unverified_poa').setVisibility(1);
                break;
            case 'suspected':
                $('#unverified_poa').setVisibility(1);
                break;
            case 'verified':
                $('#verified_poa').setVisibility(1);
                break;
            default:
                break;
        }
        $('#authentication_loading').setVisibility(0);
    };

    const onLoad = () => {
        initTab();
        initAuthentication();
    };

    const onUnload = () => {
        TabSelector.onUnload();
    };

    return {
        onLoad,
        onUnload,
    };
})();

module.exports = Authenticate;
