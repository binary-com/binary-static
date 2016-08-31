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
    $(s || '.date').each(function(idx, ele) {
        var gmtTimeStr = ele.textContent.replace('\n', ' ');
        var localTime  = moment.utc(gmtTimeStr, 'YYYY-MM-DD HH:mm:ss').local();
        if (!localTime.isValid()) {
            return;
        }

        var localTimeStr = localTime.format('YYYY-MM-DD HH:mm:ss Z');
        $(ele).attr('data-balloon', localTimeStr);
    });
}

function toJapanTimeIfNeeded(gmtTimeStr, showTimeZone, longcode, hideSeconds){
    var match;
    if (longcode && longcode !== '') {
      match = longcode.match(/((?:\d{4}-\d{2}-\d{2})\s?(\d{2}:\d{2}:\d{2})?(?:\sGMT)?)/);
      if (!match) return longcode;
    }

    var curr = localStorage.getItem('client.currencies'),
        timeStr = gmtTimeStr,
        time;

    if(typeof gmtTimeStr === 'number'){
        time = moment.utc(gmtTimeStr*1000);
    } else if(gmtTimeStr){
        time = moment.utc(gmtTimeStr, 'YYYY-MM-DD HH:mm:ss');
    } else {
        time = moment.utc(match[0], 'YYYY-MM-DD HH:mm:ss');
    }

    if (!time.isValid()) {
        return;
    }

    timeStr = time.zone(curr === 'JPY' ? '+09:00' : '+00:00').format((hideSeconds ? 'YYYY-MM-DD HH:mm' : 'YYYY-MM-DD HH:mm:ss' ) + (showTimeZone && showTimeZone !== '' ? curr === 'JPY' ? ' zZ' : ' Z' : ''));

    return (longcode ? longcode.replace(match[0], timeStr) : timeStr);
}

function downloadCSV(csvContents, filename) {
    var csv = 'data:text/csv;charset=utf-8,' + csvContents;
    var downloadLink = document.createElement('a');
    downloadLink.href = encodeURI(csv);
    downloadLink.download = filename || 'data.csv';

    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}

function template(string, content) {
    return string.replace(/\[_(\d+)\]/g, function(s, index) {
        return content[(+index) - 1];
    });
}

function objectNotEmpty(obj) {
    if (obj && obj instanceof Object) {
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) return true;
        }
    }
    return false;
}

function parseLoginIDList(string) {
    if (!string) return [];
    return string.split('+').sort().map(function(str) {
        var items = str.split(':');
        var id = items[0];
        return {
            id:        id,
            real:      items[1] === 'R',
            disabled:  items[2] === 'D',
            financial: /^MF/.test(id),
            non_financial: /^MLT/.test(id),
        };
    });
}

//used temporarily for mocha test
if (typeof module !== 'undefined') {
    module.exports = {
        toJapanTimeIfNeeded: toJapanTimeIfNeeded,
        objectNotEmpty: objectNotEmpty,
        template: template,
        parseLoginIDList: parseLoginIDList,
    };
}
