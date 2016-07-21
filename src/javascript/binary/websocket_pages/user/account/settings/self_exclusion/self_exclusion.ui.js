var SelfExclusionUI = (function() {
    'use strict';

    var $loading;
    var errorClass  = 'errorfield';
    var hiddenClass = 'hidden';

    function showPageError(err) {
        $('#errorMsg').html(err).removeClass(hiddenClass);
    }

    function hideForm() {
        $('#frmSelfExclusion').addClass(hiddenClass);
    }

    function showError(id, err) {
        var $p = $('<p/>', {class: errorClass, text: err});
        var $e = $('#' + id);
        if (id === 'timeout_until') {
            $e.css({'margin-bottom': '10px'});
        }
        $e.parent().append($p);
    }

    function clearError(id) {
        $(id ? id : '#frmSelfExclusion p.' + errorClass).remove();
        $('#errorMsg').html('').addClass(hiddenClass);
        $('#formMessage').html('');
    }

    function showFormMessage(msg, isSuccess) {
        $('#formMessage')
            .attr('class', isSuccess ? 'success-msg' : errorClass)
            .html(isSuccess ? '<ul class="checked"><li>' + text.localize(msg) + '</li></ul>' : text.localize(msg))
            .css('display', 'block')
            .delay(5000)
            .fadeOut(1000);
    }

    function init() {
        $loading = $('#loading');
        showLoadingImage($loading);
    }

    function loaded() {
        $loading.addClass(hiddenClass);
        $('#frmSelfExclusion').removeClass(hiddenClass);
    }

    return {
        init: init,
        loaded: loaded,
        showPageError: showPageError,
        showError: showError,
        hideForm: hideForm,
        clearError: clearError,
        showFormMessage: showFormMessage,
        hide: function(selector) {
            $(selector).addClass(hiddenClass);
        },
    };
})();
