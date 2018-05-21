const Dropdown = require('@binary-com/binary-style').selectDropdown;

const Contact = (() => {

    const onLoad = () => {
        Dropdown('#cs_telephone_number');
        $('#cs_telephone_number').on('change.cs', function () {
            const val = $(this).val().split(',');
            $('#display_cs_telephone').html(val[0] + (val.length > 1 ? `<br />${val[1]}` : ''));
        });
    };

    return {
        onLoad,
    };
})();

module.exports = Contact;
