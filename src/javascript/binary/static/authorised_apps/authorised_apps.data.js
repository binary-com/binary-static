var ApplicationsData = (function(){
    "use strict";

    function getApplications(){
        var request = {oauth_apps: 1};
        BinarySocket.send(request);
    }
    
    function revokeApplication(id){
        if(!id){
            return;
        }
        var request = {
            oauth_apps: 1,
            revoke_app: id
        };
        
        BinarySocket.send(request);
    }
    
    return{
      getApplications: getApplications,
      revokeApplication: revokeApplication
    };
}());
