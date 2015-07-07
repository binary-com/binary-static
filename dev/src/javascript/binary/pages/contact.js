var cs_is_available =  function() {
    var date = new Date();

    //More accurate sync'd time, when available
    if(page.header.time_now) {
        date = new Date(page.header.time_now);
    }

    //Is it weekend? Sunday = 0 and Saturday  = 6
    if(date.getUTCDay() === 0 || date.getUTCDay() === 6) {
        return false;
    }

    var available = false;
    var cs_times = page.settings.get('cs_times');
    var cs_time = cs_times.length;
    while(cs_time--) {
        var start_hour = parseInt(cs_times[cs_time]['start']);
        var end_hour = parseInt(cs_times[cs_time]['end']);
        if(date.getUTCHours() >= start_hour && date.getUTCHours() <= end_hour) { 
            available = true;
        }
    }
    return available;
};

var change_chat_icon = function () {
  // desk.com change icon - crude way
  var len = $('#live-help-button').length;
  if( len > 0 ) {
      var timer = null;
      var updateIcon =  function () {
          var image_link = page.settings.get('image_link');
          var desk_widget = $('.a-desk-widget');
          var image_str = desk_widget.css('background-image');
          if(image_str) {
              desk_widget.css({
                  'background-image': 'url("' + image_link['livechaticon'] + '")',
                  'width': 146,
                  'height' : 26
              });
              desk_widget.hover(function() {
                  $(this).css({
                      'background': 'url("' + image_link['livechaticon'] + '") no-repeat scroll 0 0'
                  });
              });

              if(image_str.match(/live-chat-icon/g)){
                  clearInterval(timer);
              }
          }
      };
      timer = setInterval(updateIcon, 500);
  }
};

var render_desk_widget = function() {
       new DESK.Widget({ 
                version: 1, 
                site: 'binary.desk.com', 
                port: '80', 
                type: 'chat', 
                id: 'live-help-button',
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

var add_qq = function() {
    $('#live-help-button').html('<a target="_blank" href="http://wpa.qq.com/msgrd?v=3&uin=2597352559&site=qq&menu=yes" id="qq_chat_icon"><span>Live Chat</span></a>');
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

var fill_contact_us = function(country) {
    var loginid = page.client.loginid;
    if(loginid) {
        $('#login_id').val(loginid);
    }

    var name = page.client.name;
    if(name) {
        $('#Name2').val(name);
    }

    var email = page.client.email;
    if(email) {
        $('#Email2').val(email);
    }

    $('#country').on('change', function() {
        var tel = $('#phone');
        if (!tel.val() || tel.val().length < 6) {
            var country = $(this).val();
            var idd_code = idd_codes[country];
            tel.val(idd_code ? '+' + idd_code : '');
        }
    });

    var idd_code = idd_codes[country];
    $('#country').val(country).change();

    var phone = page.client.phone;
    if(phone) {
        $('#phone').val(phone);
    } else {
        $('#country').change();
    }
};


pjax_config_page('contact', function() {
    return {
        onLoad: function() {
            get_user_country(function() {
                    var restricted_countries = new RegExp(page.settings.get('restricted_countries'));
                    if(cs_is_available() && !restricted_countries.test(this.country)) {
                        $('.live-help').removeClass('invisible');
                        $('#telephone_callback').removeClass('invisible');
                    }

                    fill_contact_us(this.country);
            });
        },
    };
});

onLoad.queue_if_id_present(function() {
    if (cs_is_available()) {
        show_live_chat_icon();
    }
}, 'live-help-button');
