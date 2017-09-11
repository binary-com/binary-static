const Client       = require('../../../base/client');
const BinarySocket = require('../../socket');
const DocumentUploader = require('binary-document-uploader');
const showLoadingImage = require('../../../base/utility').showLoadingImage;

const Authenticate = (() => {
    const onLoad = () => {
        BinarySocket.send({ get_account_status: 1 }).then((response) => {
            if (response.error) {
                $('#error_message').setVisibility(1).text(response.error.message);
            } else {
                const get_account_status = response.get_account_status;
                const should_authenticate = +get_account_status.prompt_client_to_authenticate;
                if (should_authenticate) {
                    const status = get_account_status.status;
                    if (!/authenticated/.test(status)) {
                        $(`#not_authenticated${Client.isAccountOfType('financial') ? '_financial' : ''}`).setVisibility(1);
                        init();
                    } else if (!/age_verification/.test(status)) {
                        $('#needs_age_verification').setVisibility(1);
                    }
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
        const date = new Date();
        $('.date-picker').datepicker({
            dateFormat : 'yy-mm-dd',
            changeMonth: true,
            changeYear : true,
            minDate    : date,
        });

        // Submit button
        let $button;

        $('.file-picker').on('change', e => onFileSelected(e));

        /**
         * Listens for file changes.
         * @param {*} event
         */
        const onFileSelected = (event) => {
            if (!event.target.files) return;
            // Change submit button state
            showSubmit();
            const file_name = event.target.files[0].name || '';
            const display_name = file_name.length > 10 ? `${file_name.slice(0, 5)}..${file_name.slice(-5)}` : file_name;
            $(event.target).parent()
                .find('label')
                .off('click')
                // Prevent opening file selector.
                .on('click', (e) => {
                    if ($(e.target).is('img.remove')) e.preventDefault();
                })
                .text(display_name)
                .append($('<img/>', { class: 'remove' }))
                .find('.remove')
                .click(() => {
                    const default_text = event.target.id.split('_')[0]
                        .replace(/^\w/, w => w.toUpperCase());
                    $(event.target).val(''); // Remove previously selected file.
                    $(event.target).parent().find('label').text(default_text)
                        .append($('<img/>', { class: 'add' }));
                    // Change submit button state
                    showSubmit();
                });
        };

        /**
         * Enables the submit button if any file is selected, also adds the event handler for the button.
         * Disables the button if it no files are selected.
         */
        const showSubmit = () => {
            let file_selected = false;
            const $ele = $('#authentication-message > div').not('.invisible');
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
                $button.off('click')
                    .removeClass('button')
                    .addClass('button-disabled');
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
                    const id = $e.attr('id');
                    const type = `${($e.attr('data-type') || '').replace(/\s/g, '_').toLowerCase()}_${id.split('_')[0]}`;
                    const $inputs = $e.parent().parent().parent().find('input[type="text"]');
                    const file_obj = {
                        file: e.files[0],
                        type: type,
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
            const ws = BinarySocket.get();
            const config = {
                connection: ws,
            };
            const uploader = new DocumentUploader(config);

            readFiles(files).then((objects) => {
                objects.forEach(obj => promises.push(uploader.upload(obj)));
                Promise.all(promises)
                    .then(() => showSuccess())
                    .catch(showError);
            }).catch((e) => {
                console.error(e);
            });
        };

        // Returns file promise.
        const readFiles = (files) => {
            const promises = [];
            files.forEach((f) => {
                const fr = new FileReader();
                const promise = new Promise((resolve, reject) => {
                    fr.onload = () => {
                        const format = (f.file.type.split('/')[1]).toUpperCase();
                        const obj = {
                            filename      : f.file.name,
                            buffer        : fr.result,
                            documentType  : f.type,
                            documentFormat: format,
                        };
                        obj.documentId = f.id_number || '';
                        obj.expirationDate = f.exp_date || '';
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

        const showError = (e) => {
            console.log(e);
            const $error = $('.error-msg');
            const message = e.message || e.message_to_client;
            enableButton();
            $error.removeClass('invisible').text(message);
            setTimeout(() => { $error.empty().addClass('invisible'); }, 3000);
        };

        const showSuccess = () => {
            $('#authentication-message > div').not('.invisible').addClass('invisible');
            $('#success-message').removeClass('invisible');
        };
    };

    return {
        onLoad,
    };
})();

module.exports = Authenticate;
