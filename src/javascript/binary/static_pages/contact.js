var email_rot13 = require('../common_functions/common_functions').email_rot13;
var loadCSS = require('../../lib/loadCSS').loadCSS;
var loadJS  = require('../../lib/loadJS').loadJS;

var Contact = (function(){
    var init = function() {
        $('#faq_url').attr('href', 'https://binary.desk.com/customer/' + page.language() + "/portal/articles");
        display_cs_contacts();
        show_live_chat_icon();
    };

    var display_cs_contacts = function () {
        $('.contact-content').on("change", '#cs_telephone_number', function () {
            var val = $(this).val().split(',');
            $('#display_cs_telephone').html(val[0] + (val.length > 1 ? '<br />' + val[1] : ''));
        });
        $('#cs_contact_eaddress').html(email_rot13("<n uers=\"znvygb:fhccbeg@ovanel.pbz\" ery=\"absbyybj\">fhccbeg@ovanel.pbz</n>"));
    };

    var show_live_chat_icon = function() {
        if(typeof DESK === 'undefined') {
            loadCSS("https://d3jyn100am7dxp.cloudfront.net/assets/widget_embed_191.cssgz?1367387331");
            loadJS("https://d3jyn100am7dxp.cloudfront.net/assets/widget_embed_libraries_191.jsgz?1367387332");
        }

        var desk_load = setInterval(function() {
            if(typeof DESK !== "undefined") {
                render_desk_widget();
                change_chat_icon();
                clearInterval(desk_load);
            }
        }, 80);
    };

    var render_desk_widget = function() {
           new DESK.Widget({
                    version: 1,
                    site: 'binary.desk.com',
                    port: '80',
                    type: 'chat',
                    id: 'live-chat-icon',
                    displayMode: 0,  //0 for popup, 1 for lightbox
                    features: {
                            offerAlways: true,
                            offerAgentsOnline: false,
                            offerRoutingAgentsAvailable: false,
                            offerEmailIfChatUnavailable: false
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
                                    //subject: ''
                            },
                            customer: {
                                    // company: &#x27;&#x27;,
                                    // desc: &#x27;&#x27;,
                                    // first_name: &#x27;&#x27;,
                                    // last_name: &#x27;&#x27;,
                                    // locale_code: &#x27;&#x27;,
                                    // title: &#x27;&#x27;,
                                    // custom_loginid: &#x27;&#x27;
                            }
                    }
            }).render();
    };

    var change_chat_icon = function () {
      // desk.com change icon - crude way
      var len = $('#live-chat-icon').length;
      if( len > 0 ) {
          var timer = null;
          var updateIcon =  function () {
              var image_url = page.url.url_for_static('images/pages/contact/chat-icon.svg');
              var desk_widget = $('.a-desk-widget');
              var image_str = desk_widget.css('background-image');
              if(image_str) {
                  desk_widget.css({
                      'background-image': 'url("' + image_url + '")',
                      'background-size': 'contain',
                      'min-width': 50,
                      'min-height': 50,
                      'width': 'auto'
                  });

                  if(image_str.match(/live-chat-icon/g)){
                      clearInterval(timer);
                  }
              }
              desk_widget.removeAttr('onmouseover onmouseout');
          };
          timer = setInterval(updateIcon, 500);
      }
    };

    return {
        init: init,
    };
})();

module.exports = {
    Contact: Contact,
};
