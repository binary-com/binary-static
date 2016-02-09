pjax_config_page('/job-descriptions/job-details', function() {
    return {
        onLoad: function() {
          function showSelectedDiv() {
            $('.sections div').hide();
            $('.sections div[id=' + page.url.params_hash().dept + '-' + page.url.location.hash.substring(1) + ']').show();
          }
          $(window).on('hashchange', function(){
            showSelectedDiv();
          });
          $('.job-details').find('#title').html(page.url.params_hash().dept.replace(/_/g, ' '));
          var source = $('.dept-image').attr('src');
          $('.dept-image').attr('src', source.replace('Information_Technology', page.url.params_hash().dept));
          $('.dept-image').show();
          var deptContent = $('#content-' + page.url.params_hash().dept + ' div');
          var section,
              sections = ['section-one', 'section-two', 'section-three', 'section-four', 'section-five', 'section-six', 'section-seven', 'section-eight'];
          $('#sidebar-nav li').slice(deptContent.length).hide();
          for (i = 0; i < deptContent.length; i++) {
              section = $('#' + page.url.params_hash().dept + '-' + sections[i]);
              section.insertAfter('.sections div:last-child');
              if (section.attr('class')) {
                $('#sidebar-nav a[href="#' + sections[i] + '"]').html(section.attr('class').replace(/_/g, ' '));
              }
          }
          $('.sidebar').show();
          $('#' + page.url.location.hash.substring(9)).addClass('selected');
          showSelectedDiv();
          $('#sidebar-nav li').click(function(e) {
            $('#sidebar-nav li').removeClass('selected');
            $(this).addClass('selected');
          });
        }
    }
});
