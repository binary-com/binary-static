var LiveChartIndicator = {};
LiveChartIndicator['Barrier'] = function(params) {
    this.name = params['name'];
    this.value = typeof params['value'] !== 'object' ? parseFloat(params['value']) : params['value'];
    this.color = params['color'] || 'blue';
    this.width = params['width'] || 2;
    this.id = 'barrier_' + this.name;
    this.is_relative = /^[+-]/.test(params['value']);
    this.painted = false;
    this.label = params['label'] || '';
    this.axis = params['axis'] || 'y';
    this.nomargin = params['nomargin'] || false;
};


LiveChartIndicator['Barrier'].prototype = {
    remove: function(that) {
        if (this.axis == 'y') {
            that.chart.yAxis[0].removePlotLine(this.id);
        } else {
            that.chart.xAxis[0].removePlotLine(this.id);
        }
    },
    repaint: function(that) {
        if (this.is_relative || !this.painted) {
            this.remove(that);
            this.paint(that);
            return true;
        }

        return false;
    },
    paint: function(that) {
        var value = this.value;
        if (this.is_relative) {
            if (that.spot) {
                value = that.spot + value;
            } else {
                return;
            }
        }

        var plot_option = { value: value, color: this.color, width: this.width, id: this.id };
        if (this.label) {
            if (this.axis == 'x') {
                if(this.nomargin) {
                    plot_option.label = {text: text.localize(this.label), verticalAlign: 'middle', textAlign: 'center' };
                } else {
                    plot_option.label = {text: text.localize(this.label), verticalAlign: 'middle', x: -10, textAlign: 'center' };
                }
            } else {
                plot_option.label = {text: text.localize(this.label), align: 'center'};
            }
        }
        if (this.axis == 'y') {
            that.chart.yAxis[0].addPlotLine(plot_option);
        } else {
            that.chart.xAxis[0].addPlotLine(plot_option);
        }
        this.painted = true;
    }
};
