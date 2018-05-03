const getLanguage = require('../../../../_common/language').get;

const EconomicCalendar = (() => {

    const onLoad = () => {
        const curr_language = getLanguage().toLowerCase();

        $.getScript( 'https://c.mql5.com/js/widgets/calendar/widget.v3.js' )
          .done(() => {
              new economicCalendar({ width: '100%', height: '500px', mode: 2, lang: curr_language }); // eslint-disable-line new-cap, no-new, no-undef
          });
    };
    return {
        onLoad,
    };
})();

module.exports = EconomicCalendar;
