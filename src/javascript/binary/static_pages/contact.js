const email_rot13    = require('../common_functions/common_functions').email_rot13;
const loadCSS        = require('../../lib/loadCSS').loadCSS;
const loadJS         = require('../../lib/loadJS').loadJS;
const getLanguage    = require('../base/language').getLanguage;
const urlForStatic   = require('../base/url').urlForStatic;

const Contact = (function() {
    const onLoad = function() {
        $('#faq_url').attr('href', 'https://binary.desk.com/customer/' + getLanguage() + '/portal/articles');
        display_cs_contacts();
        show_live_chat_icon();
    };

    const display_cs_contacts = function() {
        $('.contact-content').on('change', '#cs_telephone_number', function () {
            const val = $(this).val().split(',');
            $('#display_cs_telephone').html(val[0] + (val.length > 1 ? '<br />' + val[1] : ''));
        });
        $('#cs_contact_eaddress').html(email_rot13('<n uers=\"znvygb:fhccbeg@ovanel.pbz\" ery=\"absbyybj\">fhccbeg@ovanel.pbz</n>'));
    };

    const show_live_chat_icon = function() {
        if (typeof DESK === 'undefined') {
            loadCSS('https://d3jyn100am7dxp.cloudfront.net/assets/widget_embed_191.cssgz?1367387331');
            loadJS('https://d3jyn100am7dxp.cloudfront.net/assets/widget_embed_libraries_191.jsgz?1367387332');
        }

        const desk_load = setInterval(function() {
            if (typeof DESK !== 'undefined') {
                render_desk_widget();
                change_chat_icon();
                clearInterval(desk_load);
            }
        }, 80);
    };

    const render_desk_widget = function() {
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

    const change_chat_icon = function () {
      // desk.com change icon - crude way
        const len = $('#live-chat-icon').length;
        if (len > 0) {
            let timer = null;
            const updateIcon =  function () {
                const image_url = urlForStatic('images/pages/contact/chat-icon.svg');
                const desk_widget = $('.a-desk-widget');
                const image_str = desk_widget.css('background-image');
                if (image_str) {
                    desk_widget.css({
                        'background-image': 'url("' + image_url + '")',
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
