const Sidebar = (() => {
      const sidebar = '.sidebar-collapsible';
      //
      const getChildrenHeight = $el => {
          let totalHeight = 0;
          $el.children().each(function() {
              totalHeight += $(this).outerHeight(true);
          });
          return totalHeight;
      }

      const showSelectedContent = () => {
          const hash = window.location.hash;
          const currentTarget = $(sidebar).find(hash);

          if ($(currentTarget).hasClass('has-submenu')) {
              $(currentTarget).addClass('active');
              const collapsedList = $(currentTarget).find('ul');
              const totalHeight = getChildrenHeight(collapsedList);
              $(collapsedList).animate({ height: `${totalHeight}px` }, 300);
              const firstSubMenuList = $(currentTarget).find('li:first-child')[0];
              $(firstSubMenuList).addClass('active').find('a').addClass('selected');
          } else if ($(currentTarget).hasClass('submenu-item')) {
              $(currentTarget).addClass('active').find('a').addClass('selected').parent('li.has-submenu').addClass('active');
              const collapsedList = $(currentTarget).parent('ul');
              const totalHeight = getChildrenHeight(collapsedList);
              $(collapsedList).animate({ height: `${totalHeight}px` }, 300);

          } else {
              $(currentTarget).addClass('active').find('a').addClass('selected');
          }

              const $content = $('.sidebar-collapsible-content');
              if (!$content) return;
              const target   = !$(currentTarget).hasClass('has-submenu') ? hash : `#${($(currentTarget).find('li:first-child')[0]).id}`;

              $content
                .find('> div')
                .addClass('invisible')
                .end()
                .find(`${target}-content`)
                .removeClass('invisible');
      }

      const init = (show_div = true) => {
          const $sidebar_list_item = $(`${sidebar} li`);
          $sidebar_list_item.click(() => {
              $sidebar_list_item.removeClass('selected');
              $(this).addClass('selected');
          });
          $(window).on('hashchange', showSelectedContent);
          if (show_div) {
              showSelectedContent();
          }
      }

      const clean = () => {
          $(window).off('hashchange', showSelectedContent);
      };


      return {
          init,
          clean,
      };
  })();

module.exports = Sidebar;

