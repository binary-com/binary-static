var init_high_chart = function() {

  /*
    Building the instrument drop down - A recurrsion function
  */
  function addInstrument(instrumentJSON) {
    $.each(instrumentJSON, function(key, value) {
        if (value.submarkets || value.instruments) {
          addInstrument( value.submarkets || value.instruments );
        } else {
          $("<option>").append(value.display_name)
                      .attr('value', value.symbol)
                      .appendTo( $('#instruments') );
        }
      });
  }

  /*
    Retrieving instrument list
  */
  $.get("https://chart.binary.com/d/backend/markets.cgi", function (_instrumentJSON) {
      if (!$.isEmptyObject(_instrumentJSON)) {
        addInstrument(_instrumentJSON);
        $("#instruments").change();
      }
    }, 'json').error(function () {
      alert("Error getting market information!");
    });

  /*
    Attaching change event to the drop downs
  */
  $("#instruments, #timePeriod").change(function() {
    var instrumentCode = $("#instruments").val();
    var timePeriod = $("#timePeriod").val();
    if (instrumentCode && timePeriod) {
      $("#chartFrame").attr('src', '/index.html?affiliates=true&instrument='
                    + instrumentCode + '&timePeriod=' + timePeriod);
    }
  });

};

pjax_config_page('highchart', function() {
    return {
        onLoad: function() {
            init_high_chart();
        },
        onUnload: function() {
            high_chart.close_chart();
            high_chart = null;
        }
    };
});
