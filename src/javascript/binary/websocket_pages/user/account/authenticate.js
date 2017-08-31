const Client       = require('../../../base/client');
const BinarySocket = require('../../socket');
const upload = require('binary-document-uploader');

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

        $('.file-picker').on('change', (event) => {
            if (!event.target.files) return;
            // Change submit button state
            show_submit();
            const file_name = event.target.files[0].name || '';
            const display_name = file_name.length > 10 ? `${file_name.slice(0, 5)}..${file_name.slice(-5)}` : file_name;
            $(event.target).parent()
                .find('label')
                .off('click')
                // Prevent opening file selector.
                .on('click', (e) => {
                    if ($(e.target).is('img.remove')) event.preventDefault();
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
                    show_submit();
                });
        });

        /**
         * Enables the submit button if any file is selected, also adds the event handler for the button.
         * Disables the button if it already is enabled.
         */
        const show_submit = () => {
            let file_selected = false;
            const $ele = $('#authentication-message > div').not('.invisible');
            const $button = $ele.find('#btn_submit');
            const $files = $ele.find('input[type="file"]');

            // Check if any files is selected or not.
            $files.each((i, e) => {
                if (e.files && e.files.length) {
                    file_selected = true;
                }
            });

            if (file_selected) {
                if ($button.hasClass('button')) return;
                $button.removeClass('button-disabled')
                    .addClass('button')
                    .click(() => {
                        const files = [];
                        $files.each((i, e) => {
                            if (e.files && e.files.length) {
                                file_selected = true;
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
                        process_files(files);
                    });
            } else {
                if ($button.hasClass('button-disabled')) return;
                $button.off('click')
                    .removeClass('button')
                    .addClass('button-disabled');
            }
        };

        const process_files = (files) => {
            const promises = [];
            read_files(files).then((objects) => {
                objects.forEach(
                    obj => promises.push(upload(obj)),
                );
                Promise.all(promises)
                    .then(() => console.log('Success'))
                    .catch(e => console.log(e));
            }).catch((e) => {
                console.error(e);
            });
        };

        // Returns promise array
        const read_files = (files) => {
            const promises = [];
            const ws = BinarySocket.get();
            console.log(ws);
            files.forEach((f) => {
                const fr = new FileReader();
                const promise = new Promise((resolve, reject) => {
                    fr.onload = () => {
                        const format = f.file.type.split('/')[1];
                        const obj = {
                            connection    : ws,
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
    };

    return {
        onLoad,
    };
})();

module.exports = Authenticate;
