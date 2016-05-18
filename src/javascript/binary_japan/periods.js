if(isJapanTrading()){
	var Periods = (function(){
		var barrier = 0,
			barrier2 = 0,
			barriers1 = [],
			barriers2 = [];

		var displayPeriods = function(){

			var periods = Contract.periods();
			if(!periods){
				return false;
			}
			var wrapper = document.getElementById('period_row'),
				target= document.getElementById('period'),
			    formName = Contract.form(),
			    underlying = document.getElementById('underlying').value,
			    fragment =  document.createDocumentFragment();

			while (target && target.firstChild) {
			    target.removeChild(target.firstChild);
			}

			if(!periods[formName] || !periods[formName][underlying]){
				return false;
			}

			wrapper.style.display = 'flex';

			periods = periods[formName][underlying];
			list = Object.keys(periods);

			list.sort(function(a,b){
				if(periods[a].date_expiry.epoch - periods[a].date_start.epoch > periods[b].date_expiry.epoch - periods[b].date_start.epoch){
					return 1;
				}
				else if(periods[a].date_expiry.epoch - periods[a].date_start.epoch < periods[b].date_expiry.epoch - periods[b].date_start.epoch){
					return -1;
				}
				else{
					if(periods[a].date_start.epoch > periods[b].date_start.epoch){
						return 1;
					}
					else {
						return -1;
					}
				}
			});

			list.forEach(function(p){
				var period = periods[p];
				var option, content, text;
				if(period.duration.match(/^\d+h$/)){
					var match1 = period.date_start.date.match(/^\d{4}-\d{2}-\d{2}\s+(\d{2}):(\d{2}):\d{2}$/);
					var s_hours = match1[1];
					var s_min = match1[2];

					var match2 = period.date_expiry.date.match(/^\d{4}-\d{2}-\d{2}\s+(\d{2}):(\d{2}):\d{2}$/);
					var e_hours = match2[1];
					var e_min = match2[2];

					text = s_hours+":"+s_min+' - '+e_hours+":"+e_min+' ('+period.duration+')';
				}
				else{
					text = period.date_expiry.date + ' ('+period.duration+')';
				}
				option = document.createElement('option');
				content = document.createTextNode(text);
				option.setAttribute('value', p);
				option.appendChild(content);
				fragment.appendChild(option);
			});

			target.appendChild(fragment);
			displayBarriers();
		};

		var displayBarriers = function(){

			var periods = Contract.periods();
			if(!periods){
				return false;
			}

			var target1= document.getElementById('jbarrier'),
				target2= document.getElementById('jbarrier_high'),
				target3= document.getElementById('jbarrier_low'),
			    formName = Contract.form(),
			    underlying = document.getElementById('underlying').value,
			    period = document.getElementById('period').value,
			    fragment = document.createDocumentFragment();

			while (target1 && target1.firstChild) {
			    target1.removeChild(target1.firstChild);
			}

			while (target2 && target2.firstChild) {
			    target2.removeChild(target2.firstChild);
			}

			while (target3 && target3.firstChild) {
			    target3.removeChild(target3.firstChild);
			}


			if(!periods[formName] || !periods[formName][underlying] || !periods[formName][underlying][period]){
				return false;
			}

			document.getElementById('barrier_row').style.display = 'none';
			document.getElementById('high_barrier_row').style.display = 'none';
			document.getElementById('low_barrier_row').style.display = 'none';
		};

		return {
			barrier: function(){return barrier;},
			barrier2: function(){return barrier2;},
			barriers1: function(){return barriers1;},
			barriers2: function(){return barriers2;},
			displayPeriods: displayPeriods,
			displayBarriers: displayBarriers
		};
	})();
}
