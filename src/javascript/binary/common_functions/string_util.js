var StringUtil = (function(){
    function toTitleCase(str){
        return str.replace(/\w[^\s\/\\]*/g, function(txt){
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    }

    function dateToStringWithoutTime(date){
        return [date.getDate(), date.getMonth()+1, date.getFullYear()].join("/");
    }

    var external = {
        toTitleCase: toTitleCase,
        dateToStringWithoutTime: dateToStringWithoutTime,
    };

    if (typeof module !== 'undefined') {
        module.exports = external;
    }

    return external;
}());
