const initLoader = (css_files, js_files) => { // eslint-disable-line no-unused-vars
    const is_dark_mode_on = localStorage.getItem('is_dark_mode_on');
    const el_loader = document.getElementById('binary_loader');
    if (el_loader) {
        el_loader.classList[/true|null/.test(is_dark_mode_on) ? 'add' : 'remove']('dark');
        // show loader animation only after changing the theme color
        el_loader.classList.add('run'); 
    }

    if (css_files) { loadCSS(css_files); }
    if (js_files) { loadJS(js_files); }
};

const loadCSS = (css_files) => {
    css_files.map((href) => {
        const link = document.createElement('link');
        link.setAttribute('rel', 'stylesheet');
        link.setAttribute('href', href);
        document.head.appendChild(link);
    });
};

const loadJS = (js_files) => {
    const scripts = [];
    const length  = js_files.length;
    let counter = 0;
    js_files.map((src, idx) => {
        const script = document.createElement('script');
        script.onload = () => {
            ++counter;
            if (counter === length - 1) {
                while (scripts.length) {
                    document.head.appendChild(scripts.pop());
                }
            }
        };
        script.setAttribute('src', src);
        if (idx < length - 1) {
            // load all scripts except the last one
            document.head.appendChild(script);
        } else {
            // load the last script later
            scripts.push(script);
        }
    });
};