pjax_config_page("paymentagent/request_withdrawws", function(){

  return {
    onLoad: function() {
      $('#client_email').html(page.client.email);
      BinarySocket.send({verify_email:page.user.email, type:'payment_agent_withdrawal'});
    }
  };
});
