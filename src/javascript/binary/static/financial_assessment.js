var FinancialAssessmentws = (function(){
   "use strict";
   
    var init = function(){
        LocalizeText();
        $("#assessment_form").on("submit",function(event) {
            event.preventDefault();
            submitForm();
            return false;
        });
        BinarySocket.send(JSON.parse("{\"get_financial_assessment\" : 1}"));
    };
   
    // For translating strings
    var LocalizeText = function(){
        $("#heading").text(text.localize($("#heading").text())); 
        $("legend").text(text.localize($("legend").text()));
        $("#assessment_form label").each(function(){
            var ele = $(this);
            ele.text(text.localize(ele.text()));
        });
        $("#assessment_form option").each(function(){
            var ele = $(this);
            ele.text(text.localize(ele.text()));
        });
        $("#warning").text(text.localize($("#warning").text()));
        $("#submit").text(text.localize($("#submit").text()));
    };
    
    var submitForm = function(){
        if(!validateForm()){
            return;
        }
        var data = {'set_financial_assessment' : 1};
        showLoadingImg();
        $('#assessment_form select').each(function(){
            data[$(this).attr("id")] = $(this).val();
        });
        $('html, body').animate({ scrollTop: 0 }, 'fast');
        BinarySocket.send(data);
        
    };
    
    var validateForm = function(){
        var isValid = true,
            errors = {};
        $('#assessment_form select').each(function(){
            if($(this).val() === ''){
                isValid = false;
                errors[$(this).attr("id")] = text.localize('Please select a value.');
            }
        });
        if(!isValid){
            displayErrors(errors);
        }
        
        return isValid;
    };
    
    var showLoadingImg = function(){
        showLoadingImage($('<div/>', {id: 'loading'}).insertAfter('#heading')); 
        $("#assessment_form").addClass('invisible');
    };
    
    var hideLoadingImg = function(show_form){
        $("#loading").remove();
        if(typeof show_form === 'undefined'){
            show_form = true;
        }
        if(show_form)
            $("#assessment_form").removeClass('invisible');
    };
    
    var responseGetAssessment = function(response){
        hideLoadingImg();
        for(var key in response.get_financial_assessment){
            if(key){
                var val = response.get_financial_assessment[key];
                $("#"+key).val(val);
            }
        }
    };
    
    var displayErrors = function(errors){
        var id;
        $(".errorfield").each(function(){$(this).text('');});
        for(var key in errors){
            if(key){
                var error = errors[key];
                $("#error"+key).text(text.localize(error));
                id = key;
            }
        }  
        hideLoadingImg();
        $('html, body').animate({
            scrollTop: $("#"+id).offset().top
        }, 'fast');
    };
    
    var responseOnSuccess = function(){
        $("#heading").hide();
        hideLoadingImg(false);
        $("#response_on_success").text(text.localize("Your details have been updated."))
            .removeClass("invisible");
    };
    
    var apiResponse = function(response){
        if(response.msg_type === 'get_financial_assessment'){
            responseGetAssessment(response);
        }
        else if(response.msg_type === 'set_financial_assessment' && 'error' in response){
            displayErrors(response.error.details);
        }
        else if(response.msg_type === 'set_financial_assessment'){
            responseOnSuccess();
        }
    };
    return {
        init : init,
        apiResponse : apiResponse
    };
}());


pjax_config_page("user/assessmentws", function() {
    return {
        onLoad: function() {
            if (page.client.redirect_if_logout() || page.client.redirect_if_is_virtual('user/my_accountws')) {
                return;
            }

            BinarySocket.init({
                onmessage: function(msg) {
                    var response = JSON.parse(msg.data);
                    if (response) {
                        FinancialAssessmentws.apiResponse(response);
                    }
                }
            });
            showLoadingImage($('<div/>', {id: 'loading'}).insertAfter('#heading'));
            FinancialAssessmentws.init();
        }
    };
});
