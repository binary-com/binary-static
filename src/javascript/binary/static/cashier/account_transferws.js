var account_transferws = (function(){
    "use strict";
    var $form ;
    var account_from , account_to ;
    var currType,account_bal;
    var availableCurr= [] ;
    var payoutCurr = [];
    
    var init = function(){
        if(page.client.redirect_if_is_virtual()) {
            return;
        }

        $form = $('#account_transfer');
        $("#success_form").hide();
        $("#client_message").hide();
        account_bal = 0;

        BinarySocket.send({ "transfer_between_accounts": "1","req_id" : 4 });

        $form.find("button").on("click", function(e){
            e.preventDefault();
            e.stopPropagation();

            if(validateForm() === false){
                return false;
            }

            var amt = $form.find("#acc_transfer_amount").val();
            BinarySocket.send({ 
                        "transfer_between_accounts": "1",
                        "account_from": account_from,
                        "account_to": account_to,
                        "currency": currType,
                        "amount": amt
            });

        });

        $form.find("#transfer_account_transfer").on("change",function(){

           $form.find("#invalid_amount").text("");
           set_account_from_to();

           BinarySocket.send({"payout_currencies": "1"});

        });
    };
    var set_account_from_to = function(){

        var accounts = $("#transfer_account_transfer option:selected").text();
        var matches = accounts
                        .split('(')
                        .filter(function(v){ 
                            return v.indexOf(')') > -1;})
                        .map( function(value) { 
                            return value.split(')')[0];
                    }); 

        account_from = matches[0];
        account_to = matches[1];
        
        $.each(availableCurr,function(index,value){
            if(value.account == account_from){
                currType = value.currency;
                account_bal = value.balance;
            }
        });

        $form.find("#currencyType").html(currType);
    };
    var validateForm =function(){

        var amt = $form.find("#acc_transfer_amount").val();
        var isValid = true;
       
        if(amt.length <=0 ){
            $form.find("#invalid_amount").text(text.localize("Invalid amount. Minimum transfer amount is 0.10, and up to 2 decimal places."));
            isValid = false;
        }

        return isValid;
    };

    var apiResponse = function(response){
        var type = response.msg_type;
        if (type === "authorize") {
            init();
        }
        else if (type === "transfer_between_accounts" || (type === "error" && "transfer_between_accounts" in response.echo_req)) {
           responseMessage(response);
        }
        else if(type === "payout_currencies" || (type === "error" && "payout_currencies" in response.echo_req)) {
            responseMessage(response);
        }
    };

    var responseMessage = function(response) {
        var resvalue ;
        if("error" in response) {
                if("message" in response.error) {

                    if($('#transfer_account_transfer option').length > 0 ){
                        $form.find("#invalid_amount").text(text.localize(response.error.message));
                    }
                    else{
                        $("#client_message").show();
                        $("#client_message p").html(text.localize(response.error.message));
                        $("#success_form").hide();
                        $form.hide();

                    }
                    return false;
                }

                return false;
        }
        else if("payout_currencies" in response){

            payoutCurr = response.payout_currencies;
        }
        else if ("transfer_between_accounts" in response){

            if(response.req_id === 5){
        
                $.each(response.accounts,function(key,value){
                    $form.hide();
                    $("#success_form").show();
                    $("#client_message").hide();

                    if(value.loginid == account_from){
                        $("#loginid_1").html(value.loginid);
                        $("#balance_1").html(value.balance);
                    }
                    else if(value.loginid == account_to){
                        $("#loginid_2").html(value.loginid);
                        $("#balance_2").html(value.balance);

                    }
                });
            }
            else if(response.req_id === 4){

                var secondacct, firstacct,str,optionValue;
                var selectedIndex = -1;

                $.each(response.accounts, function(index,value){
                    var currObj = {};

                    if($.isEmptyObject(firstacct))
                    {
                        firstacct = value.loginid;
                        currObj.account = value.loginid;
                        currObj.currency = value.currency;
                        currObj.balance = value.balance;

                        if(value.balance > 0 && selectedIndex < 0)
                        {
                            selectedIndex = index;
                        }

                        availableCurr.push(currObj);
                    }
                    else
                    {
                        secondacct = value.loginid;
                        str = text.localize("from account (" + firstacct + ") to account (" + secondacct + ")");
                        optionValue = firstacct + "_to_" + secondacct;
                        $form.find("#transfer_account_transfer")
                             .append($("<option></option>")
                             .attr("value",optionValue)
                             .text(str));
                        str = text.localize("from account (" + secondacct + ") to account (" + firstacct + ")");
                        optionValue = secondacct + "_to_" + firstacct;
                        $form.find("#transfer_account_transfer")
                             .append($("<option></option>")
                             .attr("value",optionValue)
                             .text(str));     

                        currObj.account = value.loginid;
                        currObj.currency = value.currency;
                        currObj.balance = value.balance;

                        availableCurr.push(currObj);     

                        firstacct = {};    

                        if(selectedIndex < 0 && value.balance){
                            selectedIndex =  index;
                        }  
                    }
                    
                    if(($.isEmptyObject(firstacct) === false) && ($.isEmptyObject(secondacct) === false))
                    {
                        str = text.localize("from account (" + secondacct + ") to account (" + firstacct + ")");
                        optionValue = secondacct + "_to_" + firstacct;
                        $form.find("#transfer_account_transfer")
                                 .append($("<option></option>")
                                 .attr("value",optionValue)
                                 .text(str));     
                    }
                    secondacct = {};

                    if(value.balance <= 0){
                        $form.find("#transfer_account_transfer option:last").remove();
                    }
                    else{
                        if(selectedIndex < 0 ){
                            selectedIndex =  index;
                        } 
                    }


                });
                
                for(var i = 0; i < selectedIndex; i++){
                    $form.find("#transfer_account_transfer option").eq(i).remove();
                }

                if(selectedIndex >=0){
                    $form.find("#transfer_account_transfer option").eq(selectedIndex).attr('selected', 'selected');
                }
        

                set_account_from_to();

                if((account_bal <=0) && (response.accounts.length > 1) ){
                    $("#client_message").show();
                    $("#success_form").hide();
                    $form.hide();
                    return false;
                }
                else if(account_to === undefined || account_from === undefined || $.isEmptyObject(account_to))
                {
                    $("#client_message").show();
                    $("#client_message p").html(text.localize("The account transfer is unavailable for your account."));
                    $("#success_form").hide();
                    $form.hide();
                    return false;
                }

                BinarySocket.send({"payout_currencies": "1"});
            }
            else{
                BinarySocket.send({ 
                    "transfer_between_accounts": "1",
                    "req_id" : 5
                });

            }
        }

    };

    return {
        init : init,
        apiResponse : apiResponse
    };

})();

pjax_config_page("cashier/account_transferws", function() {
    return {
        onLoad: function() {
            if (page.client.redirect_if_logout()) {
                return;
            }

        	BinarySocket.init({
                onmessage: function(msg){
                    var response = JSON.parse(msg.data);
                    if (response) {
                        account_transferws.apiResponse(response);
                    }
                }
            });	

            if(TUser.get().hasOwnProperty('is_virtual')) {
                account_transferws.init();
            }
        }
    };
});