/**
 * Write loading image to a container for ajax request
 *
 * @param container: a jQuery object
 * @param theme: dark or white
 */
const showLoadingImage = (container, theme = 'dark') => {
    container.empty().append(`<div class="barspinner ${theme}"><div class="rect1"></div><div class="rect2"></div><div class="rect3"></div><div class="rect4"></div><div class="rect5"></div></div>`);
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
const getHighestZIndex = (selector) => {
    if (!selector) {
        selector = 'div,p,area,nav,section,header,canvas,aside,span';
    }
    const all = [];
    const _store_zindex = function() {
        if ($(this).is(':visible')) {
            const z = $(this).css('z-index');
            if (!isNaN(z)) {
                all.push(z);
            }
        }
    };
    $(selector).each(_store_zindex);

    return all.length ? Math.max(...all) : null;
};

const downloadCSV = (csv_contents, filename) => {
    filename = filename || 'data.csv';
    if (navigator.msSaveBlob) { // IE 10+
        navigator.msSaveBlob(new Blob([csv_contents], { type: 'text/csv;charset=utf-8;' }), filename);
    } else { // Other browsers
        const csv = `data:text/csv;charset=utf-8,${csv_contents}`;
        const download_link = document.createElement('a');
        download_link.href = encodeURI(csv);
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
            if (obj.hasOwnProperty(key)) is_empty = false;
        });
    }
    return is_empty;
};

const cloneObject = obj => (!isEmptyObject(obj) ? $.extend({}, obj) : obj);

const getPropertyValue = (obj, keys) => {
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

module.exports = {
    showLoadingImage: showLoadingImage,
    getHighestZIndex: getHighestZIndex,
    downloadCSV     : downloadCSV,
    template        : template,
    isEmptyObject   : isEmptyObject,
    getPropertyValue: getPropertyValue,
    handleHash      : handleHash,
};
