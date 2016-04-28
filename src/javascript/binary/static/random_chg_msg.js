// temporary script to show message about Random renamed to Volatile on trading page

function showRandomRenamedMsg(msg) {
    if (JSON.parse(msg.data).msg_type !== 'active_symbols') {
        return;
    }
    var hasRandom = false;
    Object.keys(Symbols.markets())
        .forEach(function(s) {
            if (s === 'volidx') {
                hasRandom = true;
            }
        });

    if(page.language().toLowerCase() === 'id') {
        $('#temp_notice_msg a').attr('href', 'https://blog.binary.com/indeks-random-berganti-nama-menjadi-indeks-volatilitas/');
    }

    var tempMsgKey = 'hide_temp_msg';
    if (SessionStore.get(tempMsgKey) || !hasRandom) {
        $('#temp_notice_msg').addClass('invisible');
    }

    $('#close_temp_msg').click(function() {
        SessionStore.set(tempMsgKey, '1');
        $('#temp_notice_msg').addClass('invisible');
    });
}
