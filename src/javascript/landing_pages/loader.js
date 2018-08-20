const initLoader = (css_files, js_files) => { // eslint-disable-line no-unused-vars
    const is_dark_mode_on = localStorage.getItem('is_dark_mode_on');
    const el_loader       = document.getElementById('binary_loader');
    if (el_loader) {
        el_loader.classList[/true|null/.test(is_dark_mode_on) ? 'add' : 'remove']('dark');
        animate();
    }

    // Load resources
    if (css_files) { loadCSS(css_files); }
    if (js_files) {
        const required_js   = js_files.slice(0, 4);
        const binary_app_js = js_files.slice(4);
        setTimeout(() => {
            loadJS(required_js, () => {
                loadJS(binary_app_js);
            });
        }, 1000); // delay loading JS
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

const animate = () => {
    const el_chart      = document.querySelector('.chart-line');
    const el_loading    = document.querySelectorAll('.loading');
    const el_loading_bg = document.querySelectorAll('.loading-bg');

    const PATHS_LENGTH = {
        chart  : el_chart.getTotalLength(),
        loading: el_loading[0].getTotalLength(),
    };

    const position = {
        chart     : PATHS_LENGTH.chart,
        loading   : PATHS_LENGTH.loading,
        loading_bg: PATHS_LENGTH.loading,
    };

    let draw_loading = false;
    let req_id;
    const draw = () => {
        if (position.chart < 0) {
            position.chart = PATHS_LENGTH.chart;
        } else {
            el_chart.style.strokeDashoffset = position.chart;
            position.chart -= 5;
        }

        el_loading.forEach(path => {
            path.style.strokeDashoffset = position.loading;
            position.loading -= 1.2;
            if (position.loading < 0) {
                position.loading = 2 * PATHS_LENGTH.loading;
                draw_loading = true;
            }
        });

        if (draw_loading) {
            el_loading_bg.forEach(path => {
                path.style.strokeDashoffset = position.loading_bg;
                position.loading_bg -= 1.2;
                if (position.loading_bg < 0) {
                    position.loading_bg = 2 * PATHS_LENGTH.loading;
                }
            });
        }

        req_id = requestAnimationFrame(draw);
    };

    document.addEventListener('DOMNodeRemoved', (e) => {
        if (e.target.id === 'binary_loader') {
            cancelAnimationFrame(req_id);
        };
    });

    requestAnimationFrame(draw);
};
