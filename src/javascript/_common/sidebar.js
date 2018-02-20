const Sidebar = (() => {
    const sidebar = '.sidebar-collapsible';
    const getChildrenHeight = $el => {
        let totalHeight = 0;
        $el.children().each(function() {
            totalHeight += $(this).outerHeight(true);
        });
        return totalHeight;
    };

    const showSelectedContent = () => {
        const hash = window.location.hash;
        const currentTarget = $(sidebar).find(hash);

        if ($(currentTarget).hasClass('has-submenu')) {
            const collapsedList = $(currentTarget).find('ul');
            const totalHeight = getChildrenHeight(collapsedList);
            $(collapsedList).css('height',`${totalHeight}px`);
            const firstSubMenuList = $(currentTarget).find('li:first-child')[0];
            $(firstSubMenuList).addClass('active').find('a').addClass('selected');
            $(currentTarget).addClass('active');
        } else if ($(currentTarget).hasClass('submenu-item')) {
            const collapsedList = $(currentTarget).parent('ul');
            const totalHeight = getChildrenHeight(collapsedList);
            $(collapsedList).css('height',`${totalHeight}px`);
            $(currentTarget).addClass('active').find('a').addClass('selected').parent('li.has-submenu').addClass('active');
        } else {
            $(currentTarget).addClass('active').find('a').addClass('selected');
        }

        const $content = $('.sidebar-collapsible-content');
        if (!$content) return;
        const target = !$(currentTarget).hasClass('has-submenu') ?
          hash : `#${($(currentTarget).find('li:first-child')[0]).id}`;

        $content
          .find('> div')
          .addClass('invisible')
          .end()
          .find(`${target}-content`)
          .removeClass('invisible');
    };

    const init = (show_div = true) => {
        $(window).on('hashchange', showSelectedContent);
        if (show_div) {
            showSelectedContent();
        }
    };

    const clean = () => {
        $(window).off('hashchange', showSelectedContent);
    };


    return {
        init,
        clean,
    };
  })();

module.exports = Sidebar;

