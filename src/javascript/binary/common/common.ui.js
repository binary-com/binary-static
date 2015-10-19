const CommonUI = (function(){
    "use strict";
   /**
    * generateTableRow() generate <tr>
    * using data as value following metadata provided
    *
    * eg.
    *   data = ["03/08/2012", "35.70"];
    *
    *   metadata = ["date","price"];
    *
    * @param {Object} data
    * @param {Object} metadata
    * @param {Boolean} header
    * @return {Object} tableRow <tr>
    */
    function generateTableRow(data, metadata, header){
       if (data.length !== metadata.length) {
           throw "Row data and metadata does not match";
       }

       const $row = $("<tr></tr>");

       for (var i = 0; i < metadata.length ; i++) {
           const className = metadata[i].replace(/\s+/g, "-");
           generateTableData(data[i], className, header).appendTo($row);
       }
       return $row;
    }

    /***
     * generateTableData return a <td></td> DOM
     * using data and schema provided
     * eg.
     *  data = "Halo World";
     *  class = "date-col";
     * @param {String} data
     * @param {String} classnames
     * @param {Boolean} header
     * @return {Object} tableData <td>
     */
    function generateTableData(data, classnames, header){
        const domString = (header === true) ? "<th></th>" : "<td></td>";
        const elementText = (header === true) ? CommonUtility.toTitleCase(data.toString()) : data.toString();
        const $rowItem = $(domString, {
            class: classnames,
            text: elementText
        });

        return $rowItem;
    }

    /***
     * Generate Table DOM using rowsdata and metadata provided
     * eg.
     *  rowsdata = [
     *      ["row1a", "row1b"],
     *      ["row2a", "row2b"]
     *  ];
     *  metadata = {
     *      class: ["names", "red"],
     *      id: "unique-table",
     *      cols: ["col1", "col2"]
     *  }
     * @param {Object} rowsdata
     * @param {Object} metadata
     * @param {Array} headerTitles
     * @return {Object} table <table>
     */
    function generateTable(rowsdata, metadata, headerTitles){
        const classString = (metadata.class) ? metadata.class : "";
        const idString = (metadata.id) ? metadata.id : "";
        const $table = $("<table></table>", {class: classString, id: idString});

        if (headerTitles) {
            if (headerTitles.length !== metadata.cols.length) {
                throw "Header does not match metadata";
            }
            const $header = $("<thead></thead>");
            generateTableRow(headerTitles, metadata.cols, true).appendTo($header);
            $header.appendTo($table);
        }

        const $tbody = $("<tbody></tbody>");
        for (var i = 0 ; i < rowsdata.length ; i++) {
            generateTableRow(rowsdata[i], metadata.cols, false).appendTo($tbody);
        }

        $tbody.appendTo($table);
        return $table;
    }

    /***
     * create a datepicker with submit function
     * @param {Date} date
     * @param {Object} metadata
     * @param {Function} onSubmit
     * @returns {*|jQuery|HTMLElement}
     */
    function generateDatePicker(date, metadata, onSubmit){
        const classString = (metadata.class) ? metadata.class.join(" ") : "";
        const idString = (metadata.id) ? metadata.id : "";

        const utcMoment = moment.utc(date).format("MM/DD/YYYY").toString();
        const utcDate = Date.parse(utcMoment);

        const $datePickerDiv = $("<div></div>", {class: classString, id: idString});
        const $label = $("<label></label>", {for: idString, text: "Jump To"});
        const $datePicker = $("<div></div>", {class: "has-date-picker"}).
            datepicker({defaultDate: utcDate}).
            datepicker("setDate", utcDate);
        const $button = $("<button></button>", {class: "invisible"});

        $datePicker.on("change", function(){
            $button.removeClass("invisible");
        });

        $button.click(function () {
            const dateSelected = $datePicker.datepicker("getDate");

            console.info("date on picker", dateSelected);

            const epoch = Math.floor(dateSelected.getTime()/1000);
            onSubmit(epoch);
        });

        $label.appendTo($datePickerDiv);
        $datePicker.appendTo($datePickerDiv);
        $button.appendTo($datePickerDiv);

        return $datePickerDiv;
    }

    return {
        generateTableRow: generateTableRow,
        generateTableData: generateTableData,
        generateTable: generateTable,
        generateDatePicker: generateDatePicker
    };
}());