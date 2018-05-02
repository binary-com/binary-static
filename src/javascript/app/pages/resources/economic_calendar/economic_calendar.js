const EconomicCalendar = (() => {

    const onLoad = () => {
        $.getScript( 'https://c.mql5.com/js/widgets/calendar/widget.v3.js' )
          .done(() => {
              new economicCalendar({ width: '100%', height: '500px', mode: 2 }); // eslint-disable-line new-cap, no-new, no-undef
          });
    };
    return {
        onLoad,
    };
})();

module.exports = EconomicCalendar;
