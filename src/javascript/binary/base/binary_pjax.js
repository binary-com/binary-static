const getLanguage = require('./language').get;
const State       = require('./storage').State;
const urlFor      = require('./url').urlFor;

const BinaryPjax = (() => {
    'use strict';

    let xhr;
    const params   = {};
    const defaults = {
        type    : 'GET',
        dataType: 'html',
    };
    const cache = {};

    const init = (container, content_selector) => {
        if (!(window.history && window.history.pushState && window.history.replaceState &&
            // pushState isn't reliable on iOS until 5.
            !navigator.userAgent.match(/((iPod|iPhone|iPad).+\bOS\s+[1-4]\D|WebApps\/.+CFNetwork)/))) {
            console.error('Unable to initialize router');
            return;
        }

        container = $(container);

        if (!container.length) {
            console.warn('Could not find container');
            return;
        }

        if (!(content_selector && content_selector.length)) {
            console.warn('No content selector provided');
            return;
        }

        params.container = container;
        params.content_selector = content_selector;

        const url = window.location.href;
        const title = document.title;
        const content = container.find(content_selector);

        // put current content to cache, so we won't need to load it again
        if (content && content.length) {
            window.history.replaceState({ url: url }, title, url);
            setDataPage(content, url);
            params.container.trigger('binarypjax:after', content);
        }

        $(document).find('#all-accounts a').on('click', handleClick);
        $(document).on('click', 'a', handleClick);
        $(window).on('popstate', handlePopstate);
    };

    const setDataPage = (content, url) => {
        content.attr('data-page', url.match('.+\/(.+)\.html.*')[1]);
    };

    const handleClick = (event) => {
        const link = event.currentTarget;
        const url  = link.href;

        if (url.length <= 0) {
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
        if (event.isDefaultPrevented()) {
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

        if (!/^http/i.test(url)) {
            url = urlFor(url);
        }
        const cached_content = cacheGet(url);
        if (cached_content) {
            replaceContent(url, cached_content, replace);
        } else {
            load(url, replace);
        }
    };

    /**
     * Load url from server
     */
    const load = (url, replace) => {
        const lang = getLanguage();
        const options = $.extend(true, {}, $.ajaxSettings, defaults, {
            url: url.replace(new RegExp(`\/${lang}\/`, 'i'), `/${lang.toLowerCase()}/pjax/`) });

        options.success = (data) => {
            const result = {};

            result.title   = $(data).find('title').text().trim();
            result.content = $('<div/>', { html: data }).find(params.content_selector);

            // If failed to find title or content, load the page in traditional way
            if (result.title.length === 0 || result.content.length === 0) {
                locationReplace(url);
                return;
            }

            setDataPage(result.content, url);
            cachePut(url, result);
            replaceContent(url, result, replace);
        };

        // Cancel the current request if we're already loading some page
        abortXHR(xhr);

        xhr = $.ajax(options);
    };

    const handlePopstate = (e) => {
        const url = e.originalEvent.state ? e.originalEvent.state.url : window.location.href;
        if (url) {
            processUrl(url, true);
        }
        return false;
    };

    const replaceContent = (url, content, replace) => {
        window.history[replace ? 'replaceState' : 'pushState']({ url: url }, content.title, url);

        params.container.trigger('binarypjax:before');

        document.title = content.title;
        params.container.find(params.content_selector).remove();
        params.container.append(content.content.clone());

        params.container.trigger('binarypjax:after', content.content);
        $.scrollTo('body', 500);
    };

    const abortXHR = (xhr_obj) => {
        if (xhr_obj && xhr_obj.readyState < 4) {
            xhr_obj.abort();
        }
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

    return {
        init: init,
        load: processUrl,
    };
})();

module.exports = BinaryPjax;
