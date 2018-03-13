const Client = require('../../app/base/client');

const GetStartedJP = (() => {
    let $contents,
        $sidebar_li,
        $index;

    const showSelectedTab = () => {
        const updated_tab = window.location.hash;
        $contents.find('div').hide();
        $sidebar_li.removeClass('selected');
        if (updated_tab) {
            $index.hide();
            $contents.find(`div[id=content-${updated_tab.slice(1, updated_tab.length)}]`).show().find('div').show();
            $sidebar_li.filter(`.${updated_tab.slice(1, updated_tab.length)}`).addClass('selected');
            $contents.show();
        } else {
            $contents.hide();
            $index.show();
        }
    };

    const onLoad = () => {
        Client.activateByClientType();
        $contents   = $('.contents');
        $sidebar_li = $('.sidebar ul li');
        $index      = $('#index');

        const tab = window.location.hash;
        if (tab && tab !== '') {
            $index.hide();
            $(`.sidebar ul li.${tab.slice(1, tab.length)}`).addClass('selected');
            showSelectedTab();
        }

        $(window).on('hashchange', () => {
            showSelectedTab();
        });

        $sidebar_li.click(function () {
            $('.sidebar ul li').removeClass('selected');
            $(this).addClass('selected');
        });
    };

    const onUnload = () => {
        $(window).off('hashchange');
    };

    return {
        onLoad,
        onUnload,
    };
})();

module.exports = GetStartedJP;
