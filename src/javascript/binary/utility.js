//////////////////////////////////////////////////////////////////
// Purpose: Write loading image to a container for ajax request
// Parameters:
// 1) container - a jQuery object
//////////////////////////////////////////////////////////////////
function showLoadingImage(container)
{
    var image_link = page.settings.get('image_link');

    container.empty().append('<div id="std_loading_img"><p>'+text.localize('loading...')+'</p><img src="'+image_link['hourglass']+'" /></div>');
}

/////////////////////////////////////////////////////////////////
// Purpose   : Generate form's parameters in the format that is
//             required by XMLHttpRequest.send
// Return    : Parameters string e.g. var1=val1&var2=var2
// Parameters: Targeted form object
/////////////////////////////////////////////////////////////////
function getFormParams(form_obj)
{
    var params_arr = [];
    if (! form_obj) return '';
    var elem = form_obj.elements;

    var j=0;
    for (var i = 0; i < elem.length; i++)
    {
        if(elem[i].name)
        {
            if(elem[i].nodeName == 'INPUT' && elem[i].type.match(/radio|checkbox/) && !elem[i].checked)
            {
                continue; // skip if it is not checked
            }

            params_arr[j] = elem[i].name+'='+encodeURIComponent(elem[i].value);
            j++;
        }
    }

    var params_str = params_arr.join('&');
    return params_str;
}

/**
 * Adds thousand separators for numbers.
 *
 * @param Number num: any number (int or float)
 * @param string separator [optional] string to use for the separator (default is , as the name suggests)
 * @return string
 */
function virgule(given_num)
{
    if (isNaN(given_num)) {
        return given_num;
    }
    var maybe_minus = '';
    var num = given_num;
    if (given_num < 0) {
        num = num * -1;
        maybe_minus = '-';
    }

    if (num < 1000) {
        return maybe_minus + num;
    }

    var separator = ',';
    if (arguments.length > 1) {
        separator = arguments[1];
    }

    var int_part = num;
    var float_part = '';
    var float_match = /(\d{3,})\.(\d+)/.exec(num);
    if (float_match) {
        int_part = float_match[1];
        float_part = '.' + float_match[2];
    }
    var match = /(\d+)(\d\d\d)$/.exec(int_part);

    return maybe_minus + virgule(match[1], separator) + separator + match[2] + float_part;
}

function getImageLink() {
    var image_link = page.settings.get('image_link');
    return '<img src="' + image_link['hourglass'] + '" class="bet_bottom_loading_image" />';
}

/**
 * updates a container node for when a price value inside is updated.
 * Like when the bet price is changed, updates the bet buy price container
 * with arrows to display the change.
 *
 * @param item Object: the node object
 * @param old_val: what it used to be
 * @param new_val: what it is now
 */
function price_moved (item, old_val, new_val) {
    if (new_val < old_val) {
       item.removeClass("price_moved_up");
       item.addClass("price_moved_down");
    } else if (new_val > old_val) {
       item.removeClass("price_moved_down");
       item.addClass("price_moved_up");
    } else {
       item.removeClass("price_moved_down");
       item.removeClass("price_moved_up");
    }
}


/**
 * Returns the highest z-index in the page.
 * Accepts a jquery style selector to only check those elements,
 * uses all container tags by default
 * If no element found, returns null.
 *
 * @param selector: a jquery style selector for target elements
 * @return int|null
 */
function get_highest_zindex(selector) {
    if (!selector) {
        selector = 'div,p,area,nav,section,header,canvas,aside,span';
    }
    var all = [];
    var _store_zindex = function () {
        if ($(this).is(':visible')) {
            var z = $(this).css("z-index");
            if ( !isNaN(z) ) {
                all.push(z);
            }
        }
    };
    $(selector).each(_store_zindex);

    return all.length ? Math.max.apply(Math, all) : null;
}

/**
 * Returns a stylized price for a value as units and cents.
 * this could be used anywhere we need to show a float value
 * like in bet_sell.js to display the current sell price.
*/
function stylized_price(val) {
    var units = '0';
    var cents = '00';
    if (val) {
        val = Math.round(val * 100) / 100;
        var val_str = val.toString();
        var parts = val_str.split('.');
        units = virgule(parts[0]);
        cents = parts[1] || '00';
        if (cents.length < 2) {
            cents += '0';
        }
    }
    return {
        units: units,
        cents: '.' + cents
   };
}

/**
 * Add login param which contains the login cookie.
 * Required as our most of our ajax requests are now Cross domain and it will no longer send the login cookie.
 * Replaces the old header X-AJAX-COOKIE as this way it works for both IE9 and other newer browsers.
 * Not adding the header also avoid extra options request saving a whole 700ms on pricing.
 */
var ajax_loggedin = function(params) {
    var login_cookie = $.cookie('login');
    if(login_cookie) {
        var extra_params = 'login=' + encodeURIComponent(login_cookie);
        var staff_cookie = $.cookie('staff');
        if(staff_cookie) {
            extra_params += '&staff=' + encodeURIComponent(staff_cookie);
        }

        if(params.data) {
            params.data += '&' + extra_params;
        } else {
            params.data = extra_params;
        }
    }

    //A magical limit to param length imposed by IE.
    if(params.data && params.data.length > 2000) {
        params.type = "POST";
    }

    return params;
};

/**
 * Gets a DOM or jQuery element and reads its data attributes
 * and return an object of data stored in element attributes.
 * This is used where we store some data as element attributes.
 * Excludes commont HTML attributes from the element.
 *
 * @param element: DOM|jQuery element
 * @return object
 */
function element_data_attrs(element) {
    if (element && element instanceof jQuery) {
        element = element.get().pop();
    }
    if (!element || !element.attributes) {
        console.log(element);
        throw new Error("Can not get data attributes from none element parameter");
    }
    var data = {};
    var attrs = element.attributes;
    if (attrs.length) {
        var attr_blacklist = ['id', 'class', 'name', 'style', 'href', 'src', 'title', 'onclick'];
        for (var i = 0; i < attrs.length; i++) {
            var attr = attrs[i];
            if (attr_blacklist.indexOf(attr.name.toLowerCase()) > -1) continue;
            data[attr.name] = attr.value;
        }
    }
    return data;
}

/**
 * Converts a snake_cased string to a camelCased string.
 * The first character case not changed unless requested.
 *
 * @param snake: snake_cased string
 * @param lower_case_first_char: boolean to force the first char to be lower cased
 * @param chars: string of chars to be considered a separator (default is _ and -)
 */
function snake_case_to_camel_case(snake, lower_case_first_char, chars) {
    chars = chars || '_-';
    var _upper2ndchar = function (m) { return m[1].toUpperCase(); };
    var regex = new RegExp('[' + chars + ']([a-zA-Z])', 'g');
    var camel = snake.replace(regex, _upper2ndchar);
    camel.replace('_', '');
    if (lower_case_first_char) {
        camel = camel[0].toLowerCase() + camel.substr(1);
    }
    return camel;
}

/**
 * attaches a datepicker to the specified element
 * This is a thin wrapper for datepicker, helps to keep a unique site-wide
 * default configurations for the datepicker.
 *
 * @param element any jquery selector or DOM/jQuery object to attach the datepicker to
 * @param config custom configurations for the datepicker
 */
function attach_date_picker(element, conf) {
    var k,
        target = $(element);
    if (!target || !target.length) return false;
    var today = new Date();
    var next_year = new Date();
    next_year.setDate(today.getDate() + 365);
    var options = {
        dateFormat: 'yy-mm-dd',
        maxDate: next_year,
    };
    for (k in conf) if (conf.hasOwnProperty(k)) {
        options[k] = conf[k];
    }
    return target.datepicker(options);
}

/**
 * attaches a timepicker to the specified element.
 * This is a thin wrapper for timepicker, helps to keep a unique site-wide
 * default configurations for the timepicker.
 *
 * @param element any jquery selector or DOM/jQuery object to attach the timepicker to
 * @param config custom configurations for the timepicker
 */
function attach_time_picker(element, conf) {
    var attr, k, target = $(element);
    if (!target || !target.length) return false;
    var opts = {
        timeSeparator: ':',
        showLeadingZero: true,
        howMinutesLeadingZero: true,
        hourText: text.localize("Hour"),
        minuteText: text.localize("Minute"),
        minTime: {},
        maxTime: {},
    };
    var data_attrs = element_data_attrs(target);
    var regex = /^time\:(.+)/;
    for (attr in data_attrs) if (data_attrs.hasOwnProperty(attr)) {
        var matched = attr.match(regex);
        if (matched) {
            var data = data_attrs[attr];
            var opt_name = matched[1].trim();
            if (data == 'true') {
                data = true;
            } else if (data == 'false') {
                data = false;
            }
            opt_name = snake_case_to_camel_case(opt_name, true).toLowerCase();
            switch (opt_name) {
                case 'mintimehour':
                    opts.minTime.hour = data;
                    break;
                case 'mintimeminute':
                    opts.minTime.minute = data;
                    break;
                case 'maxtimehour':
                    opts.maxTime.hour = data;
                    break;
                case 'maxtimeminute':
                    opts.maxTime.minute = data;
                    break;
            }
        }
    }
    for (k in conf) if (conf.hasOwnProperty(k)) {
        opts[k] = conf[k];
    }
    return target.timepicker(opts);
}

/**
 * attaches an inpage popup to the specified element.
 *
 * @param element any jquery selector or DOM/jQuery object to attach the inpage popups to
 */
function attach_inpage_popup(element) {
    var targets = $(element);
    var popups = [];
    var regx = /^popup-(.+)/;
    targets.each(function () {
        var attr,
            matched,
            attrs = element_data_attrs(this),
            conf = {};
        for (attr in attrs) if (attrs.hasOwnProperty(attr)) {
            matched = attr.match(regx);
            if (matched) {
                conf[matched[1]] = attrs[attr];
            }
        }
        var popup = new InPagePopup(conf);
        popup.attach(this);
        popups.push(popup);
    });
    return popups;
}

/**
 * Calculate container width for chart as of now but can
 * be used to get current container width
 */

function get_container_width() {
    var width = 960;
    if ($('.chart_holder').length > 0) {
        width = $('.chart_holder').width();
    } else {
        width = $('.grd-container').width();
    }
    return width;
}

/**
 * in a jquery UI tabs object, finds out whitch tab is marked to be the
 * active tab by default.
 *
 * The default active tab is selected based on CSS classes of tab list items.
 *
 * @param element any jquery selector or DOM/jquery object that contains a jquery UI tab UL
 * @return int the index of active list item or 0 if none of the items were
 * marked as active.
 */
function find_active_jqtab(el) {
    var jqel = $(el);
    var ul = jqel.children('ul');
    if (!ul) throw new Error("Invalid parameter. element is not a jquery UI tab container");
    ul = ul.filter(":first");
    var items = ul.children('li');
    for (var i = 0; i < items.length; i++) {
        if ($(items[i]).hasClass('active')) {
            return i;
        }
    }
    return 0;
}

/**
 * attaches tabs to the specified element selector
 *
 * @param element any jquery selector or DOM/jQuery object
 */
function attach_tabs(element) {
    var targets = $(element);
    targets.each(function () {
        var jqel = $(this);
        var conf = {};
        var active = 0;
        try {
            active = find_active_jqtab(jqel);
        } catch (e) {
            console.log(e);
            console.log(jqel);
        }
        if (active) {
            conf['active'] = active;
            $('li.active', jqel).removeClass('active');
        }
        jqel.tabs(conf);
    });
    return targets;
}

function showLocalTimeOnHover(s) {
    var selector = s || '.date';

    $(selector).each(function(idx, ele) {
        var gmtTimeStr = ele.innerHTML.replace('\n', ' ');

        var localTime = moment.utc(gmtTimeStr, 'YYYY-MM-DD HH:mm:ss').local();
        if (!localTime.isValid()) {
            return;
        }

        var localTimeStr = localTime.format('YYYY-MM-DD HH:mm:ss ZZ');
        var timeToShow = localTimeStr.replace(' ', '\n');
        var tooltip = $('<span></span>', { class: 'tooltip-content', text: timeToShow });
        $(ele)
            .children('.tooltip-content')
            .remove();
        $(ele).append(tooltip);
    });
}
