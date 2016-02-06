var RealAccOpeningData = (function(){
    function getRealAcc(arr){
        var req = {
            new_account_real: 1,
            salutation: arr[0],
            first_name: arr[1],
            last_name: arr[2],
            date_of_birth: arr[3],
            residence: arr[4],
            address_line_1: arr[5],
            address_line_2: arr[6],
            address_city: arr[7],
            address_state: arr[8],
            address_postcode: arr[9],
            phone: arr[10],
            secret_question: arr[11],
            secret_answer: arr[12]
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
