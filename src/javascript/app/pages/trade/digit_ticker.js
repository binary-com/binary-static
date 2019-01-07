const DigitTicker = (() => {
    let el_container,
        el_peek,
        el_peek_box,
        el_mask,
        total_tick_count,
        contract_status,
        current_spot;
    let digit_block_size = 36;

    const array_of_digits         = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    const style_offset_correction = 2;

    const init = (container_id, contract_type, barrier, tick_count, status) => {
        total_tick_count     = tick_count;
        current_spot         = '-';
        contract_status      = status;
        el_container           = document.querySelector(`#${container_id}`);
        el_container.innerHTML = `
            <div class='peek-box'>
                <div class='mask'>0/0</div>
                <div class='peek'></div>
            </div>
            <div class='digits'>
                ${array_of_digits.map(digit => `<div class='digit digit-${digit}'>${digit}</div>`).join('')}
            </div>
        `;
        highlightWinningNumbers(getWinningNumbers(contract_type, barrier));
        observeResize();
    };

    // adjust box sizes for mobile
    const adjustBoxSizes = () => {
        if (el_container.offsetWidth < 360) {
            digit_block_size = 28;
        }
    };

    // Detect winning numbers against the barrier with the given contract type.
    const getWinningNumbers = (contract_type, barrier) => {
        switch (contract_type) {
            case 'DIGITOVER':
                return array_of_digits.filter(digit => +digit > +barrier);
            case 'DIGITUNDER':
                return array_of_digits.filter(digit => +digit < +barrier);
            case 'DIGITMATCH':
                return array_of_digits.filter(digit => +digit === +barrier);
            case 'DIGITDIFF':
                return array_of_digits.filter(digit => +digit !== +barrier);
            case 'DIGITODD':
                return array_of_digits.filter(digit => +digit % 2 !== 0);
            case 'DIGITEVEN':
                return array_of_digits.filter(digit => +digit % 2 === 0);
            default:
                throw new Error('Cannot Determine Winning numbers.');
        }
    };

    const highlightWinningNumbers = (winning_numbers) => {
        winning_numbers.forEach(digit => {
            const element = el_container.querySelector(`.digit-${digit}`);
            element.classList.remove('digit-losing');
            element.classList.add('digit-winning');
        });
    };

    const observeResize = () => {
        window.onresize = () => {
            if (el_peek_box) {
                adjustBoxSizes();
                el_peek_box.setAttribute('style', `transform: translateX(${calculateOffset()}px)`);
            }
        };
    };

    // Calculate left margin of the peek-box against the "width" of the container
    const calculateLeftMargin = (width) => (width - (digit_block_size * 10)) / 2;

    // Calculate peek-box left offset.
    const calculateOffset = () => {
        const left_offset = calculateLeftMargin(el_container.offsetWidth);
        return (+current_spot * digit_block_size) + left_offset - style_offset_correction;
    };

    const markAsLost = () => {
        if (!el_peek_box || !el_peek) {
            setElements();
        }
        el_peek.classList.remove('digit-winning', 'digit-running');
        el_peek_box.classList.remove('digit-winning', 'digit-running');
        el_peek.classList.add('digit-losing');
        el_peek_box.classList.add('digit-losing');
    };

    const markAsWon = () => {
        if (!el_peek_box || !el_peek) {
            setElements();
        }
        el_peek_box.classList.remove('digit-losing', 'digit-running');
        el_peek_box.classList.add('digit-winning');
        el_peek.classList.remove('digit-losing', 'digit-running');
        el_peek.classList.add('digit-winning');
    };

    const setElements = () => {
        el_peek     = el_container.querySelector('.peek');
        el_peek_box = el_container.querySelector('.peek-box');
        el_mask     = el_peek_box.querySelector('.peek-box > .mask');
    };

    const update = (current_tick_count, { quote }) => {
        setElements();
        el_container.classList.remove('invisible');
        adjustBoxSizes();
        current_spot = quote.substr(-1);

        el_mask.innerText = `${current_tick_count}/${total_tick_count}`;
        el_peek.innerText = current_spot;

        el_peek_box.classList.add('digit-running');
        el_peek.classList.add('digit-running');

        el_peek_box.setAttribute('style', `transform: translateX(${calculateOffset()}px)`);

        if (contract_status === 'won') {
            markAsWon();
        }
        if (contract_status === 'lost') {
            markAsLost();
        }
    };

    const remove = () => {
        window.onresize = null;
    };

    return {
        init,
        update,
        markAsWon,
        markAsLost,
        remove,
    };
})();

module.exports = DigitTicker;
