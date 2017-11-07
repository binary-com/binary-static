const BinarySocket     = require('../../../socket');
const BinaryPjax       = require('../../../../base/binary_pjax');
const State            = require('../../../../base/storage').State;
const getPropertyValue = require('../../../../base/utility').getPropertyValue;
const Client           = require('../../../../base/client');


const professionalClient = (() => {
    let is_in_page = false;

    const onLoad = () => {
        BinarySocket.wait('get_account_status').then((response) => {
            if (/professional_requested|professional/.test(getPropertyValue(response, ['get_account_status', 'status']))) {
                BinaryPjax.loadPreviousUrl();
                return;
            }
            init(Client.isAccountOfType('financial'), true, Client.get('is_ico_only'));
        });
    };

    const init = (is_financial, is_page, is_ico_only) => {
        is_in_page = !!is_page;
        BinarySocket.wait('landing_company').then(() => { populateProfessionalClient(is_financial, is_ico_only); });
    };

    const populateProfessionalClient = (is_financial, is_ico_only) => {
        const financial_company = State.getResponse('landing_company.financial_company.shortcode');
        if ((!/costarica|maltainvest/.test(financial_company) ||    // limited to these landing companies
            (financial_company === 'maltainvest' && !is_financial)) && !is_ico_only) { // then it's not upgrading to financial
            if(is_in_page) {
                BinaryPjax.loadPreviousUrl();
            }
            return;
        }
        const $container        = $('#fs_professional');
        const $chk_professional = $container.find('#chk_professional');
        const $info             = $container.find('#professional_info');
        const $popup_contents   = $container.find('#popup');
        const popup_selector    = '#professional_popup';

        $container.find('#professional_info_toggle').off('click').on('click', function() {
            $(this).toggleClass('open');
            $info.slideToggle();
        });

        $chk_professional.on('change', () => {
            if ($chk_professional.is(':checked') && !$(popup_selector).length) {
                $('body').append($('<div/>', { id: 'professional_popup', class: 'lightbox' }).append($popup_contents.clone().setVisibility(1)));

                $(popup_selector).find('#btn_accept, #btn_decline').off('click').on('click dblclick', function() {
                    if ($(this).attr('data-value') === 'decline') {
                        $chk_professional.prop('checked', false);
                    }
                    $('#professional_popup').remove();
                });
            }
        });

        if (financial_company === 'maltainvest') {
            $container.find('#show_financial').setVisibility(1);
        }

        $container.setVisibility(1);

        if (is_in_page) {
            $('#loading').remove();
            $('#frm_professional')
                .off('submit')
                .on('submit', () => {
                    if ($chk_professional.is(':checked')) {
                        // TODO: add the call to send when back-end adds it
                        BinarySocket.send({}).then((response) => {
                            if (response.error) {
                                $('#form_message').text(response.error.message);
                            } else {
                                BinaryPjax.loadPreviousUrl();
                            }
                        });
                    }
                })
                .setVisibility(1);

        }
    };

    return {
        onLoad,
        init,
    };
})();

module.exports = professionalClient;
