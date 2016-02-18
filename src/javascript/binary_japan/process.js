if (typeof is_japan === 'function') {

    var processContractForm = function() {

        Contract.details(sessionStorage.getItem('formname'));

        StartDates.display();

        if (Periods) {
            Periods.displayPeriods();
        }

        displayPrediction();

        displaySpreads();

        if (sessionStorage.getItem('amount')) $('#amount').val(sessionStorage.getItem('amount'));
        if (sessionStorage.getItem('currency')) selectOption(sessionStorage.getItem('currency'), document.getElementById('currency'));

        Durations.display();

        processPriceRequest();

    };
}
