const Url          = require('./url').Url;
const url          = require('./url').url;
const GTM          = require('./gtm').GTM;
const SessionStore = require('./storage').SessionStore;
const State        = require('./storage').State;
const Contents     = require('./contents').Contents;
const url_for      = require('./url').url_for;
const Client       = require('./client').Client;
const Login        = require('./login').Login;
const page         = require('./page').page;
const japanese_client = require('../common_functions/country_base').japanese_client;
const pjax = require('../../lib/pjax-lib');

const make_mobile_menu = function () {
    if ($('#mobile-menu-container').is(':visible')) {
        $('#mobile-menu').mmenu({
            position       : 'right',
            zposition      : 'front',
            slidingSubmenus: false,
            searchfield    : true,
            onClick        : {
                close: true,
            },
        }, {
            selectedClass: 'active',
        });
    }
};

// For object shape coherence we create named objects to be inserted into the queue.
const URLPjaxQueueElement = function(exec_function, new_url) {
    this.method = exec_function;
    if (new_url) {
        this.url = new RegExp(new_url);
    } else {
        this.url = /.*/;
    }
};

URLPjaxQueueElement.prototype = {
    fire: function(in_url) {
        if (this.url.test(in_url)) {
            this.method();
        }
    },
};

const IDPjaxQueueElement = function(exec_function, id) {
    this.method = exec_function;
    this.sel = '#' + id;
};

IDPjaxQueueElement.prototype = {
    fire: function() {
        if ($(this.sel).length > 0) {
            this.method();
        }
    },
};

const PjaxExecQueue = function () {
    this.url_exec_queue = [];
    this.id_exec_queue = [];
    this.fired = false;
    this.content = $('#content');
};

PjaxExecQueue.prototype = {
    queue: function (exec_function) {
        this.url_exec_queue.unshift(new URLPjaxQueueElement(exec_function));
    },
    queue_for_url: function (exec_function, url_pattern) {
        this.url_exec_queue.unshift(new URLPjaxQueueElement(exec_function, url_pattern));
    },
    fire: function () {
        if (!this.fired) {
            url.reset();
            const match_loc = window.location.href;
            let i = this.url_exec_queue.length;
            while (i--) {
                this.url_exec_queue[i].fire(match_loc);
            }

            i = this.id_exec_queue.length;
            while (i--) {
                this.id_exec_queue[i].fire(match_loc);
            }
        }
        this.fired = true;
    },
    reset: function() {
        this.fired = false;
    },
    loading: function () {
        this.reset();
    },
};

const pjax_config_page = function(new_url, exec_functions) {
    const functions = exec_functions();
    if (functions.onLoad) onLoad.queue_for_url(functions.onLoad, new_url);
    if (functions.onUnload) onUnload.queue_for_url(functions.onUnload, new_url);
};

const pjax_config = function() {
    return {
        container : 'content',
        beforeSend: function() {
            onLoad.loading();
            onUnload.fire();
        },
        complete: function() {
            State.set('is_loaded_by_pjax', true);
            onLoad.fire();
            onUnload.reset();
        },
        error: function() {
            const error_text = SessionStore.get('errors.500');
            if (error_text) {
                $('#content').html(error_text);
            } else {
                $.get('/errors/500.html').always(function(content) {
                    const tmp = document.createElement('div');
                    tmp.innerHTML = content;
                    const tmpNodes = tmp.getElementsByTagName('div');
                    for (let i = 0, l = tmpNodes.length; i < l; i++) {
                        if (tmpNodes[i].id === 'content') {
                            SessionStore.set('errors.500', tmpNodes[i].innerHTML);
                            $('#content').html(tmpNodes[i].innerHTML);
                            break;
                        }
                    }
                });
            }
        },
        useClass: 'pjaxload',
    };
};

const init_pjax = function () {
    pjax.connect(pjax_config());
};

// TODO: remove or fix this function
// find all instances with window.location.href
// and replace them with the fixed function
const load_with_pjax = function(new_url) {
    if (url.is_in(new Url(new_url))) {
        return;
    }

    const config = pjax_config();
    config.url = new_url;
    config.update_url = new_url;
    config.history = true;
    pjax.invoke(config);
};

// Reduce duplication as required Auth is a common pattern
const pjax_config_page_require_auth = function(new_url, exec) {
    const oldOnLoad = exec().onLoad;
    const newOnLoad = function() {
        if (!Contents.show_login_if_logout(true)) {
            oldOnLoad();
        }
    };

    const newExecFn = function() {
        return {
            onLoad  : newOnLoad,
            onUnload: exec().onUnload,
        };
    };
    pjax_config_page(new_url, newExecFn);
};

const onLoad = new PjaxExecQueue();
const onUnload = new PjaxExecQueue();

init_pjax(); // Pjax-standalone will wait for on load event before attaching.
$(function() { onLoad.fire(); });

onLoad.queue(GTM.push_data_layer);

onLoad.queue(function () {
    page.on_load();
    $('#logo').on('click', function() {
        window.location.href = url_for(Client.is_logged_in() ? japanese_client() ? 'multi_barriers_trading' : 'trading' : '');
    });
    $('#btn_login').on('click', function(e) {
        e.preventDefault();
        Login.redirect_to_login();
    });
});

onUnload.queue(function () {
    page.on_unload();
});

onLoad.queue(function () {
    // global function used from binary style
    tabListener();

    make_mobile_menu();

    const i = window.location.href.split('#');
    if (i.length !== 2) return;
    const o = document.getElementsByTagName('a');
    for (let t = 0; t < o.length; t++) {
        if (o[t].href.substr(o[t].href.length - i[1].length - 1) === '#' + i[1]) {
            o[t].click();
            break;
        }
    }
});

module.exports = {
    load_with_pjax               : load_with_pjax,
    pjax_config_page             : pjax_config_page,
    pjax_config_page_require_auth: pjax_config_page_require_auth,
};
