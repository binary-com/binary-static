
var StringUtil = (function(){
    function toTitleCase(str){
        return str.replace(/\w[^\s\/\\]*/g, function(txt){
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    }

    function dateToStringWithoutTime(date){
        return [date.getDate(), date.getMonth()+1, date.getFullYear()].join("/");
    }

    //Time should be in SECOND !!!
    function timeStampToDateString(time){
        var dateObj = new Date(time * 1000);
        var momentObj = moment.utc(dateObj);
        return momentObj.format("YYYY-MM-DD");
    }

    //Time should be in SECOND !!!
    function timeStampToTimeString(time){
        var dateObj = new Date(time * 1000);
        var momentObj = moment.utc(dateObj);
        return momentObj.format("HH:mm:ss");
    }

    //Time should be in SECOND !!!
    function timeStampToDateTimeString(time){
        var dateObj = new Date(time * 1000);
        var momentObj = moment.utc(dateObj);
        return momentObj.toString();
    }

    return {
        toTitleCase: toTitleCase,
        dateToStringWithoutTime: dateToStringWithoutTime,
        unixTimeToDateString: timeStampToDateString,
        unixTimeToTimeString: timeStampToTimeString,
        unixTimeToDateTimeString: timeStampToDateTimeString
    };
}());

