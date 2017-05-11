const BinarySocket       = require('../socket');
const BinaryPjax         = require('../../base/binary_pjax');
const Client             = require('../../base/client');
const Header             = require('../../base/header');
const defaultRedirectUrl = require('../../base/url').defaultRedirectUrl;
const urlFor             = require('../../base/url').urlFor;
const template           = require('../../base/utility').template;

const TNCApproval = (() => {
    'use strict';

    const onLoad = () => {
        requiresTNCApproval($('#btn_accept'), display, null, true);
    };

    const display = () => {
        const landing_company = Client.get('landing_company_fullname');
        if (!landing_company) return;

        const $container = $('#tnc_container');
        const $tnc_msg   = $container.find('#tnc_message');
        $tnc_msg.html(template($tnc_msg.html(), [
            landing_company,
            urlFor(Client.get('residence') === 'jp' ? 'terms-and-conditions-jp' : 'terms-and-conditions'),
        ]));
        $container.find('#tnc_loading').remove();
        $container.find('#tnc_approval').setVisibility(1);
    };

    const requiresTNCApproval = ($btn, funcDisplay, onSuccess, redirect_anyway) => {
        BinarySocket.wait('website_status', 'get_settings').then(() => {
            if (!Client.shouldAcceptTnc()) {
                redirectBack(redirect_anyway);
                return;
            }

            funcDisplay();

            $btn.click((e) => {
                e.preventDefault();
                e.stopPropagation();
                BinarySocket.send({ tnc_approval: '1' }, { forced: true }).then((response) => {
                    if (response.error) {
                        $('#err_message').html(response.error.message).setVisibility(1);
                    } else {
                        BinarySocket.send({ get_settings: 1 }, { forced: true }).then(() => {
                            Header.displayAccountStatus();
                        });
                        redirectBack(redirect_anyway);
                        if (typeof onSuccess === 'function') {
                            onSuccess();
                        }
                    }
                });
            });
        });
    };

    const redirectBack = (redirect_anyway) => {
        if (redirect_anyway) {
            setTimeout(() => {
                BinaryPjax.load(defaultRedirectUrl());
            }, 500);
        }
    };

    return {
        onLoad             : onLoad,
        requiresTNCApproval: requiresTNCApproval,
    };
})();

module.exports = TNCApproval;
