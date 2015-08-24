
var Periods = (function(){
	var barrier = 0,
		barrier2 = 0;

	var displayPeriods = function(){

		var periods = Contract.periods();
		if(!periods){
			return false;
		}

		var target= document.getElementById('period'),
		    formName = Offerings.form(),
		    underlying = document.getElementById('underlying').value,
		    fragment =  document.createDocumentFragment();

		while (target && target.firstChild) {
		    target.removeChild(target.firstChild);
		}

		if(!periods[formName] || !periods[formName][underlying]){
			return false;
		}

		var periods = periods[formName][underlying];
		var list = Object.keys(periods);
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
				var match1 = period.date_start.date.match(/^\d{4}-\d{2}-\d{2}\s+(\d{2}):(\d{2}):\d{2}$/)
				var s_hours = match1[1];
				var s_min = match1[2];

				var match2 = period.date_expiry.date.match(/^\d{4}-\d{2}-\d{2}\s+(\d{2}):(\d{2}):\d{2}$/)
				var e_hours = match2[1];
				var e_min = match2[2];

				text = s_hours+":"+s_min+' - '+e_hours+":"+e_min+' ('+period.duration+')'
			}
			else{
				text = period.date_expiry.date + ' ('+period.duration+')'
			}
			option = document.createElement('option');
			content = document.createTextNode(text);
			option.setAttribute('value', p);
			option.appendChild(content);
			fragment.appendChild(option);
		});

		target.appendChild(fragment);
		displayBarriers();
	}

	var displayBarriers = function(){

		var periods = Contract.periods();
		if(!periods){
			return false;
		}

		var target1= document.getElementById('jbarrier'),
			target2= document.getElementById('jbarrier_high'),
			target3= document.getElementById('jbarrier_low')
		    formName = Offerings.form(),
		    underlying = document.getElementById('underlying').value,
		    period = document.getElementById('period').value,
		    fragment =  document.createDocumentFragment();

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

		if(periods[formName][underlying][period].barriers==1){
			document.getElementById('jbarrier_row').style.display = 'flex';
			document.getElementById('jhigh_barrier_row').style.display = 'none';
			document.getElementById('jlow_barrier_row').style.display = 'none';
			var list = periods[formName][underlying][period].available_barriers;
			list.sort();
			list.forEach(function(barrier){
				option = document.createElement('option');
				content = document.createTextNode(barrier);
				option.setAttribute('value', barrier);
				option.appendChild(content);
				fragment.appendChild(option);
			})
			target1.appendChild(fragment);
			barrier = target1.value = periods[formName][underlying][period].barrier;
		}
		else{
			document.getElementById('jbarrier_row').style.display = 'none';
			document.getElementById('jhigh_barrier_row').style.display = 'flex';
			document.getElementById('jlow_barrier_row').style.display = 'flex';
			var list2 = periods[formName][underlying][period].available_barriers[1];
			list2.sort()
			list2.forEach(function(barrier){
				option = document.createElement('option');
				content = document.createTextNode(barrier);
				option.setAttribute('value', barrier);
				if(barrier <=  periods[formName][underlying][period].low_barrier){
					option.setAttribute('disabled', true);
				}
				option.appendChild(content);
				fragment.appendChild(option);
			})
			target2.appendChild(fragment);
			barrier = target2.value = periods[formName][underlying][period].high_barrier;

			var list3 = periods[formName][underlying][period].available_barriers[0];
			list3.sort()
			list3.forEach(function(barrier){
				option = document.createElement('option');
				content = document.createTextNode(barrier);
				option.setAttribute('value', barrier);
				option.appendChild(content);
				fragment.appendChild(option);
			})
			target3.appendChild(fragment);;
			barrier2 = target3.value = periods[formName][underlying][period].low_barrier;
		}
	}

	return {
		barrier: function(){return barrier},
		barrier2: function(){return barrier2},
		displayPeriods: displayPeriods,
		displayBarriers: displayBarriers
	}
})()
