const Client = require('../base/client');

const GetStarted = (() => {
    const selectNavElement = () => {
        $('.nav li').removeClass('selected')
            .find(`a[href="${window.location.pathname}"]`)
            .parent('li')
            .addClass('selected');
    };

    const updateActiveSubsection = ($nav, $to_show) => {
        $('.subsection').setVisibility(0);
        $to_show.setVisibility(1);
        const $nav_back = $nav.find('.back');
        const $nav_next = $nav.find('.next');

        if ($to_show.hasClass('first')) {
            $nav_back.addClass('button-disabled');
            $nav_next.removeClass('button-disabled');
        } else if ($to_show.hasClass('last')) {
            $nav_back.removeClass('button-disabled');
            $nav_next.addClass('button-disabled');
        } else {
            $nav_back.removeClass('button-disabled');
            $nav_next.removeClass('button-disabled');
        }

        const new_hash = $to_show.find('a[name]').attr('name').slice(0, -8);
        if (window.location.hash !== `#${new_hash}`) {
            window.location.hash = new_hash;
        }

        return false;
    };

    const onLoad = () => {
        Client.activateByClientType();

        const $nav = $('.get-started').find('.subsection-navigation');

        if ($nav.length) {
            $nav.on('click', 'a', function() {
                const $button = $(this);
                if ($button.hasClass('button-disabled')) {
                    return false;
                }
                const $now_showing = $('.subsection:not(.invisible)');
                const $to_show = $button.hasClass('next') ? $now_showing.next('.subsection') : $now_showing.prev('.subsection');
                return updateActiveSubsection($nav, $to_show);
            });

            const fragment = (location.href.split('#'))[1];
            const $to_show = fragment ? $(`a[name=${fragment}-section]`).parent('.subsection') : $('.subsection.first');
            updateActiveSubsection($nav, $to_show);
        }
        selectNavElement();
    };

    return {
        onLoad,
    };
})();

module.exports = GetStarted;
