var moment = require('moment');

var StringUtil = (function(){
    function toTitleCase(str){
        return str.replace(/\w[^\s\/\\]*/g, function(txt){
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    }

    function dateToStringWithoutTime(date){
        return [date.getDate(), date.getMonth()+1, date.getFullYear()].join("/");
    }

    function dateToStringWithoutTimeDash(date){
        date = new Date(date);
        return [date.getFullYear(), ('0' + (date.getMonth()+1)).slice(-2), ('0' + date.getDate()).slice(-2)].join("-");
    }

    function dateToUnixWithTime(date, time){
        date = new Date(date + ' ' + time);
        var year = date.getFullYear(),
            month = ('0' + date.getMonth()).slice(-2),
            day = ('0' + date.getDate()).slice(-2),
            hour = date.getHours(),
            minute = date.getMinutes(),
            second = date.getSeconds();
        return (Date.UTC(year, month, day, hour, minute, second) / 1000).toFixed(0);
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

    var external = {
        toTitleCase: toTitleCase,
        dateToStringWithoutTime: dateToStringWithoutTime,
        unixTimeToDateString: timeStampToDateString,
        unixTimeToTimeString: timeStampToTimeString,
        unixTimeToDateTimeString: timeStampToDateTimeString,
        dateToStringWithoutTimeDash: dateToStringWithoutTimeDash,
        dateToUnixWithTime: dateToUnixWithTime,
    };

    return external;
}());

module.exports = {
    StringUtil: StringUtil,
};
