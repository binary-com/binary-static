const initLoader = (css_files, js_files) => { // eslint-disable-line no-unused-vars
    const is_dark_mode_on = localStorage.getItem('is_dark_mode_on');
    const el_loader = document.getElementById('binary_loader');
    if (el_loader) {
        el_loader.classList[/true|null/.test(is_dark_mode_on) ? 'add' : 'remove']('dark');
        // show loader animation only after changing the theme color
        el_loader.classList.add('run'); 
    }

    if (css_files) { loadCSS(css_files); }
    if (js_files) {
        loadJS(js_files.slice(0,4), () => {
            loadJS(js_files.slice(4));
        });
    }
};

const loadCSS = (css_files) => {
    css_files.map((href) => {
        const link = document.createElement('link');
        link.setAttribute('rel', 'stylesheet');
        link.setAttribute('href', href);
        document.head.appendChild(link);
    });
};

const loadJS = (js_files, callback) => {
    let counter = 0;
    js_files.map((src) => {
        const script = document.createElement('script');
        script.onload = script.onreadystatechange = () => {
            ++counter;
            if (counter === js_files.length) {
                if (callback) {
                    callback();
                }
            }
        };
        script.setAttribute('src', src);
        document.body.appendChild(script);
    });
};