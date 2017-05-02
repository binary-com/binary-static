const urlFor   = require('../binary/base/url').urlFor;
const Client   = require('../binary/base/client');
const jpClient = require('../binary/common_functions/country_base').jpClient;

const AffiliatePopup = (() => {
    'use strict';

    const confirm_key  = 'affiliate_disclaimer_confirmed';
    const container_id = 'affiliate_disclaimer_popup';

    const show = () => {
        BinarySocket.wait('website_status').then((response) => {
            if (!Client.get(confirm_key) && (jpClient() || response.website_status.clients_country === 'jp')) {
                $.ajax({
                    url     : urlFor('affiliate_disclaimer'),
                    dataType: 'html',
                    method  : 'GET',
                    success : (contents) => {
                        $('body').append($('<div/>', { id: container_id, class: 'lightbox' })
                            .append($('<div/>').append($(contents))));
                        $('#btn_affiliate_proceed').off('click').on('click', close);
                    },
                });
            }
        });
    };

    const close = () => {
        $(`#${container_id}`).remove();
        Client.set(confirm_key, 1);
    };

    return {
        show: show,
    };
})();

module.exports = AffiliatePopup;
