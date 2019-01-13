const moment               = require('moment');
const DigitTicker          = require('./digit_ticker');
const ViewPopupUI          = require('../user/view_popup/view_popup.ui');
const showLocalTimeOnHover = require('../../base/clock').showLocalTimeOnHover;
const BinarySocket         = require('../../base/socket');
const localize             = require('../../../_common/localize').localize;
const getPropertyValue     = require('../../../_common/utility').getPropertyValue;

const DigitDisplay = (() => {
    let $container,
        contract,
        tick_count,
        spot_times;

    const init = (id_render, proposal_open_contract) => {
        tick_count = 1;
        contract   = proposal_open_contract;
        spot_times = [];

        $container = $(`#${id_render}`);
        $container
            .addClass('normal-font')
            .html($('<h5 />', { text: contract.display_name, class: 'center-text' }))
            .append($('<div />', { class: 'gr-6 gr-centered gr-12-m' })
                .append($('<div />', { class: 'gr-row', id: 'table_digits' })
                    .append($('<strong />', { class: 'gr-3', text: localize('Tick') }))
                    .append($('<strong />', { class: 'gr-3', text: localize('Spot') }))
                    .append($('<strong />', { class: 'gr-6', text: localize('Spot Time (GMT)') }))))
            .append($('<div />', { class: 'digit-ticker invisible', id: 'digit_ticker_container' }));

        DigitTicker.init(
            'digit_ticker_container',
            contract.contract_type,
            contract.barrier,
            contract.tick_count,
            contract.status
        );

        const request = {
            ticks_history: contract.underlying,
            start        : contract.date_start,
        };

        // Subscribe if contract is still ongoing/running.
        if (contract.current_spot_time < contract.date_expiry) {
            request.subscribe = 1;
            request.end       = 'latest';
        } else {
            request.end = contract.date_expiry;
        }

        BinarySocket.send(request, { callback: update });
    };

    const updateTable = (spot, time) => {
        if (spot_times.some(item => item.spot === spot && item.time === time)) {
            return;
        }
        spot_times.push({
            spot,
            time,
        });

        const last_digit = spot.slice(-1);
        $container
            .find('#table_digits')
            .append($('<p />', { class: 'gr-3', text: tick_count }))
            .append($('<p />', { class: 'gr-3 gray', html: tick_count === contract.tick_count ? `${spot.slice(0, spot.length - 1)}<strong>${last_digit}</strong>` : spot }))
            .append($('<p />', { class: 'gr-6 gray digit-spot-time no-underline', text: moment(+time * 1000).utc().format('YYYY-MM-DD HH:mm:ss') }));

        DigitTicker.update(
            tick_count,
            {
                quote: last_digit,
            }
        );
    };

    const update = (response) => {
        if (!$container.is(':visible') || !response || (!response.tick && !response.history)) {
            return;
        }

        if (getPropertyValue(response, ['tick', 'id']) && document.getElementById('sell_content_wrapper')) {
            ViewPopupUI.storeSubscriptionID(response.tick.id);
        }

        if (response.history) {
            response.history.times.some((time, idx) => {
                if (+time >= +contract.entry_tick_time) {
                    updateTable(response.history.prices[idx], time);
                    tick_count += 1;
                }
                return tick_count > contract.tick_count;
            });
        } else if (response.tick) {
            if (tick_count <= contract.tick_count) {
                updateTable(response.tick.quote, response.tick.epoch);
                tick_count += 1;
            }
        }
        showLocalTimeOnHover('.digit-spot-time');
    };

    const end = (proposal_open_contract) => {
        if (proposal_open_contract.status === 'won') {
            DigitTicker.markAsWon();
            DigitTicker.markDigitAsWon(proposal_open_contract.exit_tick.slice(-1));
        }
        if (proposal_open_contract.status === 'lost') {
            DigitTicker.markAsLost();
            DigitTicker.markDigitAsLost(proposal_open_contract.exit_tick.slice(-1));
        }
    };

    return {
        end,
        init,
        update,
    };
})();

module.exports = DigitDisplay;
