const urlFor       = require('../binary/base/url').urlFor;
const Client       = require('../binary/base/client');
const jpClient     = require('../binary/common_functions/country_base').jpClient;
const BinarySocket = require('../binary/websocket_pages/socket');

const AffiliatePopup = (() => {
    'use strict';

    const container_id = 'affiliate_disclaimer_popup';

    const show = () => {
        if (Client.isLoggedIn()) return;
        BinarySocket.wait('website_status').then((response) => {
            if ((jpClient() || response.website_status.clients_country === 'jp')) {
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
    };

    return {
        show: show,
    };
})();

module.exports = AffiliatePopup;
