var WSTickDisplay = Object.create(TickDisplay);
WSTickDisplay.plot = function(plot_from, plot_to){
    var $self = this;
    $self.contract_start_moment = moment($self.contract_start_ms).utc();
    $self.counter = 0;
    $self.applicable_ticks = [];
};
WSTickDisplay.update_ui = function(final_price, pnl, contract_status) {
    var $self = this;
    updatePurchaseStatus(final_price, pnl, contract_status);
};

WSTickDisplay.updateChart = function(data){

    var $self = this;

    var chart = document.getElementById('tick_chart');
    if(!chart || !isVisible(chart) || !data || !data.tick){
        return;
    }

    var tick = {
        epoch: parseInt(data.tick.epoch),
        quote: parseFloat(data.tick.quote)
    };

    if (tick.epoch > $self.contract_start_moment.unix()) {
        if ($self.applicable_ticks.length >= $self.ticks_needed) {
            $self.evaluate_contract_outcome();
            return;
        } else {
            if (!$self.chart) return;
            if (!$self.chart.series) return;
            $self.chart.series[0].addPoint([$self.counter, tick.quote], true, false);
            $self.applicable_ticks.push(tick);
            var indicator_key = '_' + $self.counter;
            if (typeof $self.x_indicators[indicator_key] !== 'undefined') {
                $self.x_indicators[indicator_key]['index'] = $self.counter;
                $self.add($self.x_indicators[indicator_key]);
            }

            $self.add_barrier();
            $self.apply_chart_background_color(tick);
            $self.counter++;
        }
    }           
};

