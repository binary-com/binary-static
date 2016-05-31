if(isJapanTrading()){
	var Price = Object.create(Price);
	Object.defineProperties(Price,{
		proposal:{
			value:function(typeOfContract){
				var parent = Object.getPrototypeOf(this);
				var proposal = parent.proposal(typeOfContract);

				var period = document.getElementById('period'),
					barrier = document.getElementById('jbarrier'),
					highBarrier = document.getElementById('jbarrier_high'),
					lowBarrier = document.getElementById('jbarrier_low');

				if (barrier && isVisible(barrier) && barrier.value) {
				    proposal['barrier'] = barrier.value;

				}

				if (highBarrier && isVisible(highBarrier) && highBarrier.value) {
				    proposal['barrier'] = highBarrier.value;

				}

				if (lowBarrier && isVisible(lowBarrier) && lowBarrier.value) {
				    proposal['barrier2'] = lowBarrier.value;
				}

				if (period && isVisible(period) && period.value) {
					var p = period.value.match(/^\d+_(\d+)$/);
					if(p){
						proposal['date_expiry'] = p[1];
					}				
				}
				return proposal;
			}
		}
	});
}