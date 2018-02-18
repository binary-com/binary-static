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
          // history.replaceState(undefined, undefined, target);
          $content
            .find('> div')
            .addClass('invisible')
            .end()
            .find(`${target}-content`)
            .removeClass('invisible');
          return false;
      }

      const onLoad = () => {
          if ($(sidebar).find('.active').length) {
              $(sidebar).find('.active').removeClass('active');
          }


          $('.sidebar-collapsible').on('click', 'a', function(e) {
              const $this     = $(this);
              const $parent   = $this.parent('li');
              const $siblings = $parent.siblings('li');
              if ($this.hasClass('submenu-item')) {
                  $this.addClass('selected').parent('li').addClass('active');
                  $parent.parent('li').addClass('active');
              } else if ($parent.hasClass('has-submenu')) {
                  $this.toggleClass('selected').parent('li').toggleClass('active');
              } else {
                  $this.addClass('selected').parent('li').addClass('active');
              }
              $siblings.removeClass('active').find('> a').removeClass('selected');

              toggleSubmenu($this);
              return showSelectedContent(e.target);
          });


          // defining first selected
          const firstList = $(sidebar).find('li:first-child')[0];
          // if the first list item is nested
          if ($(firstList).hasClass('has-submenu')) {
              const firstLink = $(firstList).find('a:first-child')[0];
              const firstSublink = $(firstList).find('li:first-child > a:first-child')[0];
              $(firstLink).trigger('click');
              $(firstSublink).trigger('click');
          } else {
              const link = $(firstList).find('a:first-child')[0];
              $(link).trigger('click');
          }
      }
      return {
          onLoad,
      }
  }
)();

module.exports = sidebar;