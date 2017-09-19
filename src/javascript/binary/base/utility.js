/**
 * Write loading image to a container for ajax request
 *
 * @param container: a DOM element
 * @param theme: dark or white
 */
const showLoadingImage = (container, theme = 'dark') => {
    if (container) {
        const div = document.createElement('div');
        div.className = `barspinner ${theme}`;
        div.innerHTML = Array.from(new Array(5)).map((x, i) => `<div class="rect${i + 1}"></div>`).join('');
        container.innerHTML(div);
    }
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
    const elements = selector.split(',');
    const all      = [];

    for (let i = 0; i < elements.length; i++) {
        const els = document.getElementsByTagName(elements);
        for (let j = 0; j < els.length; j++) {
            if (els[i].offsetParent) {
                const z = els[i].style['z-index'];
                if (!isNaN(z)) {
                    all.push(z);
                }
            }
        }
    }

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
        document.querySelector(`a[href="${hash}"]`).click();
    }
};

const clearable = (element) => {
    element.addClass('clear');
    document.addEventListener('mousemove', (e) => {
        if (/clear/.test(e.target.classList)) {
            e.stopPropagation();
            e.target.classList[toggleAddRemoveClass(e.target.offsetWidth - 18 < e.clientX - e.target.getBoundingClientRect().left)]('onClear');
        }
    });
    document.addEventListener('mousedown', (e) => {
        if (/onClear/.test(e.target.classList)) {
            e.stopPropagation();
            e.target.setAttribute('data-value', '');
            e.target.classList.remove('clear', 'onClear');
            e.target.value = '';
            e.target.dispatchEvent(new Event('change'));
        }
    });
};

const toggleAddRemoveClass = condition => (condition ? 'add' : 'remove');

module.exports = {
    showLoadingImage,
    getHighestZIndex,
    downloadCSV,
    template,
    isEmptyObject,
    getPropertyValue,
    handleHash,
    clearable,
};
