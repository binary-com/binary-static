var showLoadingImage = require('../../../../base/utility').showLoadingImage;
var RiskClassification = require('../../../../common_functions/risk_classification').RiskClassification;
var japanese_client = require('../../../../common_functions/country_base').japanese_client;

var FinancialAssessmentws = (function(){
   "use strict";

    var financial_assessment = {};

    var init = function(){
        if (checkIsVirtual()) return;
        LocalizeText();
        $("#assessment_form").on("submit",function(event) {
            event.preventDefault();
            submitForm();
            return false;
        });
        BinarySocket.send({get_financial_assessment : 1});
    };

    // For translating strings
    var LocalizeText = function(){
        $("#heading").text(page.text.localize($("#heading").text()));
        $('#heading_risk').text(page.text.localize($("#heading_risk").text()));
        $('#high_risk_classification').text(page.text.localize($('#high_risk_classification').text()));
        document.getElementsByTagName('legend')[0].innerHTML = page.text.localize(document.getElementsByTagName('legend')[0].innerHTML);
        if (document.getElementsByTagName('legend')[1]) document.getElementsByTagName('legend')[1].innerHTML = page.text.localize(document.getElementsByTagName('legend')[1].innerHTML);
        $("#assessment_form label").each(function(){
            var ele = $(this);
            ele.text(page.text.localize(ele.text()));
        });
        $("#assessment_form option").each(function(){
            var ele = $(this);
            ele.text(page.text.localize(ele.text()));
        });
        $("#warning").text(page.text.localize($("#warning").text()));
        $("#submit").text(page.text.localize($("#submit").text()));
    };

    var submitForm = function(){
        $('#submit').attr('disabled', 'disabled');

        if(!validateForm()){
            setTimeout(function() { $('#submit').removeAttr('disabled'); }, 1000);
            return;
        }

        var hasChanged = false;
        Object.keys(financial_assessment).forEach(function(key) {
            if ($('#' + key).length && $('#' + key).val() != financial_assessment[key]) {
                hasChanged = true;
            }
        });
        if (Object.keys(financial_assessment).length === 0) hasChanged = true;
        if (!hasChanged) {
            showFormMessage('You did not change anything.', false);
            setTimeout(function() { $('#submit').removeAttr('disabled'); }, 1000);
            return;
        }

        var data = {'set_financial_assessment' : 1};
        showLoadingImage($('#form_message'));
        $('#assessment_form select').each(function(){
            financial_assessment[$(this).attr('id')] = data[$(this).attr('id')] = $(this).val();
        });
        BinarySocket.send(data);
        RiskClassification.cleanup();
    };

    var validateForm = function(){
        var isValid = true,
            errors = {};
        clearErrors();
        $('#assessment_form select').each(function(){
            if(!$(this).val()){
                isValid = false;
                errors[$(this).attr("id")] = page.text.localize('Please select a value');
            }
        });
        if(!isValid){
            displayErrors(errors);
        }

        return isValid;
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
        financial_assessment = response.get_financial_assessment;
        for(var key in response.get_financial_assessment){
            if(key){
                var val = response.get_financial_assessment[key];
                $("#"+key).val(val);
            }
        }
    };

    var clearErrors = function() {
        $('.errorfield').each(function() { $(this).text(''); });
    };

    var displayErrors = function(errors){
        var id;
        clearErrors();
        for(var key in errors){
            if(key){
                var error = errors[key];
                $("#error"+key).text(page.text.localize(error));
                if (!id) id = key;
            }
        }
        hideLoadingImg();
        $.scrollTo($('#' + id), 500);
    };

    var apiResponse = function(response){
        if (checkIsVirtual()) return;
        if (response.msg_type === 'get_financial_assessment') {
            responseGetAssessment(response);
        } else if (response.msg_type === 'set_financial_assessment') {
            $('#submit').removeAttr('disabled');
            if ('error' in response) {
                showFormMessage('Sorry, an error occurred while processing your request.', false);
                displayErrors(response.error.details);
            } else {
                showFormMessage('Your settings have been updated successfully.', true);
            }
        }
    };

    var checkIsVirtual = function(){
        if(page.client.is_virtual()) {
            $("#assessment_form").addClass('invisible');
            $('#response_on_success').addClass('notice-msg center-text').removeClass('invisible').text(page.text.localize('This feature is not relevant to virtual-money accounts.'));
            hideLoadingImg(false);
            return true;
        }
        return false;
    };

    var showFormMessage = function(msg, isSuccess) {
        $('#form_message')
            .attr('class', isSuccess ? 'success-msg' : 'errorfield')
            .html(isSuccess ? '<ul class="checked" style="display: inline-block;"><li>' + page.text.localize(msg) + '</li></ul>' : page.text.localize(msg))
            .css('display', 'block')
            .delay(5000)
            .fadeOut(1000);
    };

    var onLoad = function() {
        if (japanese_client()) {
            window.location.href = page.url.url_for('user/settingsws');
        }
        BinarySocket.init({
            onmessage: function(msg) {
                var response = JSON.parse(msg.data);
                if (response) {
                    FinancialAssessmentws.apiResponse(response);
                }
            }
        });
        showLoadingImage($('<div/>', {id: 'loading', class: 'center-text'}).insertAfter('#heading'));
        FinancialAssessmentws.init();
    };

    return {
        init : init,
        apiResponse : apiResponse,
        submitForm: submitForm,
        LocalizeText: LocalizeText,
        onLoad: onLoad,
    };
}());

module.exports = {
    FinancialAssessmentws: FinancialAssessmentws,
};
