const Contact = (() => {
    const onLoad = () => {
        $('.contact-content').on('change', '#cs_telephone_number', function () {
            const val = $(this).val().split(',');
            $('#display_cs_telephone').html(val[0] + (val.length > 1 ? `<br />${val[1]}` : ''));
        });
    };

    return {
        onLoad,
    };
})();

module.exports = Contact;
