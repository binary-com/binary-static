const getLanguage  = require('../base/language').get;
const urlForStatic = require('../base/url').urlForStatic;
const loadCSS      = require('../../lib/loadCSS').loadCSS;
const loadJS       = require('../../lib/loadJS').loadJS;

const Contact = (() => {
    'use strict';

    const onLoad = () => {
        $('#faq_url').attr('href', 'https://binary.desk.com/customer/' + getLanguage() + '/portal/articles');
        displayCsContacts();
        showLiveChatIcon();
    };

    const displayCsContacts = () => {
        $('.contact-content').on('change', '#cs_telephone_number', function() {
            const val = $(this).val().split(',');
            $('#display_cs_telephone').html(val[0] + (val.length > 1 ? '<br />' + val[1] : ''));
        });
    };

    const showLiveChatIcon = () => {
        if (typeof DESK === 'undefined') {
            loadCSS('https://d3jyn100am7dxp.cloudfront.net/assets/widget_embed_191.cssgz?1367387331');
            loadJS('https://d3jyn100am7dxp.cloudfront.net/assets/widget_embed_libraries_191.jsgz?1367387332');
        }

        const desk_load = setInterval(() => {
            if (typeof DESK !== 'undefined') {
                renderDeskWidget();
                changeChatIcon();
                clearInterval(desk_load);
            }
        }, 80);
    };

    const renderDeskWidget = () => {
        new DESK.Widget({
            version    : 1,
            site       : 'binary.desk.com',
            port       : '80',
            type       : 'chat',
            id         : 'live-chat-icon',
            displayMode: 0, // 0 for popup, 1 for lightbox
            features   : {
                offerAlways                : true,
                offerAgentsOnline          : false,
                offerRoutingAgentsAvailable: false,
                offerEmailIfChatUnavailable: false,
            },
            fields: {
                ticket: {
                        // desc: &#x27;&#x27;,
                        // labels_new: &#x27;&#x27;,
                        // priority: &#x27;&#x27;,
                        // subject: &#x27;&#x27;,
                        // custom_loginid: &#x27;&#x27;
                },
                interaction: {
                        // email: &#x27;&#x27;,
                        // name: &#x27;&#x27;
                },
                chat: {
                        // subject: ''
                },
                customer: {
                        // company: &#x27;&#x27;,
                        // desc: &#x27;&#x27;,
                        // first_name: &#x27;&#x27;,
                        // last_name: &#x27;&#x27;,
                        // locale_code: &#x27;&#x27;,
                        // title: &#x27;&#x27;,
                        // custom_loginid: &#x27;&#x27;
                },
            },
        }).render();
    };

    const changeChatIcon = () => {
      // desk.com change icon - crude way
        if ($('#live-chat-icon').length > 0) {
            let timer = null;
            const image_url = urlForStatic('images/pages/contact/chat-icon.svg');
            const updateIcon = () => {
                const desk_widget = $('.a-desk-widget');
                const image_str = desk_widget.css('background-image');
                if (image_str) {
                    desk_widget.css({
                        'background-image': `url("${image_url}")`,
                        'background-size' : 'contain',
                        'min-width'       : 50,
                        'min-height'      : 50,
                        width             : 'auto',
                    });

                    if (image_str.match(/live-chat-icon/g)) {
                        clearInterval(timer);
                    }
                }
                desk_widget.removeAttr('onmouseover onmouseout');
            };
            timer = setInterval(updateIcon, 500);
        }
    };

    return {
        onLoad: onLoad,
    };
})();

module.exports = Contact;
