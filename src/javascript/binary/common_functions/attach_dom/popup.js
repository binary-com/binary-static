const createElement = require('../../base/utility').createElement;
const Validation    = require('../form_validation');

const showPopup = (options) => {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState !== 4 || this.status !== 200) {
            return;
        }

        const div      = createElement('div', { html: this.responseText });
        const lightbox = createElement('div', { id: options.popup_id, class: 'lightbox' });
        lightbox.append(div.querySelector(options.content_id));
        document.body.appendChild(lightbox);

        if (options.validations) {
            Validation.init(options.form_id, options.validations);
        }

        if (typeof options.additionalFunction === 'function') {
            options.additionalFunction();
        }

        const el_form = document.getElementById(options.form_id.slice(1));
        if (el_form) {
            el_form.addEventListener('submit', (e) => {
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
        }
    };
    xhttp.open('GET', options.url, true);
    xhttp.send();
};

module.exports = showPopup;
