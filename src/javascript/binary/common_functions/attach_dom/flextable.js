var FlexTableUI = function(config) {
    this.config = config;
    this.id     = config.id;
    this.header = config.header;
    this.footer = config.footer;
    this.$tableContainer = Table.createFlexTable(
        [],
        this.getMetaData(),
        this.header,
        this.footer
    );
    // Table.appendTablebody expects the table to already
    // exist in the DOM, so we need to append first
    this.$tableContainer.appendTo(config.container);
    this.extend(config.data);
};

FlexTableUI.prototype = {
    getMetaData: function() {
        return {
            id:         this.config.id,
            tableClass: this.config.class,
            cols:       this.config.cols,
        };
    },

    extend: function(data) {
        var cols = this.config.cols;
        var formatter = this.config.formatter;
        var style = this.config.style;
        Table.appendTableBody(this.id, data, function(datum) {
            var $row = Table.createFlexTableRow(formatter(datum), cols, 'data');
            if (style) {
                style($row, datum);
            }
            return $row[0];
        });
    },

    displayError: function(message, colspan) {
        $tr = $('<tr/>', {class: 'flex-tr'});
        $td = $('<td/>', {colspan: colspan});
        $p  = $('<p/>', {class: 'notice-msg center-text', text: message});
        return $('#' + this.id + ' tbody').append($tr.append($td.appnd($p)));
    },

    replace: function(data) {
        Table.clearTableBody(this.id);
        this.extend(data);
    },

    clear: function() {
        this.replace([]);
        $('#' + this.id + '> tfoot').hide();
    }
};
