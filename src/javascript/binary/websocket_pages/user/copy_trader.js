const moment = require('moment');

const CopyTrader = (() => {
    const form = '#frm_copy_trader';
    const display_form = '#fld_display_copier';

    const init = () => {
        $(form).off('submit').on('submit', (evt) => {
            evt.preventDefault();
            BinarySocket.send({
                copytrading_statistics: 1,
                trader_id             : $(form).find('#loginid_copy').val(),
            });
        });
    };

    const onResponse = (response) => {
        const $error = $(form).find('.errorfield');
        if (response.error) {
            $error.text(response.error.message).removeClass('invisible');
            return;
        }
        // else
        $error.addClass('invisible');

        const copytrading_statistics = response.copytrading_statistics;
        Object.keys(copytrading_statistics).forEach((key) => {
            if (key === 'active_since') {
                copytrading_statistics[key] = moment.utc(copytrading_statistics[key] * 1000).format('dddd, MMM D');
            }
            $(`#${key}`).text(copytrading_statistics[key]);
        });
        $(display_form)
            .find('legend')
            .text(response.echo_req.trader_id)
            .end()
            .removeClass('invisible');
    };

    return {
        init      : init,
        onResponse: onResponse,
    };
})();

module.exports = {
    CopyTrader: CopyTrader,
};
