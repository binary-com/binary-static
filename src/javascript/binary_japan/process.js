if(typeof is_japan === 'function'){

	var processContractForm = function(){

	    Contract.details(sessionStorage.getItem('formname'));

	    StartDates.display();

	    if(Periods){
	    	Periods.displayPeriods();
	    }

	    displayPrediction();

	    displaySpreads();  
	    
	    if(sessionStorage.getItem('amount')){
	        document.getElementById('amount').value = sessionStorage.getItem('amount');       
	    }

	    Durations.display();

	    processPriceRequest();
	};

}
