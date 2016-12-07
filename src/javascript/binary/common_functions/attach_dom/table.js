var Table = (function() {
    'use strict';

    /** *
     *
     * @param {Array[]} data ordered data to pump into table body
     * @param {Object} metadata object containing metadata of table
     * @param {String[]} metadata.cols cols of table
     * @param {String} metadata.id table id
     * @param {String[]} [metadata.tableClass] class used in html
     * @param {String[]} [header] string to be used as Header in table, if not stated then table will not have Header
     * @param {String[]} [footer] string to be used as footer, to have empty footer, use an empty element in array
     * eg. ["", "halo", ""] will have 3 elements in footer, 2 of them being empty
     */
    function createFlexTable(body, metadata, header, footer) {
        var $tableContainer = $('<div></div>', { class: 'table-container' });
        var $table = $('<table></table>', { class: metadata.tableClass || '', id: metadata.id });
        var $body = createFlexTableTopGroup(body, metadata.cols, 'body');

        if (header) {
            var $header = createFlexTableTopGroup([header], metadata.cols, 'header');
            $header.appendTo($table);
        }

        $body.appendTo($table);

        if (footer) {
            var $footer = createFlexTableTopGroup([footer], metadata.cols, 'footer');
            $footer.appendTo($table);
        }

        $table.appendTo($tableContainer);

        return $tableContainer;
    }

    /** *
     *
     * @param {object[][]} data header strings
     * @param {String[]} metadata cols name
     * @param {"header"\"footer"|"body"} opt optional arg to specify which type of element to create, default to header
     */
    function createFlexTableTopGroup(data, metadata, opt) {
        var $outer = (function() {
            switch (opt) {
                case 'body':
                    return $('<tbody></tbody>');
                case 'footer':
                    return $('<tfoot></tfoot>');
                default :
                    return $('<thead></thead>');
            }
        })();

        for (var i = 0; i < data.length; i++) {
            var innerType = (opt === 'body') ? 'data' : 'header';
            var $tr = createFlexTableRow(data[i], metadata, innerType);
            $tr.appendTo($outer);
        }

        return $outer;
    }

    /** *
     *
     * @param {object[]} data
     * @param {String[]} metadata cols name
     * @param {"header"|"data"} opt optional, default to "header"
     */
    function createFlexTableRow(data, metadata, opt) {
        if (data.length !== metadata.length) {
            throw new Error('metadata and data does not match');
        }

        var isData = (opt === 'data');

        var $tr = $('<tr></tr>');
        for (var i = 0; i < data.length; i++) {
            var className = metadata[i].toLowerCase().replace(/\s/g, '-');
            var rowElement = (isData) ?
                $('<td></td>', { class: className, html: data[i] }) :
                $('<th></th>', { class: className, html: data[i] });
            rowElement.appendTo($tr);
        }

        return $tr;
    }

    function clearTableBody(id) {
        var tbody = document.querySelector('#' + id + '>tbody');
        while (tbody && tbody.firstElementChild) {
            tbody.removeChild(tbody.firstElementChild);
        }
    }

    /** *
     *
     * @param {String} id table id
     * @param {Object[]} data array of data to be transform to row
     * @param {Function} rowGenerator takes in one arg, and convert it into row to be append to table body
     */
    function appendTableBody(id, data, rowGenerator) {
        var tbody = document.querySelector('#' + id + '>tbody');
        if (!tbody) return;
        var docFrag = document.createDocumentFragment();
        data.map(function(ele) {
            var row = rowGenerator(ele);
            docFrag.appendChild(row);
        });

        tbody.appendChild(docFrag);
    }

    return {
        createFlexTable   : createFlexTable,
        createFlexTableRow: createFlexTableRow,
        clearTableBody    : clearTableBody,
        appendTableBody   : appendTableBody,
    };
})();

module.exports = {
    Table: Table,
};
