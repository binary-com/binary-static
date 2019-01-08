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
    const style_offset_correction = 5;

    const init = (container_id, contract_type, barrier, tick_count, status = 'open') => {
        contract_status      = status;
        total_tick_count     = tick_count;
        current_spot         = '-';
        el_container         = document.querySelector(`#${container_id}`);
        populateContainer(el_container);
        highlightWinningNumbers(getWinningNumbers(contract_type, barrier));
        observeResize();
    };

    const populateContainer = (container_element) => {
        // remove previous elements and start fresh.
        while (container_element.firstChild) {
            container_element.removeChild(container_element.firstChild);
        }

        const temp_epoch_el = document.createElement('div');
        temp_epoch_el.classList.add('epoch');
        const temp_peek_box_el = document.createElement('div');
        temp_peek_box_el.classList.add('peek-box');
        if (contract_status === 'won') {
            temp_peek_box_el.classList.add('digit-winning');
        }
        if (contract_status === 'lost') {
            temp_peek_box_el.classList.add('digit-losing');
        }

        const temp_digits_el = document.createElement('div');
        temp_digits_el.classList.add('digits');
        array_of_digits.forEach(digit => {
            const digit_el = document.createElement('div');
            digit_el.classList.add('digit', `digit-${digit}`);
            digit_el.appendChild(document.createTextNode(digit));
            temp_digits_el.appendChild(digit_el);
        });

        const temp_mask_el = document.createElement('div');
        temp_mask_el.classList.add('mask');
        temp_mask_el.append(document.createTextNode('0/0'));

        const temp_peek_el = document.createElement('div');
        temp_peek_el.classList.add('peek');
        // grid peek-box element definition
        const topleft_el = document.createElement('div');
        topleft_el.classList.add('topleft');
        const top_el = document.createElement('div');
        top_el.classList.add('top');
        const topright_el = document.createElement('div');
        topright_el.classList.add('topright');
        const left_el = document.createElement('div');
        left_el.classList.add('left');
        const right_el = document.createElement('div');
        right_el.classList.add('right');
        const bottomleft_el = document.createElement('div');
        bottomleft_el.classList.add('bottomleft');
        const bottom_el = document.createElement('div');
        bottom_el.classList.add('bottom');
        const bottomright_el = document.createElement('div');
        bottomright_el.classList.add('bottomright');
        temp_peek_box_el.appendChild(topleft_el);
        temp_peek_box_el.appendChild(top_el);
        temp_peek_box_el.appendChild(topright_el);
        temp_peek_box_el.appendChild(left_el);
        temp_peek_box_el.appendChild(right_el);
        temp_peek_box_el.appendChild(bottomright_el);
        temp_peek_box_el.appendChild(bottomleft_el);
        temp_peek_box_el.appendChild(bottom_el);
        temp_peek_box_el.appendChild(temp_mask_el);
        temp_peek_box_el.appendChild(temp_peek_el);

        const fragment = document.createDocumentFragment();
        fragment.appendChild(temp_epoch_el);
        fragment.appendChild(temp_peek_box_el);
        fragment.appendChild(temp_digits_el);
        container_element.appendChild(fragment);
        container_element.classList.add('invisible');
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

    const markDigitAsWon = (digit) => {
        el_container.querySelector(`.digit-${digit}`).classList.add('digit-won');
    };

    const markDigitAsLost = (digit) => {
        el_container.querySelector(`.digit-${digit}`).classList.add('digit-lost');
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

    const update = (current_tick_count, { quote, epoch }) => {
        setElements(epoch);
        el_container.classList.remove('invisible');
        adjustBoxSizes();
        current_spot = quote.substr(-1);

        el_mask.innerText = `${current_tick_count} / ${total_tick_count}`;
        // el_peek.innerText = current_spot;

        el_peek_box.classList.add('digit-running');
        el_peek.classList.add('digit-running');

        el_peek_box.setAttribute('style', `transform: translateX(${calculateOffset()}px)`);
    };

    const remove = () => {
        window.onresize = null;
    };

    return {
        init,
        update,
        markAsWon,
        markAsLost,
        markDigitAsLost,
        markDigitAsWon,
        remove,
    };
})();

module.exports = DigitTicker;
