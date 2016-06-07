var JapanAccOpeningData = (function(){
    function getJapanAcc(elementObj){
        var req = {
          new_account_japan: 1,
          gender : elementObj['gender'].value,
          first_name: elementObj['fname'].value,
          last_name: elementObj['lname'].value,
          date_of_birth : elementObj['dobyy'].value + '-' + elementObj['dobmm'].value + '-' + elementObj['dobdd'].value,
          occupation: elementObj['occupation'].value,
          residence : page.client.residence,
          address_line_1: elementObj['address1'].value,
          address_line_2: elementObj['address2'].value,
          address_city: elementObj['town'].value,
          address_postcode: elementObj['postcode'].value,
          address_state : elementObj['state'].value,
          phone: elementObj['tel'].value,
          secret_question: elementObj['question'].value,
          secret_answer: elementObj['answer'].value,
          annual_income: elementObj['income'].value,
          financial_asset: elementObj['asset'].value,
          daily_loss_limit: elementObj['limit'].value,
          trading_experience_equities: elementObj['equities'].value,
          trading_experience_commodities: elementObj['commodities'].value,
          trading_experience_foreign_currency_deposit: elementObj['deposit'].value,
          trading_experience_margin_fx: elementObj['margin'].value,
          trading_experience_investment_trust: elementObj['trust'].value,
          trading_experience_public_bond: elementObj['bond'].value,
          trading_experience_option_trading: elementObj['otc'].value,
          trading_purpose : elementObj['purpose'].value,
          agree_use_electronic_doc                : 1,
          agree_warnings_and_policies             : 1,
          confirm_understand_own_judgment         : 1,
          confirm_understand_trading_mechanism    : 1,
          confirm_understand_judgment_time        : 1,
          confirm_understand_total_loss           : 1,
          confirm_understand_sellback_loss        : 1,
          confirm_understand_shortsell_loss       : 1,
          confirm_understand_company_profit       : 1,
          confirm_understand_expert_knowledge     : 1,
          declare_not_fatca                       : 1
        };

        if (elementObj['purpose'].value === 'Hedging') {
          req.hedge_asset = elementObj['hedge'].value;
          req.hedge_asset_amount = elementObj['amount'].value;
        }

        BinarySocket.send(req);
    }

    return {
        getJapanAcc: getJapanAcc
    };
}());
