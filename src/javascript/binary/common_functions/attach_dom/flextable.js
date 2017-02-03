const Table = require('./table').Table;

const FlexTableUI = function(config) {
    this.config = config;
    this.id = config.id;
    const $tableContainer = Table.createFlexTable(
        [],
        this.getMetadata(),
        config.header,
        config.footer);
    // Table.appendTablebody expects the table to already
    // exist in the DOM, so we need to append first
    $tableContainer.appendTo(config.container);
    this.extend(config.data);
};

FlexTableUI.prototype = {
    getMetadata: function() {
        return {
            id        : this.config.id,
            tableClass: this.config.class,
            cols      : this.config.cols,
        };
    },

    extend: function(data) {
        const cols = this.config.cols;
        const formatter = this.config.formatter;
        const style = this.config.style;
        Table.appendTableBody(this.id, data, function(datum) {
            const $row = Table.createFlexTableRow(formatter(datum), cols, 'data');
            if (style) {
                style($row, datum);
            }
            return $row[0];
        });
    },

    displayError: function(message, colspan) {
        const $tr = $('<tr/>', { class: 'flex-tr' });
        const $td = $('<td/>', { colspan: colspan });
        const $p  = $('<p/>', { class: 'notice-msg center-text', text: message });
        return $('#' + this.id + ' tbody').append($tr.append($td.append($p)));
    },

    replace: function(data) {
        Table.clearTableBody(this.id);
        this.extend(data);
    },

    clear: function() {
        this.replace([]);
        $('#' + this.id + '> tfoot').hide();
    },
};

module.exports = {
    FlexTableUI: FlexTableUI,
};
