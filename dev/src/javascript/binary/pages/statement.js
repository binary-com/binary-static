onLoad.queue_for_url(function() {
    $('#portfolio-table')
        .on('click', '.paste_all_granters', function () {
            $(this).prev('textarea[name=granter_loginids]').val(document.getElementById('all_approved_granter_loginids').innerHTML);
        });
}, 'portfolio|statement|f_manager_history|f_manager_statement|f_manager_confodeposit');

onLoad.queue_for_url(function() {
    $('#statement-date').on('change', function() {
        $('#submit-date').removeClass('invisible');
    });
}, 'statement');
