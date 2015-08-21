var lowBarrierElement = document.getElementById('barrier_low');
if (lowBarrierElement) {
    lowBarrierElement.addEventListener('change', function (e) {
        processPriceRequest();
    });
}

var jhighBarrierElement = document.getElementById('jbarrier_high');
if (jhighBarrierElement) {
    jhighBarrierElement.addEventListener('change', function (e) {
        processPriceRequest();
    });
}


var jlowBarrierElement = document.getElementById('jbarrier_low');
if (jlowBarrierElement) {
    jlowBarrierElement.addEventListener('change', function (e) {
    	var options = jhighBarrierElement.getElementsByTagName('option');
    	var f = 0;
    	if(jhighBarrierElement.value > jlowBarrierElement.value){
    		f = 1;
    	}
		for(var i=0; i<options.length; i++){
			option = options[i];

    		if(option.value <= jlowBarrierElement.value){
    			option.setAttribute('disabled', true);
    		}
		else{
			if(!f){
				jhighBarrierElement.value = option.value;
				f=1;
			}
			option.removeAttribute('disabled');
		}
    	}
        processPriceRequest();
    });
}

var barrierElement = document.getElementById('jbarrier');
if (barrierElement) {
    barrierElement.addEventListener('change', function (e) {
        processPriceRequest();
    });
}

var period = document.getElementById('period');
if(period){
	period.addEventListener('change', function (e) {
		Periods.displayBarriers();
		processPriceRequest();
	})
}

var amount_type = document.getElementById('amount_type');
var options = amount_type.getElementsByTagName('option');
for(var i=0; i<options.length; i++){
    if(options[i].value!='payout'){
        options[i].setAttribute('disabled', true);
    }
}