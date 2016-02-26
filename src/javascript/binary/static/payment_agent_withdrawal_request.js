pjax_config_page("paymentagent/request_withdrawws", function(){

  return {
    onLoad: function() {
      $('#client_email').html(page.user.email);
      BinarySocket.send({verify_email:page.user.email, type:'paymentagent_withdraw'});
    }
  };
});
