const moment               = require('moment');
const DigitTicker          = require('./digit_ticker');
const ViewPopupUI          = require('../user/view_popup/view_popup.ui');
const showLocalTimeOnHover = require('../../base/clock').showLocalTimeOnHover;
const LoadingSpinner       = require('../../components/loading-spinner');
const localize             = require('../../../_common/localize').localize;

const DigitDisplay = (() => {
    let $container;

    const initTable = (id_render, calculated_height, poc) => {
        $container = $(`#${id_render}`);
        $container
            .addClass('normal-font')
            .html($('<h5 />', {
                text : poc.display_name,
                class: 'center-text',
            }))
            .append($('<div />', {
                class: 'gr-8 gr-centered gr-12-m',
                id   : 'table_digits_container',
            })
                .append($('<div />', {
                    class: 'gr-row',
                    id   : 'table_digits',
                })
                    .append($('<strong />', {
                        class: 'gr-3',
                        text : localize('Tick'),
                    }))
                    .append($('<strong />', {
                        class: 'gr-3',
                        text : localize('Spot'),
                    }))
                    .append($('<strong />', {
                        class: 'gr-6',
                        text : localize('Spot Time (GMT)'),
                    }))))
            .append($('<div />', {
                class: 'digit-ticker invisible',
                id   : 'digit_ticker_container',
            }));
        LoadingSpinner.show('table_digits');
    };

    const calculateTableHeight = (proposal_open_contract) => (proposal_open_contract.tick_count + 1) * 40;

    const renderTable = (id_render, poc) => {
        const el_tick_chart = document.getElementById(id_render);
        if (!el_tick_chart || el_tick_chart.childElementCount < 3) return;

        if (DigitTicker.isInitialized()) {
            DigitTicker.update(
                poc.tick_stream.length,
                {
                    tick_display_value: poc.status !== 'open' ? poc.exit_tick_display_value : poc.current_spot_display_value,
                    epoch             : +poc.exit_tick_time || +poc.current_spot_time,
                }
            );
        }

        const el_container = document.getElementById('table_digits');
        if (el_container.childElementCount > 3) {
            el_container.innerHTML = '';
            el_container.append(createHeadingElements());
        }

        ViewPopupUI.storeSubscriptionID(poc.id);
        LoadingSpinner.hide('table_digits');
        poc.tick_stream.forEach((tick, index) => {
            $('#table_digits')
                .append(
                    renderRow(tick, index + 1, poc.tick_count)
                );
        });
        showLocalTimeOnHover('.digit-spot-time');
    };

    const createCounterElement = (csv_spot, index, total) => {
        const el_counter = document.createElement('p');
        el_counter.classList.add('gr-3', 'gray');
        el_counter.innerHTML = index === total ? `${csv_spot.slice(0,
            csv_spot.length - 1,
        )}<strong>${csv_spot.substr(-1)}</strong>` : csv_spot;
        return el_counter;
    };

    const createIndexElement = (index) => {
        const el_index = document.createElement('p');
        el_index.classList.add('gr-3');
        el_index.innerText = index;
        return el_index;
    };

    const createSpotElement = (tick) => {
        const el_spot = document.createElement('p');
        'gr-6 gray digit-spot-time no-underline'
            .split(' ')
            .forEach(class_name => {
                el_spot.classList.add(class_name);
            });
        el_spot.innerText = moment(+tick.epoch * 1000).utc().format('YYYY-MM-DD HH:mm:ss');
        return el_spot;
    };

    const renderRow = (tick, index, total) => {
        const el_fragment = document.createDocumentFragment();
        el_fragment.append(createIndexElement(index));
        el_fragment.append(createCounterElement(tick.tick_display_value, index, total));
        el_fragment.append(createSpotElement(tick));

        return el_fragment;
    };

    const createHeadingElements = () => {
        const tick      = document.createElement('strong');
        const spot      = document.createElement('strong');
        const spot_time = document.createElement('strong');

        tick.innerText = localize('Tick');
        tick.classList.add('gr-3');

        spot.innerText = localize('Spot');
        spot.classList.add('gr-3');

        spot_time.innerText = localize('Spot Time (GMT)');
        spot_time.classList.add('gr-6');

        const fragment = document.createDocumentFragment();
        fragment.append(tick, spot, spot_time);

        return fragment;
    };

    const init = (id_render, proposal_open_contract) => {
        initTable(id_render, calculateTableHeight(proposal_open_contract), proposal_open_contract);
        DigitTicker.init(
            'digit_ticker_container',
            proposal_open_contract.contract_type,
            proposal_open_contract.shortcode,
            proposal_open_contract.tick_count,
            proposal_open_contract.status
        );
        renderTable(id_render, proposal_open_contract);
    };

    const end = (proposal_open_contract) => {
        if (proposal_open_contract.status !== 'open') {
            DigitTicker.update(proposal_open_contract.tick_count, {
                tick_display_value: proposal_open_contract.exit_tick_display_value
                    || proposal_open_contract.tick_stream.slice(-1).tick_display_value,
                epoch: +proposal_open_contract.exit_tick_time,
            });
        }
        if (proposal_open_contract.status === 'won') {
            DigitTicker.markAsWon();
            DigitTicker.markDigitAsWon(proposal_open_contract.exit_tick_display_value.slice(-1));
        }
        if (proposal_open_contract.status === 'lost') {
            DigitTicker.markAsLost();
            DigitTicker.markDigitAsLost(proposal_open_contract.exit_tick_display_value.slice(-1));
        }
    };

    return {
        calculateTableHeight,
        end,
        init,
        initTable,
        renderTable,
    };
})();

module.exports = DigitDisplay;
