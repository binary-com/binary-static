var FinancialAccOpeningData = (function(){
    function getRealAcc(elementObj){
        var req = {
            new_account_maltainvest: 1,
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
            forex_trading_experience: elementObj['forexExperience'].value,
            forex_trading_frequency: elementObj['forexFrequency'].value,
            indices_trading_experience: elementObj['indicesExperience'].value,
            indices_trading_frequency: elementObj['indicesFrequency'].value,
            commodities_trading_experience: elementObj['commoditiesExperience'].value,
            commodities_trading_frequency: elementObj['commoditiesFrequency'].value,
            stocks_trading_experience: elementObj['stocksExperience'].value,
            stocks_trading_frequency: elementObj['stocksFrequency'].value,
            other_derivatives_trading_experience: elementObj['binaryExperience'].value,
            other_derivatives_trading_frequency: elementObj['binaryFrequency'].value,
            other_instruments_trading_experience: elementObj['otherExperience'].value,
            other_instruments_trading_frequency: elementObj['otherFrequency'].value,
            employment_industry: elementObj['employment'].value,
            education_level: elementObj['education'].value,
            income_source: elementObj['incomeSource'].value,
            net_income: elementObj['income'].value,
            estimated_worth: elementObj['netWorth'].value
        };

        if ($.cookie('affiliate_tracking')) {
          req.affiliate_token = JSON.parse($.cookie('affiliate_tracking')).t;
        }

        if (elementObj['answer'].value !== '') {
          req.secret_question = elementObj['question'].value;
          req.secret_answer = elementObj['answer'].value;
        }

        if (window.acceptRisk) {
          req.accept_risk = 1;
        } else {
          req.accept_risk = 0;
        }

        BinarySocket.send(req);
    }

    return {
        getRealAcc: getRealAcc
    };
}());
