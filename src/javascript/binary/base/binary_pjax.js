const getLanguage   = require('./language').get;
const State         = require('./storage').State;
const Url           = require('./url');
const createElement = require('./utility').createElement;

const BinaryPjax = (() => {
    let previous_url;

    const params   = {};
    const cache    = {};

    const init = (container, content_selector) => {
        if (!(window.history && window.history.pushState && window.history.replaceState &&
            // pushState isn't reliable on iOS until 5.
            !navigator.userAgent.match(/((iPod|iPhone|iPad).+\bOS\s+[1-4]\D|WebApps\/.+CFNetwork)/))) {
            return;
        }

        if (!container || !content_selector) {
            return;
        }

        params.container        = container;
        params.content_selector = content_selector;

        const url     = window.location.href;
        const title   = document.title;
        const content = container.querySelector(content_selector);

        // put current content to cache, so we won't need to load it again
        if (content) {
            window.history.replaceState({ url }, title, url);
            setDataPage(content, url);
            params.container.dispatchEvent(new CustomEvent('binarypjax:after', { detail: content }));
        }

        const links_accounts = document.getElementById('all-accounts').getElementsByTagName('a');
        for (let i = 0; i < links_accounts.length; i++) {
            links_accounts[i].addEventListener('click', handleClick);
        }
        const links_document = document.getElementsByTagName('a');
        for (let i = 0; i < links_document.length; i++) {
            links_document[i].addEventListener('click', handleClick);
        }
        window.addEventListener('popstate', handlePopstate);
    };

    const setDataPage = (content, url) => {
        content.setAttribute('data-page', url.match(/.+\/(.+)\.html.*/)[1]);
    };

    const handleClick = (event) => {
        let link;
        if (event.target.nodeName === 'A') {
            link = event.target;
        } else if (event.target.parentNode.nodeName === 'A') {
            link = event.target.parentNode;
        } else {
            return;
        }

        const url  = link.href;

        if (!url) {
            return;
        }

        // Exclude links having 'no-ajax' class or target="_blank" or not html
        if (link.classList.contains('no-ajax') || link.target === '_blank' || !/\.html/i.test(url)) {
            return;
        }

        // Middle click, cmd click, and ctrl click should open links in a new tab as normal
        if (event.which > 1 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
            return;
        }

        // Ignore cross origin links
        if (location.protocol !== link.protocol || location.hostname !== link.hostname) {
            return;
        }

        // Ignore event with default prevented
        if (event.defaultPrevented) {
            return;
        }

        event.preventDefault();
        // check if url is not same as current
        if (location.href !== url) {
            processUrl(url);
        }
    };

    const processUrl = (url, replace) => {
        State.set('is_loaded_by_pjax', true);

        const complete_url = /^http/i.test(url) ? url : Url.urlFor(url);

        const cached_content = cacheGet(complete_url);
        if (cached_content) {
            replaceContent(complete_url, cached_content, replace);
        } else {
            load(complete_url, replace);
        }
    };

    /**
     * Load url from server
     */
    const load = (url, replace) => {
        const lang    = getLanguage();
        const xhttp   = new XMLHttpRequest();

        xhttp.onreadystatechange = function() {
            if (this.readyState !== 4 || this.status !== 200) {
                return;
            }
            const div = createElement('div', { html: this.responseText });

            const result = {
                title  : div.getElementsByTagName('title')[0].textContent.trim(),
                content: div.querySelector(params.content_selector),
            };

            // If failed to find title or content, load the page in traditional way
            if (!result.title || !result.content) {
                locationReplace(url);
                return;
            }

            setDataPage(result.content, url);
            cachePut(url, result);
            replaceContent(url, result, replace);
        };

        xhttp.open('GET', url.replace(new RegExp(`/${lang}/`, 'i'), `/${lang.toLowerCase()}/pjax/`), true);
        xhttp.send();
    };

    const handlePopstate = (e) => {
        const url = e.originalEvent.state ? e.originalEvent.state.url : window.location.href;
        if (url) {
            processUrl(url, true);
        }
        return false;
    };

    const replaceContent = (url, content, replace) => {
        previous_url = window.location.href;
        window.history[replace ? 'replaceState' : 'pushState']({ url }, content.title, url);

        params.container.dispatchEvent(new Event('binarypjax:before'));

        document.title = content.title;
        params.container.querySelector(params.content_selector).remove();
        $(params.container).append($(content.content).clone());

        params.container.dispatchEvent(new CustomEvent('binarypjax:after', { detail: content.content }));
        $.scrollTo('body', 500);
    };

    const cachePut = (url, content) => {
        cache[cleanUrl(url)] = content;
    };

    const cacheGet = url => cache[cleanUrl(url)];

    const cleanUrl = url => url.replace(/(\?|#).*$/, '');

    const locationReplace = (url) => {
        window.history.replaceState(null, '', url);
        window.location.replace(url);
    };

    const loadPreviousUrl = () => {
        if (window.location.href === previous_url) {
            previous_url = '';
        }
        processUrl(previous_url || Url.defaultRedirectUrl());
    };

    return {
        init,
        loadPreviousUrl,

        load          : processUrl,
        getPreviousUrl: () => previous_url,
    };
})();

module.exports = BinaryPjax;
