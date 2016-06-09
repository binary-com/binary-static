if (isJapanTrading()) {

  var processForgetTables = function() {
    BinarySocket.send({
      forget_all: 'pricing_table',
    });
  };

  var processPricingTableRequest = function() {
    processForgetTables();
    var symbol = $('#underlying').val();
    var period = $('#period').val();
    var res = period.split('_');
    var date_expiry = res[1];
    var date_start = res[0];
    var formName = sessionStorage.getItem('formname');
    var units = Math.abs(parseInt($('#japan_unit').val(), 10)) || 1;
    var category = formName === 'higherlower' ? 'callput' : formName;

    PricingTable.sendRequest({
      symbol: symbol,
      date_expiry: date_expiry,
      date_start: date_start,
      contract_category: category,
      units: units,
    });
  };

  var processContractForm = function() {

    Contract.details(sessionStorage.getItem('formname'));

    StartDates.display();

    if (Periods) {
      Periods.displayPeriods();
    }

    displayPrediction();

    displaySpreads();

    if (sessionStorage.getItem('japan_unit')) $('#japan_unit').val(sessionStorage.getItem('japan_unit'));
    if (sessionStorage.getItem('currency')) selectOption(sessionStorage.getItem('currency'), document.getElementById('currency'));

    Durations.display();

    processPricingTableRequest();

  };
}

