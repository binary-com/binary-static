var RealAccOpeningData = (function(){
    function getRealAcc(elementObj){
        var req = {
            new_account_real: 1,
            salutation: elementObj['title'].value,
            first_name: elementObj['fname'].value,
            last_name: elementObj['lname'].value,
            date_of_birth: elementObj['dobyy'].value + '-' + elementObj['dobmm'].value + '-' + elementObj['dobdd'].value,
            residence: elementObj['residence'].value,
            address_line_1: elementObj['address1'].value,
            address_line_2: elementObj['address2'].value,
            address_city: elementObj['town'].value,
            address_state: elementObj['state'].value,
            address_postcode: elementObj['postcode'].value,
            phone: elementObj['tel'].value,
            secret_question: elementObj['question'].value,
            secret_answer: elementObj['answer'].value
        };

        if ($.cookie('affiliate_tracking')) {
          req.affiliate_token = JSON.parse($.cookie('affiliate_tracking')).t;
        }

        BinarySocket.send(req);
    }

    return {
        getRealAcc: getRealAcc
    };
}());
