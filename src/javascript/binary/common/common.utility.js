/**
 * Created by qingwei on 10/13/15.
 */

const CommonUtility = (function(){
    function toTitleCase(str){
        return str.replace(/\w[^\s\/\\]*/g, function(txt){
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    }

    return {
        toTitleCase: toTitleCase
    };
}());

