const localize  = require('../base/localize').localize;
const EnjoyHint = require('../../lib/guide.enjoyhint');
const Cookies   = require('../../lib/js-cookie');

/*
 *  This is developed to simplify the usage of enjoyhint (https://github.com/xbsoftware/enjoyhint)
 *
 *  How to Implement in a page:
 *  1. Add the button element to the template: <div id="guideBtn"></div>
 *  2. Add the js initialization call, having the customized parameters: Guide.init({script : 'trading'});
 *  3. Add the script data to getScript() method
 */

const Guide = (() => {
    let opt,
        cookieName,
        btnNext,
        btnFinish;

    const init = (options) => {
        opt = {
            script        : '',      // the script name in scripts
            autoStart     : false,   // false: start by button click
            guideBtnID    : '#guideBtn',
            btnText       : localize('Walkthrough Guide'),  // guide start button's text
            blink_class   : 'highlight',
            blink_inDelay : 1000,
            blink_outDelay: 1000,
            blink_interval: 3000,    // 0: continous blinking (blink_inDelay + blink_outDelay)
            blink_count   : 0,        // 0: infinite
        };
        $.extend(true, opt, options);

        cookieName = 'hide_guide';
        btnNext    = { className: 'button', html: $('<span/>', { text: localize('Next') }) };
        btnFinish  = { className: 'button btnFinish', html: $('<span/>', { text: localize('Finish') }) };

        if ($(opt.guideBtnID).length === 0) {
            console.warn(`Could not find the button placeholder: <div id="${opt.guideBtnID}"></div>`);
            return;
        }

        if (opt.script.length === 0) {
            console.warn('"script" name should be specified');
            return;
        }

        if (isDisabled()) {
            $(opt.guideBtnID).remove();
            return;
        }

        makeButton();
    };

    /*
     *  do not show the guide button if its close (X) has been clicked before
     */
    const isDisabled = () => {
        const disabled = Cookies.get(cookieName);
        return !!disabled && $.inArray(opt.script, disabled.split(',')) >= 0;
    };

    /*
     *  handle the guide button appearance using a cookie for all scripts
     */
    const setDisabled = () => {
        if (!isDisabled()) {
            const disabled = Cookies.get(cookieName);
            Cookies.set(cookieName, (!disabled ? opt.script : `${disabled},${opt.script}`));
        }
    };

    /*
     *  generate the button's html
     */
    const makeButton = () => {
        if ($(opt.guideBtnID).children().length > 0) {
            return;
        }

        $(opt.guideBtnID)
            .addClass('gr-hide-m pulser')
            .append($('<span/>', { class: 'close', text: 'X' }))
            .append($('<strong/>'));
        $(`${opt.guideBtnID} strong`).html(`<span></span>${opt.btnText}`);

        setEvents();
    };

    /*
     *  both buttons' click event
     */
    const setEvents = () => {
        $(`${opt.guideBtnID} strong`).click(() => {
            const enjoyhint_instance = new EnjoyHint({});
            enjoyhint_instance.setScript(getScript(opt.script));
            enjoyhint_instance.runScript();
        });

        if (opt.autoStart) {
            $(opt.guideBtnID).click();
        }

        // Hide button
        $(`${opt.guideBtnID} span.close`).click(() => {
            setDisabled();
            $(opt.guideBtnID).remove();
        });
    };

    /*
     *  each page's script
     */
    const getScript = (scriptName) => {
        if (scriptName !== 'trading') {
            return null;
        }
        return [
            {
                selector   : '#contract_markets',
                description: `<h1>${localize('Step')} 1</h1>${localize('Select your market')}`,
                event_type : 'next',
                nextButton : btnNext,
            },
            {
                selector   : '#underlying',
                description: `<h1>${localize('Step')} 2</h1>${localize('Select your underlying asset')}`,
                event_type : 'next',
                nextButton : btnNext,
            },
            {
                selector   : '#contract_form_name_nav',
                description: `<h1>${localize('Step')} 3</h1>${localize('Select your trade type')}`,
                event_type : 'next',
                nextButton : btnNext,
            },
            {
                selector   : '#websocket_form',
                description: `<h1>${localize('Step')} 4</h1>${localize('Adjust trade parameters')}`,
                event_type : 'next',
                nextButton : btnNext,
            },
            {
                selector   : '#contracts_list',
                description: `<h1>${localize('Step')} 5</h1>${localize('Predict the direction<br />and purchase')}`,
                event_type : 'next',
                nextButton : btnFinish,
            },
        ];
    };


    return {
        init: init,
    };
})();

module.exports = Guide;
