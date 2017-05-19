const localize           = require('../../base/localize').localize;
const urlForStatic       = require('../../base/url').urlForStatic;
const loadCSS            = require('../../../lib/loadCSS').loadCSS;
const loadJS             = require('../../../lib/loadJS').loadJS;

const DeskWidget = (() => {
    const showDeskLink = (style, selector) => {
        if (typeof DESK === 'undefined') {
            loadCSS('https://d3jyn100am7dxp.cloudfront.net/assets/widget_embed_191.cssgz?1367387331');
            loadJS('https://d3jyn100am7dxp.cloudfront.net/assets/widget_embed_libraries_191.jsgz?1367387332');
        }

        const desk_load = setInterval(() => {
            if (typeof DESK !== 'undefined') {
                renderDeskWidget();
                removeChatIcon(style, selector);
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
            id         : 'desk-link',
            displayMode: 0, // 0 for popup, 1 for lightbox
            features   : {
                offerAlways                : true,
                offerAgentsOnline          : false,
                offerRoutingAgentsAvailable: false,
                offerEmailIfChatUnavailable: false,
            },
        }).render();
    };

    const removeChatIcon = (style, selector) => {
        // desk.com change icon - crude way
        let timer = null;
        const image_url = urlForStatic('images/pages/contact/chat-icon.svg');
        const updateIcon = () => {
            const $desk_widget = $('.a-desk-widget');
            const image_str = $desk_widget.css('background-image');
            if (image_str) {
                if (style) {
                    $desk_widget.css({
                        'background-image': `url("${image_url}")`,
                        'background-size' : 'contain',
                        'min-width'       : 50,
                        'min-height'      : 50,
                        width             : 'auto',
                    });
                } else {
                    $desk_widget.removeAttr('style')
                        .text(localize('Contact us via live chat'));
                }

                $desk_widget.attr('href', `${'java'}${'script:;'}`);

                if (image_str.match(/(none|chat-icon)/g)) {
                    clearInterval(timer);
                    $('#loading').remove();
                    $(selector).setVisibility(1);
                }
            }
            $desk_widget.removeAttr('onmouseover onmouseout');
        };
        timer = setInterval(updateIcon, 500);
    };

    return {
        showDeskLink: showDeskLink,
    };
})();

module.exports = DeskWidget;
