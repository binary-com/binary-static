var sidebar_scroll = function(elm_selector) {
    elm_selector.on('click', '#sidebar-nav li', function() {
        var clicked_li = $(this);
        $.scrollTo($('.section:eq(' + clicked_li.index() + ')'), 500);
        return false;
    }).addClass('unbind_later');

    if (elm_selector.size()) {
        // grab the initial top offset of the navigation
        var selector = elm_selector.find('.sidebar');
        var width = selector.width();
        var sticky_navigation_offset_top = selector.offset().top;
        // With thanks:
        // http://www.backslash.gr/content/blog/webdevelopment/6-navigation-menu-that-stays-on-top-with-jquery

        // our function that decides weather the navigation bar should have "fixed" css position or not.
        var sticky_navigation = function() {
            var scroll_top = $(window).scrollTop(); // our current vertical position from the top

            // if we've scrolled more than the navigation, change its position to fixed to stick to top,
            // otherwise change it back to relative
            if (scroll_top > sticky_navigation_offset_top) {
                selector.css({'position': 'fixed', 'top': 0, 'width': width});
            } else {
                selector.css({'position': 'relative'});
            }
        };

        //run our function on load
        sticky_navigation();

        var sidebar_nav = selector.find('#sidebar-nav');
        var length = elm_selector.find('.section').length;
        $(window).on('scroll', function() {
            // and run it again every time you scroll
            sticky_navigation();

            for (var i = 0; i < length; i++) {
                if ($(window).scrollTop() === 0 || $(this).scrollTop() >= $('.section:eq(' + i + ')').offset().top - 5) {
                    sidebar_nav.find('li').removeClass('selected');

                    if ($(window).scrollTop() === 0) {
                        // We're at the top of the screen, so highlight first nav item
                        sidebar_nav.find('li:first-child').addClass('selected');
                    } else if ($(window).scrollTop() + $(window).height() >= $(document).height()) {
                        // We're at bottom of screen so highlight last nav item.
                        sidebar_nav.find('li:last-child').addClass('selected');
                    } else {
                        sidebar_nav.find('li:eq(' + i + ')').addClass('selected');
                    }
                }
            }
        });
    }
};

var get_started_behaviour = function() {
    // Get Started behaviour:
    var update_active_subsection = function(to_show) {
        var fragment;
        var subsection = $('.subsection');
        subsection.addClass('hidden');
        to_show.removeClass('hidden');
        var nav_back = $('.subsection-navigation .back');
        var nav_next = $('.subsection-navigation .next');

        if (to_show.hasClass('first')) {
            nav_back.addClass('disabled');
            nav_next.removeClass('disabled');
        } else if (to_show.hasClass('last')) {
            nav_back.removeClass('disabled');
            nav_next.addClass('disabled');
        } else {
            nav_back.removeClass('disabled');
            nav_next.removeClass('disabled');
        }

        fragment = to_show.find('a[name]').attr('name').slice(0, -8);
        document.location.hash = fragment;

        return false;
    };
    var to_show;
    var nav = $('.get-started').find('.subsection-navigation');
    var fragment;
    var len = nav.length;

    if (len) {
        nav.on('click', 'a', function() {
            var button = $(this);
            if (button.hasClass('disabled')) {
                return false;
            }
            var now_showing = $('.subsection:not(.hidden)');
            var show = button.hasClass('next') ? now_showing.next('.subsection') : now_showing.prev('.subsection');
            return update_active_subsection(show);
        });

        fragment = (location.href.split('#'))[1];
        to_show = fragment ? $('a[name=' + fragment + '-section]').parent('.subsection') : $('.subsection.first');
        update_active_subsection(to_show);
    }
};


var get_ticker = function() {
    var ticker = $('#hometicker');
    if (ticker.size()) {
        $.ajax({ crossDomain: true, url: page.url.url_for('ticker'), async: true, dataType: "html" }).done(function(ticks) {
            ticker.html(ticks);
            ticker.find('ul').simplyScroll();
        });
    }
};

var Charts = function(charts) {
    window.open(charts, 'DetWin', 'width=580,height=710,scrollbars=yes,location=no,status=no,menubar=no');
};

var email_rot13 = function(str) {
    return str.replace(/[a-zA-Z]/g, function(c){return String.fromCharCode((c<="Z"?90:122)>=(c=c.charCodeAt(0)+13)?c:c-26);});
};

var display_cs_contacts = function () {
    $('.contact-content').on("change", '#cs_telephone_number', function () {
        var val = $(this).val();
        $('#display_cs_telephone').text(val);
    });
    $('#cs_contact_eaddress').html(email_rot13("<n uers=\"znvygb:fhccbeg@ovanel.pbz\" ery=\"absbyybj\">fhccbeg@ovanel.pbz</n>"));
};

var change_chat_icon = function () {
  // desk.com change icon - crude way
  var len = $('#live-chat-icon').length;
  if( len > 0 ) {
      var timer = null;
      var updateIcon =  function () {
          var image_link = page.settings.get('image_link');
          var desk_widget = $('.a-desk-widget');
          var image_str = desk_widget.css('background-image');
          if(image_str) {
              desk_widget.css({
                  'background-image': 'url("' + image_link['livechaticon'] + '")',
                  'background-size': 'contain',
                  'min-width': 50,
                  'min-height': 50,
                  'width': 'auto'
              });
              desk_widget.hover(function() {
                  $(this).css({
                      'background': 'url("' + image_link['livechaticon'] + '") no-repeat scroll 0 0',
                      'background-size': 'contain',
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

var display_career_email = function() {
    $("#hr_contact_eaddress").html(email_rot13("<n uers=\"znvygb:ue@ovanel.pbz\" ery=\"absbyybj\">ue@ovanel.pbz</n>"));
};

var get_residence_list = function() {
    var url = page.url.url_for('residence_list');
    $.getJSON(url, function(data) {
        var countries = [];
        $.each(data.residence, function(i, country) {
            var disabled = '';
            var selected = '';
            if (country.disabled) {
                disabled = ' disabled ';
            } else if (country.selected) {
                selected = ' selected="selected" ';
            }
            countries.push('<option value="' + country.value + '"' + disabled + selected + '>' + country.text + '</option>');
            $("#residence").html(countries.join(''));

            $('form#virtual-acc-form #btn_registration').removeAttr('disabled');
        });
    });
};

var on_input_password = function() {
    $('#chooseapassword').on('input', function() {
        $("#chooseapassword_2").css("visibility", "visible");
    });
};

var on_click_signup = function() {
    $('form#virtual-acc-form #btn_registration').on('click', function() {
        var pwd = $('#chooseapassword').val();
        var pwd_2 = $('#chooseapassword_2').val();
        var email = $('#Email').val();
        var residence = $('#residence').val();

        var error_msg = '';
        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(email)) {
            error_msg = text.localize('Invalid email address');
        } else if (pwd.length < 6 || pwd.length > 25 || pwd_2.length < 6 || pwd_2.length > 25) {
            error_msg = text.localize('Password length should be between 6 and 25 characters');
        } else if (pwd.length === 0 || pwd_2.length === 0 || !client_form.compare_new_password(pwd, pwd_2)) {
            error_msg = text.localize('The two passwords that you entered do not match.');
        } else if (email == pwd) {
            error_msg = text.localize('Your password cannot be the same as your email');
        } else if (residence.length === 0) {
            error_msg = text.localize('Please specify your country.');
        }

        if (error_msg.length > 0) {
            $('#signup_error').text(error_msg);
            $('#signup_error').removeClass('invisible');
            $('#signup_error').show();
            return false;
        }
        $('#virtual-acc-form').submit();
    });
};

function check_login_hide_signup() {
    if (page.client.is_logged_in) {
        $('#verify-email-form').remove();
        $('.break').attr('style', 'margin-bottom:1em');
    }
}

function hide_if_logged_in() {
    if (page.client.is_logged_in) {
        $('.client_logged_out').remove();
    }
}

// use function to generate elements and append them
// e.g. element is select and element to append is option
function appendTextValueChild(element, text, value){
    var option = document.createElement("option");

    option.text = text;
    option.value = value;
    element.appendChild(option);
}

// append numbers to a drop down menu, eg 1-30
function dropDownNumbers(select, startNum, endNum) {
    select.appendChild(document.createElement("option"));

    for (i = startNum; i <= endNum; i++){
        var option = document.createElement("option");
        option.text = i;
        option.value = i;
        select.appendChild(option);
    }

}

function dropDownMonths(select, startNum, endNum) {
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    select.appendChild(document.createElement("option"));
    for (i = startNum; i <= endNum; i++){
        var option = document.createElement("option");
        if (i <= '9') {
            option.value = '0' + i;
        } else {
            option.value = i;
        }

        for (j = i; j <= i; j++) {
            option.text = months[j-1];
        }

        select.appendChild(option);
    }
}

function generateBirthDate(days, months, year){
    //days
    dropDownNumbers(days, 1, 31);
    //months
    dropDownMonths(months, 1, 12);

    var currentYear = new Date().getFullYear();
    var startYear = currentYear - 100;
    var endYear = currentYear - 17;

    //years
    dropDownNumbers(year, startYear, endYear);
}

function isValidDate(day, month, year){
    // Assume not leap year by default (note zero index for Jan)
    var daysInMonth = [31,28,31,30,31,30,31,31,30,31,30,31];

    // If evenly divisible by 4 and not evenly divisible by 100,
    // or is evenly divisible by 400, then a leap year
    if ( ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0) ) {
        daysInMonth[1] = 29;
    }
    return day <= daysInMonth[--month];
}

function handle_residence_state_ws(){
  BinarySocket.init({
    onmessage: function(msg){
      var select;
      var response = JSON.parse(msg.data);
      if (response) {
        var type = response.msg_type;
        if (type === 'states_list'){
          select = document.getElementById('address-state');
          var states_list = response.states_list;
          if (states_list.length > 0){
            for (i = 0; i < states_list.length; i++) {
                appendTextValueChild(select, states_list[i].text, states_list[i].value);
            }
            select.parentNode.parentNode.setAttribute('style', 'display:block');
          }
        } else if (type === 'residence_list'){
          select = document.getElementById('residence-disabled') || document.getElementById('residence');
          var phoneElement   = document.getElementById('tel'),
              residenceValue = $.cookie('residence'),
              residence_list = response.residence_list;
          if (residence_list.length > 0){
            for (i = 0; i < residence_list.length; i++) {
              appendTextValueChild(select, residence_list[i].text, residence_list[i].value);
              if (phoneElement && residence_list[i].phone_idd && residenceValue === residence_list[i].value){
                phoneElement.value = '+' + residence_list[i].phone_idd;
              }
            }
            if (residenceValue){
                select.value = residenceValue;
            }
          }
        }
      }
    }
  });
}

function setResidenceWs(){
  BinarySocket.send({ residence_list: 1 });
}

//pass select element to generate list of states
function generateState(select) {
    appendTextValueChild(select, Content.localize().textSelect, '');
    BinarySocket.send({ states_list: $.cookie('residence') });
}

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

function replaceQueryParam(param, newval, search) {
    var regex = new RegExp("([?;&])" + param + "[^&;]*[;&]?");
    var query = search.replace(regex, "$1").replace(/&$/, '');

    return (query.length > 2 ? query + "&" : "?") + (newval ? param + "=" + newval : '');
}

if (page.language() === 'JA' && !$.cookie('MyJACookie')) {
  var str = window.location.search;
  str = replaceQueryParam('l', 'EN', str);
  window.location = window.location.pathname + str;
}

// returns true if internet explorer browser
function isIE() {
  return /(msie|trident|edge)/i.test(window.navigator.userAgent) && !window.opera;
}

// trim leading and trailing white space
function Trim(str){
  while(str.charAt(0) == (" ") ){str = str.substring(1);}
  while(str.charAt(str.length-1) ==" " ){str = str.substring(0,str.length-1);}
  return str;
}

//remove wrong json affiliate_tracking
if ($.cookie('affiliate_tracking')) {
  $.removeCookie('affiliate_tracking');
}

pjax_config_page('/$|/home', function() {
    return {
        onLoad: function() {
            on_input_password();
            on_click_signup();
            get_residence_list();
            get_ticker();
            check_login_hide_signup();
        }
    };
});

pjax_config_page('/why-us', function() {
    return {
        onLoad: function() {
            var whyus = $('.why-us');
            sidebar_scroll(whyus);
            hide_if_logged_in();
        },
        onUnload: function() {
            $(window).off('scroll');
        }
    };
});

pjax_config_page('/smart-indices', function() {
    return {
        onLoad: function() {
            sidebar_scroll($('.smart-indices'));
            if (page.url.location.hash !== "") {
              $('a[href="' + page.url.location.hash + '"]').click();
            }
        },
        onUnload: function() {
            $(window).off('scroll');
        }
    };
});

pjax_config_page('/random-markets', function() {
    return {
        onLoad: function() {
            sidebar_scroll($('.random-markets'));
            if (page.url.location.hash !== "") {
              $('a[href="' + page.url.location.hash + '"]').click();
            }
        },
        onUnload: function() {
            $(window).off('scroll');
        }
    };
});

pjax_config_page('/open-source-projects', function() {
    return {
        onLoad: function() {
            sidebar_scroll($('.open-source-projects'));
        },
        onUnload: function() {
            $(window).off('scroll');
        }
    };
});

pjax_config_page('/white-labels', function() {
    return {
        onLoad: function() {
            sidebar_scroll($('.white-labels'));
        },
        onUnload: function() {
            $(window).off('scroll');
        }
    };
});

pjax_config_page('/payment-agent', function() {
    return {
        onLoad: function() {
            sidebar_scroll($('.payment-agent'));
        },
        onUnload: function() {
            $(window).off('scroll');
        }
    };
});

pjax_config_page('/get-started', function() {
    return {
        onLoad: function() {
            get_started_behaviour();
        },
        onUnload: function() {
            $(window).off('scroll');
        },
    };
});

pjax_config_page('/contact', function() {
    return {
        onLoad: function() {
            display_cs_contacts();
            show_live_chat_icon();
        },
    };
});

pjax_config_page('/careers', function() {
    return {
        onLoad: function() {
            display_career_email();
        },
    };
});

pjax_config_page('/bulk-trader-facility', function() {
    return {
        onLoad: function() {
            var whyus = $('.bulk-trader-facility');
            sidebar_scroll(whyus);
        },
        onUnload: function() {
            $(window).off('scroll');
        }
    };
});

pjax_config_page('/terms-and-condition', function() {
    return {
        onLoad: function() {
            var year = document.getElementsByClassName('currentYear');
            for (i = 0; i < year.length; i++){
              year[i].innerHTML = new Date().getFullYear();
            }
        },
    };
});

pjax_config_page('/my_account', function() {
    return {
        onLoad: function() {
            if ($('#client_loginid option[value="hidden"]')){
              $('#client_loginid option[value="hidden"]').remove();
            }
        },
    };
});
