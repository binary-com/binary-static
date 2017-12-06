var error_class = 'error-field';

window.onload = function () {
    dataLayer.push({ event: 'page_load' });

    var el_email   = document.getElementById('email');
    var el_signup  = document.getElementById('signup');
    var el_success = document.getElementById('success');

    var ws = wsConnect();

    function sendVerifyEmail() {
        wsSend(ws, {
            verify_email: el_email.value,
            type        : 'account_opening'
        });
    }

    var validation_set = false; // To prevent validating before submit

    document.getElementById('frm_verify_email').addEventListener('submit', function (evt) {
        evt.preventDefault();

        if (!validateEmail(el_email.value)) {
            if (!validation_set) {
                ['input', 'change'].forEach(function (evt) {
                    el_email.addEventListener(evt, function () {
                        setValidationStyle(el_email, !validateEmail(el_email.value));
                    });
                });
                setValidationStyle(el_email, !validateEmail(el_email.value));
                validation_set = true;
            }
            return false;
        }

        if (ws.readyState === 1) {
            sendVerifyEmail();
        } else {
            ws.onopen = sendVerifyEmail;
        }
    });

    ws.onmessage = function(msg) {
        var response = JSON.parse(msg.data);
        setValidationStyle(el_email, response.error);
        if (!response.error) {
            el_signup.classList.add('invisible');
            el_success.classList.remove('invisible');
        }
    };

    // Store gclid
    var gclid = getParamValue(document.referrer, 'gclid');
    if (gclid) {
        localStorage.setItem('gclid', gclid);
    }

    const applyToAllElements = (selector, funcToRun, func_selector, el_parent) => {
        if (!selector || !funcToRun) {
            return;
        }

        let function_selector = func_selector;
        let element_to_select = selector;
        if (!func_selector && !element_to_select.nodeName) {
            if (/[\s#]/.test(element_to_select) || element_to_select.lastIndexOf('.') !== 0) {
                function_selector = 'querySelectorAll';
            } else if (element_to_select.lastIndexOf('.') === 0) {
                function_selector = 'getElementsByClassName';
                element_to_select = element_to_select.substring(1);
            } else if (/^[a-zA-Z]+$/.test(element_to_select)) {
                function_selector = 'getElementsByTagName';
            }
        }
        const parent_element = el_parent || document;
        const el = element_to_select.nodeName || typeof element_to_select === 'object' ? element_to_select : parent_element[function_selector](element_to_select);
        for (let i = 0; i < el.length; i++) {
            funcToRun(el[i]);
        }
    };

    applyToAllElements('.go-left', (element) => {
        element.removeEventListener('click', (e) => { changeTab(e, true); });
        element.addEventListener('click', (e) => { changeTab(e, true); });
    });
    applyToAllElements('.go-right', (element) => {
        element.removeEventListener('click', (e) => { changeTab(e, false); });
        element.addEventListener('click', (e) => { changeTab(e, false); });
    });
    applyToAllElements('.tm-li', (element) => {
        element.removeEventListener('click', selectTab);
        element.addEventListener('click', selectTab);
    });
};

function validateEmail(email) {
    return /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,63}$/.test(email);
}

function setValidationStyle(element, has_error) {
    element.classList[has_error ? 'add' : 'remove'](error_class);
}

const closestByClass = (el, clazz) => {
    while (el.className != clazz) {
        el = el.parentNode;
        if (!el) {
            return null;
        }
    }
    return el;
}

const changeTab = (e, go_left) => {
    const selector = e.target.getAttribute('data-parent');
    const el_parent = document.getElementById(selector);
    const elements = el_parent.getElementsByTagName('li');
    for (let i = 0; i < elements.length; i++) {
        if (/active/.test(elements[i].classList)) {
            elements[i].classList.remove('active');
            document.getElementById(`${elements[i].getAttribute('id')}-content`).classList.add('invisible');
            let el_to_show;
            if (go_left) {
                el_to_show = elements[i - 1] ? elements[i - 1] : elements[elements.length - 1];
            } else {
                el_to_show = elements[i + 1] ? elements[i + 1] : elements[0];
            }
            el_to_show.classList.add('active');

            const new_index = Array.prototype.indexOf.call(el_parent.childNodes, el_to_show);
            SlideSelector(e, selector, new_index);

            document.getElementById(`${el_to_show.getAttribute('id')}-content`).classList.remove('invisible');
            break;
        }
    }
};

const selectTab = (e) => {
    e.preventDefault();
    const selector  = closestByClass(e.target, 'tm-ul').getAttribute('id');
    const new_index = Array.prototype.indexOf.call(closestByClass(e.target, 'tm-ul').childNodes, e.target.parentNode);
    const el_parent = document.getElementById(selector);
    const elements = el_parent.getElementsByTagName('li');
    for (let i = 0; i < elements.length; i++) {
        if (/active/.test(elements[i].classList)) {
            elements[i].classList.remove('active');
            document.getElementById(`${elements[i].getAttribute('id')}-content`).classList.add('invisible');
            let el_to_show;
            let curr_index;
            curr_index = new_index == 9 ? 4 : new_index == 7 ? 3 : new_index == 5 ? 2 : new_index == 3 ? 1 : 0;
            el_to_show = elements[curr_index] ? elements[curr_index] : elements[0];
            el_to_show.classList.add('active');
            if(new_index === -1) {
                SlideSelector(e, selector, new_index + 2);
            }
            else {
                SlideSelector(e, selector, new_index);
            }

            document.getElementById(`${el_to_show.getAttribute('id')}-content`).classList.remove('invisible');
            break;
        }
    }

};

const SlideSelector = (e, selector, new_index) => {
    if (!/img|a/i.test(e.target.nodeName)) {
        return;
    }
    const selected_index = Math.floor(new_index / 2) + 1;
    const margin_left    = (selected_index - 1) * (100 / document.getElementById(selector).children.length);
    const element   =  document.getElementById(`${selector}_selector`);
    const tab_width = (margin_left) * document.getElementById(`${selector}`).offsetWidth / 100;
    window.setTimeout(() => {
        element.style.transitionDuration = "0.3s";
        element.style.transitionTimingFunction = "ease-out";
        element.style.transform = `translate(${tab_width}px, 0)`;
    }, 20);
    // $(`#${selector}_selector`).animate({ 'margin-left': `${margin_left}%` }, 300);
};
