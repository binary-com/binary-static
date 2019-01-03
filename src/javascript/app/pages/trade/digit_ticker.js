const DIGIT_BLOCK_SIZE        = 36;
const DIGIT_BLOCK_CORRECTION  = 2;

const DigitTicker = (() => {
    let $container, total_tick_count, _status, _digit;
    const digits         = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    const init           = (container_id, contract_type, barrier, tick_count, status) => {
        total_tick_count = tick_count;
        $container       = $(`#${container_id}`);
        _digit = '-';
        _status          = status;
        $container.empty();
        $container
            .append($('<div />', { class: 'peek-box' })
                .append($('<div />', { class: 'mask', text: '0/0' }))
                .append($('<div />', { class: 'peek' })))
            .append($('<div />', {
                class: 'digits', html : digits.map(digit => `<div class='digit digit-${digit}'>${digit}</div>`).join(''),
            }));
        colorWinningBoxes(winningNumbers(contract_type, barrier));
        observeResize();
    };

    const winningNumbers = (contract_type, barrier) => {
        switch (contract_type) {
            case 'DIGITOVER':
                return digits.filter(digit => +digit > +barrier);
            case 'DIGITUNDER':
                return digits.filter(digit => +digit < +barrier);
            case 'DIGITMATCH':
                return digits.filter(digit => +digit === +barrier);
            case 'DIGITDIFF':
                return digits.filter(digit => +digit !== +barrier);
            case 'DIGITODD':
                return digits.filter(digit => +digit % 2 !== 0);
            case 'DIGITEVEN':
                return digits.filter(digit => +digit % 2 === 0);
            default:
                throw new Error('Cannot Determine Winning numbers.');
        }
    };

    const colorWinningBoxes = (winning_numbers) => {
        winning_numbers.forEach(digit => {
            $(`.digit-${digit}`).css({
                backgroundColor: '#9ddfcb', color          : '#67b9a0',
            });
        });
    };

    const calculateOffset = () => {
        const left_offset = calculateLeftMargin($container.width());
        return (+_digit * DIGIT_BLOCK_SIZE) + left_offset - DIGIT_BLOCK_CORRECTION;
    };

    const getTotal = () => total_tick_count;

    const success = () => {
        const peekBox = $('.peek-box');
        const peek    = $('.peek');
        peekBox.css({
            backgroundColor: '#077453', color          : '#ffffff',
        });
        peek.css({
            color: '#077453',
        });
    };

    const fail = () => {
        const peekBox = $('.peek-box');
        const peek    = $('.peek');

        peekBox.css({
            backgroundColor: '#cb0433',
            color          : '#fffff',
        });
        peek.css({
            color: '#cb0433',
        });
    };

    const update = (current_tick, { quote }) => {
        $container.removeClass('invisible');
        const peekBox = $('.peek-box');
        const peek    = $('.peek');
        const mask    = $('.peek-box > .mask');

        peekBox.addClass('running');
        _digit = quote.substr(-1);

        mask.text(`${current_tick}/${getTotal()}`);

        peek.text(_digit);

        peekBox.css({
            left           : `${calculateOffset(_digit)}px`,
            color          : '#ffffff',
            backgroundColor: '#454545',
        });
        peekBox.css({
            backgroundColor: '#454545',
            color          : '#fffff',
        });
        peek.css({
            color: '#454545',
        });
        if (_status === 'won') {
            success();
        }
        if (_status === 'lost') {
            fail();
        }
    };

    const calculateLeftMargin = (width) => (width - 360) / 2;

    const observeResize = () => {
        window.onresize = () => {
            calculateOffset();
        };
    };

    return {
        init,
        update,
        success,
        fail,
    };
})();

module.exports = DigitTicker;
