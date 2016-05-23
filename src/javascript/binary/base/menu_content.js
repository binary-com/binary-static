var MenuContent = (function () {
    var listeners_events = [];

    var that = {
        init: function (_menu_containers) {
            _menu_containers.filter(':not(.follow-default)').delegate('.tm-a,.tm-a-2', 'click', function (event) {
                event.preventDefault();

                var target = $(event.target);
                var tab_id = target.parents('li:first').attr('id');

                if (tab_id)
                {
                    var tab_container = target.parents('.tm-ul');

                    var selected_tab =
                        // find previously active tab
                        tab_container.find('.tm-a,.tm-a-2')
                        // remove previously active tab
                        .removeClass('a-active').end()
                        // unwrap previously active tab
                        .find('.menu-wrap-a .tm-a').unwrap().unwrap()
                        // go back to selected target
                        .end().end()
                        // set active class to it
                        .addClass('a-active')
                        // set active class to its parent as well
                        .parents('.tm-li').addClass('active').removeClass('hover').find('.tm-li-2').addClass('active').end()
                        // wrap it
                        .find('.tm-a').wrap('<span class="menu-wrap-a"><span class="menu-wrap-b"></span></span>').end()
                        // remove previously active parent
                        .siblings().removeClass('active').find('.tm-li-2').removeClass('active').end()
                        .end().end();

                    // replace span to a, to make it clickable for real
                    var span_tm_a = tab_container.find('span.tm-a');
                    span_tm_a.replaceWith('<a href="#" class="'+span_tm_a.attr('class')+'">'+span_tm_a.html()+'</a>');

                    var menu_li = selected_tab.parents('li');
                    var sub_menu_selected = menu_li.find('.tm-ul-2 .a-active');
                    var selected_tab_id = menu_li.attr('id');

                    if (!sub_menu_selected.length)
                    {
                        sub_menu_selected = menu_li.find('.tm-a-2:first').addClass('a-active');

                        if (sub_menu_selected.length)
                        {
                            selected_tab = sub_menu_selected;
                            selected_tab_id = sub_menu_selected.parents('li').attr('id');
                            selected_content = $('#'+selected_tab_id+'-content').removeClass('invisible');
                        }
                        else
                        {
                            selected_tab_id = menu_li.attr('id');
                        }
                    }

                    var selected_content = $('#'+selected_tab_id+'-content')
                        // show selected tab content
                        .removeClass('invisible')
                        // and hide the rest
                        .siblings(':not(.sticky)').addClass('invisible').end();

                    that.push_to_listeners({
                        'id': selected_tab_id,
                        'target': selected_tab,
                        'content': selected_content,
                        'menu': menu_li.parents('ul.tm-ul'),
                        'event': event
                    });
                }

                return false;
            });
        },
        push_to_listeners: function (info)
        {
            // push to listeners events
            for (var i=0; i<listeners_events.length; i++)
            {
                listeners_events[i](info);
            }
        },
        listen_click: function (callback)
        {
            if (typeof callback != 'function')
            {
                return false;
            }

            listeners_events.push(callback);
        },
        find_selected_tab: function (menu_id)
        {
            var menu = $('#'+menu_id);
            var selected_tab = menu.find('.a-active').parents('.tm-li');

            if (!selected_tab.length)
            {
                selected_tab = menu.find('.active');
            }

            return selected_tab;
        },
        is_tab_selected: function (tab)
        {
            return tab.hasClass('active');
        },
        hide_tab: function (tab)
        {
            tab.addClass('invisible').find('.menu-wrap-a .tm-a').unwrap().unwrap();
            $('#'+tab.attr('id')+'-content').addClass('invisible');
        },
        show_tab: function (tab)
        {
            tab.removeClass('invisible');
        },
        trigger: function (id)
        {
            var tab_id = id['tab_id'];
            var content_id = id['content_id'];

            if (!tab_id && typeof content_id != 'undefined') {
                var matched = content_id.match(/^(.+)-content$/);
                if (matched && matched[1]) {
                    tab_id = matched[1];
                }
            }

            if (!tab_id)
            {
                return false;
            }

            var tab_to_trigger = $('#'+tab_id);

            if (!tab_to_trigger.size() || tab_to_trigger.hasClass('invisible'))
            {
                return false;
            }
            else
            {
                var tab = tab_to_trigger.find('.tm-a');
                if (tab.size())
                {
                    return tab.trigger('click');
                }
                else
                {
                    return tab_to_trigger.find('.tm-a-2').trigger('click');
                }
            }
        }
    };

    return that;
})();
