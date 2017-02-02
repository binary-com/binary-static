const MenuContent = (function () {
    const listeners_events = [];

    const that = {
        init: function (_menu_containers) {
            if (/trading/.test(window.location.pathname)) return;
            _menu_containers.filter(':not(.follow-default)').delegate('.tm-a,.tm-a-2', 'click', function (event) {
                event.preventDefault();

                const target = $(event.target);
                const tab_id = target.parents('li:first').attr('id');

                if (tab_id) {
                    const tab_container = target.parents('.tm-ul');
                    /* eslint-disable newline-per-chained-call */
                    let selected_tab =
                        // find previously active tab
                        tab_container.find('.tm-a, .tm-a-2')
                        // remove previously active tab
                        .removeClass('a-active').end()
                        // unwrap previously active tab
                        .find('.menu-wrap-a .tm-a').unwrap().unwrap()
                        // go back to selected target
                        .end().end()
                        // set active class to it
                        .addClass('a-active')
                        // set active class to its parent as well
                        .parents('.tm-li').addClass('active').removeClass('hover')
                            .find('.tm-li-2').addClass('active').end()
                        // wrap it
                        .find('.tm-a').wrap('<span class="menu-wrap-a"><span class="menu-wrap-b"></span></span>').end()
                        // remove previously active parent
                        .siblings().removeClass('active')
                            .find('.tm-li-2').removeClass('active').end()
                        .end().end();
                    /* eslint-enable newline-per-chained-call */

                    // replace span to a, to make it clickable for real
                    const span_tm_a = tab_container.find('span.tm-a');
                    span_tm_a.replaceWith('<a href="javascript:;" class="' + span_tm_a.attr('class') + '">' + span_tm_a.html() + '</a>');

                    const menu_li = selected_tab.parents('li');
                    let sub_menu_selected = menu_li.find('.tm-ul-2 .a-active'),
                        selected_tab_id = menu_li.attr('id');
                    let $selected_tab_content = $('#' + selected_tab_id + '-content');

                    if (!sub_menu_selected.length) {
                        sub_menu_selected = menu_li.find('.tm-a-2:first').addClass('a-active');

                        if (sub_menu_selected.length) {
                            selected_tab = sub_menu_selected;
                            selected_tab_id = sub_menu_selected.parents('li').attr('id');
                            $selected_tab_content = $('#' + selected_tab_id + '-content');
                        } else {
                            selected_tab_id = menu_li.attr('id');
                        }
                    }
                    $selected_tab_content
                    // show selected tab content
                        .removeClass('invisible')
                        // and hide the rest
                        .siblings(':not(.sticky)').addClass('invisible')
                        .end();

                    that.push_to_listeners({
                        id     : selected_tab_id,
                        target : selected_tab,
                        content: $selected_tab_content,
                        menu   : menu_li.parents('ul.tm-ul'),
                        event  : event,
                    });
                }

                return false;
            });
        },
        push_to_listeners: function (info) {
            // push to listeners events
            for (let i = 0; i < listeners_events.length; i++) {
                listeners_events[i](info);
            }
        },
        trigger: function (id) {
            let tab_id = id.tab_id;
            const content_id = id.content_id;

            if (!tab_id && typeof content_id !== 'undefined') {
                const matched = content_id.match(/^(.+)-content$/);
                if (matched && matched[1]) {
                    tab_id = matched[1];
                }
            }

            if (!tab_id) {
                return false;
            }

            const tab_to_trigger = $('#' + tab_id);

            if (!tab_to_trigger.length || tab_to_trigger.hasClass('invisible')) {
                return false;
            }
            // else
            const tab = tab_to_trigger.find('.tm-a');
            if (tab.length) {
                return tab.trigger('click');
            }
            // else
            return tab_to_trigger.find('.tm-a-2').trigger('click');
        },
    };

    return that;
})();

module.exports = {
    MenuContent: MenuContent,
};
