const State               = require('../../../_common/storage').State;
const applyToAllElements  = require('../../../_common/utility').applyToAllElements;
const mdcDrawer           = require('@material/drawer');
const mdcDialog           = require('@material/dialog');
const mdcSelect           = require('@material/select');
const mdcRipple           = require('@material/ripple');
const mdcTextField        = require('@material/textfield');
// const mdcRadio         = require('@material/radio');

const Trading = (() => {
    const onLoad = () => {
        State.set('is_trading_2', true);

        applyToAllElements('div.mdc-text-field', (el) => {
            mdcTextField.MDCTextField.attachTo(el);
        });

        applyToAllElements('button', (el) => {
            mdcRipple.MDCRipple.attachTo(el);
        });

        const MDCSelect = mdcSelect.MDCSelect;
        const select_date_start = new MDCSelect(document.querySelector('.date-start'));
        select_date_start.listen('MDCSelect:change', () => {
            console.log(select_date_start.value);
        });

        const select_expiry = new MDCSelect(document.querySelector('.expiry'));
        select_expiry.listen('MDCSelect:change', () => {
            console.log(select_expiry.value);
        });

        const select_duration_unit = new MDCSelect(document.querySelector('.duration-unit'));
        select_duration_unit.listen('MDCSelect:change', () => {
            console.log(select_duration_unit.value);
        });

        const select_amount_type = new MDCSelect(document.querySelector('.amount-type'));
        select_amount_type .listen('MDCSelect:change', () => {
            console.log(select_amount_type .value);
        });

        const MDCTemporaryDrawer = mdcDrawer.MDCTemporaryDrawer;
        const drawer = new MDCTemporaryDrawer(document.querySelector('.mdc-temporary-drawer'));
        const notify_drawer = new MDCTemporaryDrawer(document.querySelector('.notifications-list'));
        document.querySelector('.menu-toggle').addEventListener('click', (evt) => {
            evt.preventDefault();
            drawer.open = true;
        });
        document.querySelector('.menu-close').addEventListener('click', (evt) => {
            evt.preventDefault();
            if (drawer.open) drawer.open = false;
        });
        document.querySelector('.notifications-toggle').addEventListener('click', (evt) => {
            evt.preventDefault();
            notify_drawer.open = true;
        });
        document.querySelector('.notifications-close').addEventListener('click', (evt) => {
            evt.preventDefault();
            if (notify_drawer.open) notify_drawer.open = false;
        });
        const dialog_1 = new mdcDialog.MDCDialog(document.querySelector('#modal-1'));

        dialog_1.listen('MDCDialog:accept', () => {
            // console.log('confirm');
        });

        dialog_1.listen('MDCDialog:cancel', () => {
            // console.log('discard');
        });

        document.querySelector('#modal-popup-1').addEventListener('click', (evt) => {
            dialog_1.lastFocusedTarget = evt.target;
            dialog_1.show();
        });

        const dialog_2 = new mdcDialog.MDCDialog(document.querySelector('#modal-2'));

        dialog_2.listen('MDCDialog:accept', () => {
            // console.log('confirm');
        });

        dialog_2.listen('MDCDialog:cancel', () => {
            // console.log('discard');
        });

        document.querySelector('#modal-popup-2').addEventListener('click', (evt) => {
            dialog_2.lastFocusedTarget = evt.target;
            dialog_2.show();
        });
    };

    const onUnload = () => {
        State.remove('is_trading_2');
    };

    return {
        onLoad,
        onUnload,
    };
})();

module.exports = Trading;
