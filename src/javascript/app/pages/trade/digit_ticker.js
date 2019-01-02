const DIGIT_BLOCK_SIZE        = 36;
const DIGIT_BLOCK_LEFT_OFFSET = 66;
const DIGIT_BLOCK_CORRECTION  = 2;

const DigitTicker = (() => {
    let $container, source;
    const digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    const init   = (container_id, contract) => {
        source = contract;

        $container = $(`#${container_id}`);
        $container
            .append($('<div />', { class: 'peek-box' })
                .append($('<div />', { class: 'mask', text: '0/0' }))
                .append($('<div />', { class: 'peek' })))
            .append($('<div />', {
                class: 'digits', html : digits.map(digit => `<div class='digit digit-${digit}'>${digit}</div>`).join(''),
            }));
        colorWinningBoxes(winningNumbers(contract));
    };

    const winningNumbers = (contract) => {
        switch (contract.contract_type) {
            case 'DIGITOVER':
                return digits.filter(digit => +digit > +contract.barrier);
            case 'DIGITUNDER':
                return digits.filter(digit => +digit < +contract.barrier);
            case 'DIGITMATCH':
                return digits.filter(digit => +digit === +contract.barrier);
            case 'DIGITDIFF':
                return digits.filter(digit => +digit !== +contract.barrier);
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
                backgroundColor: '#9ddfcb',
                color          : '#67b9a0',
            });
        });
    };

    const isRunning = (digit) => /[\d]/g.test(digit);

    const calculateOffset = (digit) => isRunning(digit) ?
        (+digit * DIGIT_BLOCK_SIZE) + DIGIT_BLOCK_LEFT_OFFSET - DIGIT_BLOCK_CORRECTION : 0;

    const getTotal = () => source.tick_count;

    const isWon = () => source.status === 'won';

    const update = (tick_count, current) => {
        $container.removeClass('invisible');
        const peekBox = $('.peek-box');
        const peek    = $('.peek');
        const mask    = $('.peek-box > .mask');

        peekBox.addClass('running');

        mask.text(`${tick_count}/${getTotal()}`);

        peek.text(current);

        peekBox.css({
            left           : `${calculateOffset(current)}px`,
            color          : '#ffffff', backgroundColor: '#454545',
        });

        if (isWon()) {
            peekBox.css({
                backgroundColor: '#077453',
                color          : '#ffffff',
            });
            peek.css({
                color: '#077453',
            });
        } else {
            peekBox.css({
                backgroundColor: '#cb0433',
                color          : '#fffff',
            });
            peek.css({
                color: '#cb0433',
            });
        }
    };

    return {
        init,
        update,
    };
})();

module.exports = DigitTicker;
