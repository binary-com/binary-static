onLoad.queue_for_url(function() {
    $('#statement-date').on('change', function() {
        $('#submit-date').removeClass('invisible');
    });
}, 'legacy-statement');
