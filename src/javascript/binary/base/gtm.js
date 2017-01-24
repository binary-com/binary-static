const getAppId    = require('../../config').getAppId;
const isVisible   = require('../common_functions/common_functions').isVisible;
const getLanguage = require('./language').getLanguage;
const Client      = require('./client').Client;
const State       = require('./storage').State;
const Cookies     = require('../../lib/js-cookie');
const moment      = require('moment');

const GTM = (function() {
    'use strict';

    const gtm_applicable = function() {
        return /^(1|1098)$/.test(getAppId());
    };

    const gtm_data_layer_info = function(data) {
        const data_layer_info = {
            language : getLanguage(),
            pageTitle: page_title(),
            pjax     : State.get('is_loaded_by_pjax'),
            url      : document.URL,
            event    : 'page_load',
        };
        if (Client.is_logged_in()) {
            data_layer_info.visitorId = Client.get('loginid');
        }

        $.extend(true, data_layer_info, data);

        const event = data_layer_info.event;
        delete data_layer_info.event;

        return {
            data : data_layer_info,
            event: event,
        };
    };

    const push_data_layer = function(data) {
        if (!gtm_applicable()) return;
        if (!(/logged_inws/i).test(window.location.pathname)) {
            const info = gtm_data_layer_info(data && typeof data === 'object' ? data : null);
            dataLayer[0] = info.data;
            dataLayer.push(info.data);
            dataLayer.push({ event: info.event });
        }
    };

    const page_title = function() {
        const t = /^.+[:-]\s*(.+)$/.exec(document.title);
        return t && t[1] ? t[1] : document.title;
    };

    const event_handler = function(get_settings) {
        if (!gtm_applicable()) return;
        const is_login      = localStorage.getItem('GTM_login')      === '1',
            is_newaccount = localStorage.getItem('GTM_newaccount') === '1';
        if (!is_login && !is_newaccount) {
            return;
        }

        localStorage.removeItem('GTM_login');
        localStorage.removeItem('GTM_newaccount');

        const affiliateToken = Cookies.getJSON('affiliate_tracking');
        if (affiliateToken) {
            GTM.push_data_layer({ bom_affiliate_token: affiliateToken.t });
        }

        const data = {
            visitorId  : Client.get('loginid'),
            bom_country: get_settings.country,
            bom_email  : get_settings.email,
            url        : window.location.href,
            bom_today  : Math.floor(Date.now() / 1000),
            event      : is_newaccount ? 'new_account' : 'log_in',
        };
        if (is_newaccount) {
            data.bom_date_joined = data.bom_today;
        }
        if (!Client.get('is_virtual')) {
            data.bom_age       = parseInt((moment().unix() - get_settings.date_of_birth) / 31557600);
            data.bom_firstname = get_settings.first_name;
            data.bom_lastname  = get_settings.last_name;
            data.bom_phone     = get_settings.phone;
        }
        GTM.push_data_layer(data);
    };

    const push_purchase_data = function(response) {
        if (!gtm_applicable() || Client.get('is_virtual')) return;
        const req = response.echo_req.passthrough,
            buy = response.buy;
        if (!buy) return;
        const data = {
            event             : 'buy_contract',
            visitorId         : Client.get('loginid'),
            bom_symbol        : req.symbol,
            bom_market        : document.getElementById('contract_markets').value,
            bom_currency      : req.currency,
            bom_contract_type : req.contract_type,
            bom_contract_id   : buy.contract_id,
            bom_transaction_id: buy.transaction_id,
            bom_buy_price     : buy.buy_price,
            bom_payout        : buy.payout,
        };
        // Spread contracts
        if (/spread/i.test(req.contract_type)) {
            $.extend(data, {
                bom_stop_type        : req.stop_type,
                bom_amount_per_point : buy.amount_per_point,
                bom_stop_loss_level  : buy.stop_loss_level,
                bom_stop_profit_level: buy.stop_profit_level,
            });
        } else {
            $.extend(data, {
                bom_amount     : req.amount,
                bom_basis      : req.basis,
                bom_expiry_type: document.getElementById('expiry_type').value,
            });
            if (data.bom_expiry_type === 'duration') {
                $.extend(data, {
                    bom_duration     : req.duration,
                    bom_duration_unit: req.duration_unit,
                });
            }
            if (isVisible(document.getElementById('barrier'))) {
                data.bom_barrier = req.barrier;
            } else if (isVisible(document.getElementById('barrier_high'))) {
                data.bom_barrier_high = req.barrier;
                data.bom_barrier_low  = req.barrier2;
            }
            if (isVisible(document.getElementById('prediction'))) {
                data.bom_prediction  = req.barrier;
            }
        }

        GTM.push_data_layer(data);
    };

    const set_login_flag = function() {
        if (!gtm_applicable()) return;
        localStorage.setItem('GTM_login', '1');
    };

    return {
        push_data_layer   : push_data_layer,
        event_handler     : event_handler,
        push_purchase_data: push_purchase_data,
        set_login_flag    : set_login_flag,
    };
})();

module.exports = {
    GTM: GTM,
};
