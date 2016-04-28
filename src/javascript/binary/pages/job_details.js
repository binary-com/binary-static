pjax_config_page('/open-positions', function() {
  return {
      onLoad: function() {
        if (document.getElementById('Information_Technology')) {
          if (page.url.location.hash) {
              $.scrollTo($(page.url.location.hash));
          }
        }
      }
  };
});
pjax_config_page('/open-positions/job-details', function() {
    return {
        onLoad: function() {
          var dept = page.url.params_hash().dept,
              sidebarListItem = $('#sidebar-nav li');
          function showSelectedDiv() {
            $('.sections div').hide();
            $('.sections div[id=' + dept + '-' + page.url.location.hash.substring(1) + ']').show();
            $('.title-sections').html($('.sidebar li[class="selected"]').text());
          }
          $(window).on('hashchange', function(){
            showSelectedDiv();
          });
          $('.job-details').find('#title').html(text.localize(dept.replace(/_/g, ' ')));
          var deptImage = $('.dept-image'),
              sourceImage = deptImage.attr('src').replace('Information_Technology', dept);
          deptImage.attr('src', sourceImage)
                   .show();
          var deptContent = $('#content-' + dept + ' div');
          var section,
              sections = ['section-one', 'section-two', 'section-three', 'section-four', 'section-five', 'section-six', 'section-seven', 'section-eight'];
          sidebarListItem.slice(deptContent.length).hide();
          for (i = 0; i < deptContent.length; i++) {
              section = $('#' + dept + '-' + sections[i]);
              section.insertAfter('.sections div:last-child');
              if (section.attr('class')) {
                $('#sidebar-nav a[href="#' + sections[i] + '"]').html(text.localize(section.attr('class').replace(/_/g, ' ')));
              }
          }
          $('.sidebar').show();
          if ($('.sidebar li:visible').length === 1) {
            $('.sidebar').hide();
          }
          $('#' + page.url.location.hash.substring(9)).addClass('selected');
          showSelectedDiv();
          $('#back-button').attr('href', page.url.url_for('open-positions') + '#' + dept);
          sidebarListItem.click(function(e) {
            sidebarListItem.removeClass('selected');
            $(this).addClass('selected');
          });
        }
    };
});
