/**
 * Write loading image to a container for ajax request
 *
 * @param $container: a jQuery object
 * @param theme: dark or white
 */
const showLoadingImage = ($container, theme = 'dark') => {
    $container.html($('<div/>', {
        class: `barspinner ${theme}`,
        html : Array.from(new Array(5)).map((x, i) => `<div class="rect${i + 1}"></div>`).join(''),
    }));
};

/**
 * Returns the highest z-index in the page.
 * Accepts a jquery style selector to only check those elements,
 * uses all container tags by default
 * If no element found, returns null.
 *
 * @param selector: a jquery style selector for target elements
 * @return int|null
 */
const getHighestZIndex = (selector = 'div,p,area,nav,section,header,canvas,aside,span') => {
    const all          = [];
    const store_zindex = function () {
        if ($(this).is(':visible')) {
            const z = $(this).css('z-index');
            if (!isNaN(z)) {
                all.push(z);
            }
        }
    };
    $(selector).each(store_zindex);

    return all.length ? Math.max(...all) : null;
};

const downloadCSV = (csv_contents, filename = 'data.csv') => {
    if (navigator.msSaveBlob) { // IE 10+
        navigator.msSaveBlob(new Blob([csv_contents], { type: 'text/csv;charset=utf-8;' }), filename);
    } else { // Other browsers
        const csv              = `data:text/csv;charset=utf-8,${csv_contents}`;
        const download_link    = document.createElement('a');
        download_link.href     = encodeURI(csv);
        download_link.download = filename;

        document.body.appendChild(download_link);
        download_link.click();
        document.body.removeChild(download_link);
    }
};

const template = (string, content) => string.replace(/\[_(\d+)]/g, (s, index) => content[(+index) - 1]);

const isEmptyObject = (obj) => {
    let is_empty = true;
    if (obj && obj instanceof Object) {
        Object.keys(obj).forEach((key) => {
            if (Object.prototype.hasOwnProperty.call(obj, key)) is_empty = false;
        });
    }
    return is_empty;
};

const cloneObject = obj => (!isEmptyObject(obj) ? $.extend(true, Array.isArray(obj) ? [] : {}, obj) : obj);

const getPropertyValue = (obj, k) => {
    let keys = k;
    if (!Array.isArray(keys)) keys = [keys];
    if (!isEmptyObject(obj) && keys[0] in obj && keys && keys.length > 1) {
        return getPropertyValue(obj[keys[0]], keys.slice(1));
    }
    // else return clone of object to avoid overwriting data
    return obj ? cloneObject(obj[keys[0]]) : undefined;
};

const handleHash = () => {
    const hash = window.location.hash;
    if (hash) {
        $(`a[href="${hash}"]`).click();
    }
};

const clearable = (element) => {
    element.addClass('clear');
    $(document).on('mousemove', '.clear', function (e) {
        e.stopPropagation();
        $(e.currentTarget)[toggleAddRemoveClass(this.offsetWidth - 18 < e.clientX - this.getBoundingClientRect().left)]('onClear');
    }).on('mousedown', '.onClear', (e) => {
        e.stopPropagation();
        $(e.currentTarget).attr('data-value', '');
        $(e.currentTarget).removeClass('clear onClear').val('').change();
    });
};

const toggleAddRemoveClass = condition => (condition ? 'addClass' : 'removeClass');

/**
 * Creates a DOM element and adds any attributes to it.
 *
 * @param tag_name: string of the tag to create, e.g. 'div', 'a', etc
 * @param attributes: an object with all the attributes to assign, e.g. { id: '...', class: '...', html: '...', ... }
 * @return the created DOM element
 */
const createElement = (tag_name, attributes) => {
    const el = document.createElement(tag_name);
    Object.keys(attributes).forEach((attr) => {
        const value = attributes[attr];
        if (attr === 'text') {
            el.textContent = value;
        } else if (attr === 'html') {
            el.innerHTML = value;
        } else {
            el.setAttribute(attr, value);
        }
    });
    return el;
};

module.exports = {
    showLoadingImage,
    getHighestZIndex,
    downloadCSV,
    template,
    isEmptyObject,
    getPropertyValue,
    handleHash,
    clearable,
    createElement,
};
