const sidebar = (() => {
    const sidebar = '.sidebar-collapsible';

    const getChildrenHeight = $el => {
        let totalHeight = 0;
        $el.children().each(function() {
            totalHeight += $(this).outerHeight(true);
        });
        return totalHeight;
    }

    const toggleSubmenu = $el => {
        const $parent  = $el.parent();
        const $submenu = $el.siblings('ul');
        if ($parent.is('.active')) {
            const totalHeight = getChildrenHeight($submenu);
            $submenu.animate({ height: `${totalHeight}px` }, 300);
            if (!$submenu.find('.active').length) {
                $submenu.find('li:first-child').addClass('active');
                $submenu.find('li:first-child > a').addClass('selected'); // set first child active
            }
        } else {
            $submenu.animate({ height: '0px' }, 300);
        }
        $parent.siblings().find('ul').animate({ height: '0px' }, 300);
    }

    const getTargetHref = current_target => {
        const submenu = current_target.nextElementSibling;
        const target  = submenu ? $(submenu).find($(submenu).find('.selected')[0] ? '.selected' : 'a:first')[0] : current_target;
        return target.getAttribute('href');
    }

    const showSelectedContent = current_target => {
        const $content = $('.sidebar-collapsible-content');
        if (!$content) return;
        const target   = getTargetHref(current_target);
        $content
          .find('> div')
          .addClass('invisible')
          .end()
          .find(`${target}-content`)
          .removeClass('invisible');
    }

      const checkWidth = () => {
          const mq = window.matchMedia('(max-width: 1023px)').matches;
          if (mq) {
              $('.sidebar-collapsible').css({ position: 'relative' });
              $(window).off('scroll', stickySidebar);
          } else {
              $(window).on('scroll', stickySidebar);
          }
          return mq;
      };
      const stickySidebar = () => {
          const $sidebar   = $('.sidebar-collapsible');
          const $content   = $('.sidebar-collapsible-content');
          const $container = $('.sidebar-collapsible-container');

          if (!$sidebar.is(':visible')) return;

          if (window.scrollY < $content.offset().top) {
              $sidebar.css({ position: 'relative' });
          } else if (window.scrollY + $sidebar[0].offsetHeight + 20 >=
            $container[0].offsetHeight + $container.offset().top) { // 20 is the padding for content from bottom, to avoid menu snapping back up
              $sidebar.css({ position: 'absolute', bottom: '20px', top: '', width: sidebar_width });
          } else {
              $sidebar.css({ position: 'fixed', top: '0px', bottom: '', width: sidebar_width });
          }
      };

    const initSidebar = () => {
        if ($(sidebar).find('.active').length) {
            $(sidebar).find('.active').removeClass('active');
        }

        checkWidth();
        window.onresize = checkWidth;
        const hash = window.location.hash || '#legal-binary';
        const currentTarget = $(sidebar).find(`a${hash}`);
        currentTarget.parent('li').addClass('active');
        currentTarget.addClass('selected');

        $(sidebar).find('a').off('click').on('click', function(e) {
            e.preventDefault();
            const $this     = $(this);
            const $parent   = $this.parent('li');
            const $siblings = $parent.siblings('li');
            if ($parent.hasClass('has-submenu')) {
                $this.toggleClass('selected').parent('li').toggleClass('active');
            } else {
                $this.addClass('selected').parent('li').addClass('active');
            }
            $siblings.removeClass('active').find('> a').removeClass('selected');
            toggleSubmenu($this);
            showSelectedContent(e.target);
        });
    }
    return {
        initSidebar,
    }
}
)();

module.exports = sidebar;