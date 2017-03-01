const Authenticate = (() => {
    const onLoad = () => {
        BinarySocket.send({ get_account_status: 1 }).then((response) => {
            if (response.error) {
                $('#error_message').removeClass('invisible').text(response.error.message);
            } else if (/authenticated/.test(response.get_account_status.status)) {
                $('#fully-authenticated').removeClass('invisible');
            } else {
                $('#not-authenticated').removeClass('invisible');
            }
        });
    };

    return {
        onLoad: onLoad,
    };
})();

module.exports = Authenticate;
