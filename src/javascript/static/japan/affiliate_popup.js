const urlFor       = require('../../_common/url').urlFor;
const Client       = require('../../app/base/client');
const BinarySocket = require('../../app/base/socket');
const jpClient     = require('../../app/common/country_base').jpClient;

const AffiliatePopup = (() => {
    const container_id = 'affiliate_disclaimer_popup';

    const show = () => {
        if (Client.isLoggedIn() || $(`#${container_id}`).length) return;
        BinarySocket.wait('website_status').then((response) => {
            if ((jpClient() || response.website_status.clients_country === 'jp')) {
                $.ajax({
                    url     : urlFor('affiliate_disclaimer'),
                    dataType: 'html',
                    method  : 'GET',
                    success : (contents) => {
                        if ($(`#${container_id}`).length) return;
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
        show,
    };
})();

module.exports = AffiliatePopup;
