const Validation     = require('../form_validation');
const getElementById = require('../../../_common/common_functions').getElementById;
const createElement  = require('../../../_common/utility').createElement;

const cache = {};

const showPopup = (options) => {
    if (cache[options.url]) {
        callback(options);
    } else {
        const xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState !== 4 || this.status !== 200) {
                return;
            }
            cache[options.url] = this.responseText;
            callback(options);
        };
        xhttp.open('GET', options.url, true);
        xhttp.send();
    }
};

const callback = (options) => {
    const div      = createElement('div', { html: cache[options.url] });
    const lightbox = createElement('div', { id: options.popup_id, class: 'lightbox' });
    lightbox.appendChild(div.querySelector(options.content_id));
    document.body.appendChild(lightbox);

    if (options.validations) {
        Validation.init(options.form_id, options.validations);
    }

    if (typeof options.additionalFunction === 'function') {
        options.additionalFunction(lightbox);
    }

    getElementById(options.form_id.slice(1)).addEventListener('submit', (e) => {
        e.preventDefault();
        if (options.validations) {
            if (Validation.validate(options.form_id)) {
                if (lightbox) {
                    lightbox.remove();
                }
                if (typeof options.onAccept === 'function') {
                    options.onAccept();
                }
            }
        } else if (lightbox) {
            lightbox.remove();
        }
    });
};

module.exports = showPopup;
