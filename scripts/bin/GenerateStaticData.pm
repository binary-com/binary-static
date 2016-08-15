package GenerateStaticData;

use strict;
use warnings;
use v5.10;

use JSON qw(to_json);
use File::Slurp;
use YAML::XS qw(LoadFile);
# our module in lib
use BS;

sub generate_data_files {
    my $js_path = shift;

    _make_nobody_dir($js_path);
    print "\tGenerating $js_path/texts.js\n";
    File::Slurp::write_file("$js_path/texts.js", {binmode => ':utf8'}, _texts());

    return;
}

sub _texts {
    my $js = "var texts_json = {};\n";
    foreach my $language (BS::all_languages()) {
        BS::set_lang($language);

        my @texts;
        push @texts, localize('Day');
        push @texts, localize('Month');
        push @texts, localize('Year');
        push @texts, localize('Please wait.<br />Your request is being processed.');
        push @texts, localize('loading...');
        push @texts, localize('Failed to update trade description.');
        push @texts, localize('Please try again.');
        push @texts, localize("(Bejing/CST -8 hours)");
        push @texts, localize('You must accept the terms and conditions to open an account.');
        push @texts, localize('We are not accepting accounts from residents of this country at the present time.');
        # top bar
        push @texts, localize('Upgrade to a Real Account');
        push @texts, localize('Upgrade to a Financial Account');
        push @texts, localize('Open a Financial Account');
        # menu items
        push @texts, localize('Start Trading');
        push @texts, localize('My Account');
        push @texts, localize('Portfolio');
        push @texts, localize('Password');
        push @texts, localize('Settings');
        push @texts, localize('Affiliate');
        push @texts, localize('Authenticate');
        push @texts, localize('Cashier');
        push @texts, localize('Resources');
        push @texts, localize('Asset Index');
        push @texts, localize('Trading Times');
        push @texts, localize('Shop');
        # highchart localization text
        push @texts, localize('Print chart');
        push @texts, localize('Save as JPEG');
        push @texts, localize('Save as PNG');
        push @texts, localize('Save as SVG');
        push @texts, localize('Save as PDF');
        push @texts, localize('Save as CSV');
        push @texts, localize('From');
        push @texts, localize('To');
        push @texts, localize('Zoom');
        push @texts, localize('Sunday');
        push @texts, localize('Monday');
        push @texts, localize('Tuesday');
        push @texts, localize('Wednesday');
        push @texts, localize('Thursday');
        push @texts, localize('Friday');
        push @texts, localize('Saturday');
        push @texts, localize('Jan');
        push @texts, localize('Feb');
        push @texts, localize('Mar');
        push @texts, localize('Apr');
        push @texts, localize('May');
        push @texts, localize('Jun');
        push @texts, localize('Jul');
        push @texts, localize('Aug');
        push @texts, localize('Sep');
        push @texts, localize('Oct');
        push @texts, localize('Nov');
        push @texts, localize('Dec');
        push @texts, localize('January');
        push @texts, localize('February');
        push @texts, localize('March');
        push @texts, localize('April');
        push @texts, localize('May');
        push @texts, localize('June');
        push @texts, localize('July');
        push @texts, localize('August');
        push @texts, localize('September');
        push @texts, localize('October');
        push @texts, localize('November');
        push @texts, localize('December');
        push @texts, localize('Week of');
        push @texts, localize('year');
        push @texts, localize('years');
        push @texts, localize('month');
        push @texts, localize('months');
        push @texts, localize('day');
        push @texts, localize('hour');
        push @texts, localize('minute');
        push @texts, localize('second');
        push @texts, localize('Purchase Time');
        push @texts, localize('Start Time');
        push @texts, localize('Entry Spot');
        push @texts, localize('Low Barrier');
        push @texts, localize('High Barrier');
        push @texts, localize('Next');
        push @texts, localize('Previous');
        push @texts, localize('Su');
        push @texts, localize('Mo');
        push @texts, localize('Tu');
        push @texts, localize('We');
        push @texts, localize('Th');
        push @texts, localize('Fr');
        push @texts, localize('Sa');
        push @texts, localize('This contract won');
        push @texts, localize('This contract lost');
        push @texts, localize('Loss');
        push @texts, localize('Profit');
        push @texts,
            localize(
            'We are not able to stream live prices at the moment. To enjoy live streaming of prices try refreshing the page, if you get this issue after repeated attempts try a different browser'
            );
        push @texts, localize('No Live price update');
        push @texts, localize('Please enter a date that is at least 6 months from now.');
        push @texts, localize("When you click 'Ok' you will be excluded from trading on the site until the selected date.");
        push @texts, localize('Please confirm the trade on your statement before proceeding.');
        push @texts, localize('There was a problem accessing the server.');
        push @texts, localize('There was a problem accessing the server during purchase.');
        push @texts, localize('Virtual Account');
        push @texts, localize('Real Account');
        push @texts, localize('Investment Account');
        push @texts, localize('Gaming Account');
        push @texts, localize('The two passwords that you entered do not match.');
        push @texts, localize('Invalid email address');
        push @texts, localize('Your password cannot be the same as your email');

        # text used by websocket trading page javascript
        push @texts, localize('Start time');
        push @texts, localize('Spot');
        push @texts, localize('Barrier');
        push @texts, localize('Barrier offset');
        push @texts, localize('High barrier');
        push @texts, localize('High barrier offset');
        push @texts, localize('Low barrier');
        push @texts, localize('Low barrier offset');
        push @texts, localize('Payout');
        push @texts, localize('Stake');
        push @texts, localize('Purchase');
        push @texts, localize('Duration');
        push @texts, localize('End Time');
        push @texts, localize('[ctx,minimum duration, for example minimum 15 seconds]min');
        push @texts, localize('minimum available duration');
        push @texts, localize('Enter the barrier in terms of the difference from the spot price. If you enter +0.005, then you will be purchasing a contract with a barrier 0.005 higher than the entry spot. The entry spot will be the next tick after your order has been received');
        push @texts, localize('seconds');
        push @texts, localize('minutes');
        push @texts, localize('hours');
        push @texts, localize('days');
        push @texts, localize('ticks');
        push @texts, localize('Net profit');
        push @texts, localize('Return');
        push @texts, localize('Now');
        push @texts, localize('Contract Confirmation');
        push @texts, localize('Your transaction reference is');
        push @texts, localize('Your current balance is');
        push @texts, localize('Rise/Fall');
        push @texts, localize('Higher/Lower');
        push @texts, localize('Period');
        push @texts, localize('Exercise period');
        push @texts, localize('Last Digit Prediction');
        push @texts, localize('Potential Payout');
        push @texts, localize('Total Cost');
        push @texts, localize('Potential Profit');
        push @texts, localize('Exercise period');
        push @texts, localize('Amount per point');
        push @texts, localize('Stop-loss');
        push @texts, localize('Stop-type');
        push @texts, localize('Points');
        push @texts, localize('View');
        push @texts, localize('Random');
        push @texts, localize('In/Out');
        push @texts, localize('Statement');
        push @texts, localize('Next Day');
        push @texts, localize('Previous Day');
        push @texts, localize('Jump To');
        push @texts, localize('Date');
        push @texts, localize('Ref.');
        push @texts, localize('Contract purchased with app ID');
        push @texts, localize('Action');
        push @texts, localize('Sell');
        push @texts, localize('Buy');
        push @texts, localize('Description');
        push @texts, localize('Credit/Debit');
        push @texts, localize('Balance');
        push @texts, localize('points');
        push @texts, localize('Tick');
        push @texts, localize('Date (GMT)');
        push @texts, localize('Contract');
        push @texts, localize('Purchase Price');
        push @texts, localize('Sale Date');
        push @texts, localize('Sale Price');
        push @texts, localize('Profit/Loss');
        push @texts, localize('Profit Table');
        push @texts, localize('Total Profit/Loss');
        push @texts, localize('Long');
        push @texts, localize('Short');
        push @texts, localize('Deposit of');
        push @texts, localize('is required. Current spread');
        push @texts, localize('Matches/Differs');
        push @texts, localize('Chart');
        push @texts, localize('Explanation');
        push @texts, localize('Last Digit Stats');
        push @texts, localize('Prices');
        push @texts, localize('Authorise your account.');
        push @texts, localize('Even/Odd');
        push @texts, localize('Over/Under');
        push @texts, localize('Up/Down');
        push @texts, localize('Ends In/Out');
        push @texts, localize('Touch/No Touch');
        push @texts, localize('Stays In/Goes Out');
        push @texts, localize('Waiting for entry tick.');
        push @texts, localize('Refresh page');

        #strings for limitsws page
        push @texts, localize('Trading and Withdrawal Limits');
        push @texts, localize('Item');
        push @texts, localize('Limit');
        push @texts, localize('Maximum number of open positions');
        push @texts, localize('Represents the maximum number of outstanding contracts in your portfolio. Each line in your portfolio counts for one open position. Once the maximum is reached, you will not be able to open new positions without closing an existing position first.');
        push @texts, localize('Maximum account cash balance');
        push @texts, localize('Represents the maximum amount of cash that you may hold in your account.  If the maximum is reached, you will be asked to withdraw funds.');
        push @texts, localize('Maximum daily turnover');
        push @texts, localize('Represents the maximum volume of contracts that you may purchase in any given trading day.');
        push @texts, localize('Maximum aggregate payouts on open positions');
        push @texts, localize('Presents the maximum aggregate payouts on outstanding contracts in your portfolio. If the maximum is attained, you may not purchase additional contracts without first closing out existing positions.');
        push @texts, localize('Trading Limits');
        push @texts, localize('Withdrawal Limits');
        push @texts, localize('Your account is fully authenticated and your withdrawal limits have been lifted.');
        push @texts, localize('Your withdrawal limit is [_1] [_2].');
        push @texts, localize('Your withdrawal limit is [_1] [_2] (or equivalent in other currency).');
        push @texts, localize('You have already withdrawn [_1] [_2].');
        push @texts, localize('You have already withdrawn the equivalent of [_1] [_2].');
        push @texts, localize('Therefore your current immediate maximum withdrawal (subject to your account having sufficient funds) is [_1] [_2].');
        push @texts, localize('Therefore your current immediate maximum withdrawal (subject to your account having sufficient funds) is [_1] [_2] (or equivalent in other currency).');
        push @texts, localize('Your [_1] day withdrawal limit is currently [_2] [_3] (or equivalent in other currency).');
        push @texts, localize('You have already withdrawn the equivalent of [_1] [_2] in aggregate over the last [_3] days.');

        #strings for detailsws
        push @texts, localize('This field is required.');
        push @texts, localize('You should enter between [_1] characters.');
        push @texts, localize('Only [_1] are allowed.');
        push @texts, localize('letters');
        push @texts, localize('numbers');
        push @texts, localize('space');
        push @texts, localize('period');
        push @texts, localize('comma');
        push @texts, localize('Sorry, an error occurred while processing your account.');
        push @texts, localize('Your settings have been updated successfully.');
        push @texts, localize('m');
        push @texts, localize('f');
        push @texts, localize('Office worker');
        push @texts, localize('Director');
        push @texts, localize('Public worker');
        push @texts, localize('Self-employed');
        push @texts, localize('Housewife / Househusband');
        push @texts, localize('Contract / Temporary / Part Time');
        push @texts, localize('Student');
        push @texts, localize('Unemployed');
        push @texts, localize('Others');
        push @texts, localize('Less than 1 million JPY');
        push @texts, localize('1-3 million JPY');
        push @texts, localize('3-5 million JPY');
        push @texts, localize('5-10 million JPY');
        push @texts, localize('10-30 million JPY');
        push @texts, localize('30-50 million JPY');
        push @texts, localize('50-100 million JPY');
        push @texts, localize('Over 100 million JPY');
        push @texts, localize('No experience');
        push @texts, localize('Less than 6 months');
        push @texts, localize('6 months to 1 year');
        push @texts, localize('1-3 years');
        push @texts, localize('3-5 years');
        push @texts, localize('Over 5 years');
        push @texts, localize('Targeting short-term profits');
        push @texts, localize('Targeting medium-term / long-term profits');
        push @texts, localize('Both the above');
        push @texts, localize('Hedging');
        push @texts, localize('Foreign currency deposit');
        push @texts, localize('Margin FX');

        #strings for home and virtualws page
        push @texts, localize('verification token');
        push @texts, localize('Please submit a valid [_1].');
        push @texts, localize('password');
        push @texts, localize('The two passwords that you entered do not match.');
        push @texts, localize('Your token has expired. Please click <a class="pjaxload" href="[_1]">here</a> to restart the verification process.');
        push @texts, localize('Your provided email address is already in use by another Login ID. According to our terms and conditions, you may only register once through our site. If you have forgotten the password of your existing account, please <a href="[_1]">try our password recovery tool</a> or contact customer service.');
        push @texts, localize('Try adding more numbers.');
        push @texts, localize('Try adding more letters.');
        push @texts, localize('Try adding more letters or numbers.');
        push @texts, localize('Password score is: [_1]. Passing score is: 20.');
        push @texts, localize('Password should have lower and uppercase letters with numbers.');
        push @texts, localize('Password is not strong enough.');
        push @texts, localize('Password is weak');
        push @texts, localize('Password is moderate');
        push @texts, localize('Password is strong');
        push @texts, localize('Password is very strong');
        push @texts, localize('Please [_1] to view this page');
        push @texts, localize('login');
        push @texts, localize('Your session duration limit will end in [_1] seconds.');

        #strings for realws page
        push @texts, localize('hyphen');
        push @texts, localize('apostrophe');
        push @texts, localize('Mr');
        push @texts, localize('Mrs');
        push @texts, localize('Ms');
        push @texts, localize('Miss');
        push @texts, localize('Please input a valid date');
        push @texts, localize('Please select');
        push @texts, localize('Sorry, account opening is unavailable.');
        push @texts, localize('Minimum of [_1] characters required.');
        push @texts, localize('Sorry, this feature is not available.');

        #strings for trading_timesws page
        push @texts, localize('Asset');
        push @texts, localize('Opens');
        push @texts, localize('Closes');
        push @texts, localize('Settles');
        push @texts, localize('Upcoming Events');

        #strings for paymentagent_withdrawws page
        push @texts, localize('You are not authorized for withdrawal via payment agent.');
        push @texts, localize('Please select a payment agent');
        push @texts, localize('The Payment Agent facility is currently not available in your country.');
        push @texts, localize('Invalid amount, minimum is');
        push @texts, localize('Invalid amount, maximum is');
        push @texts, localize('Your request to withdraw [_1] [_2] from your account [_3] to Payment Agent [_4] account has been successfully processed.');
        push @texts, localize('Only 2 decimal points are allowed.');

        #strings for api_tokenws page
        push @texts, localize('New token created.');
        push @texts, localize('An error occured.');
        push @texts, localize('The maximum number of tokens ([_1]) has been reached.');
        push @texts, localize('Name');
        push @texts, localize('Token');
        push @texts, localize('Last Used');
        push @texts, localize('Never Used');
        push @texts, localize('Delete');
        push @texts, localize('Are you sure that you want to permanently delete token');

        #strings for Walkthrough Guide
        push @texts, localize('Walkthrough Guide');
        push @texts, localize('Finish');
        push @texts, localize('Step');
        #strings for Walkthrough Guide -> trading page
        push @texts, localize('Select your market');
        push @texts, localize('Select your underlying asset');
        push @texts, localize('Select your trade type');
        push @texts, localize('Adjust trade parameters');
        push @texts, localize('Predict the direction<br />and purchase');

        #strings for top_up_virtualws
        push @texts, localize('Sorry, this feature is available to virtual accounts only.');
        push @texts, localize('[_1] [_2] has been credited to your Virtual money account [_3]');

        #strings for self_exclusionws
        push @texts, localize('Your changes have been updated.');
        push @texts, localize('Please enter an integer value');
        push @texts, localize('Please enter a number between 0 and [_1]');
        push @texts, localize('Session duration limit cannot be more than 6 weeks.');
        push @texts, localize('You did not change anything.');
        push @texts, localize('Please select a valid date');
        push @texts, localize('Exclude time must be after today.');
        push @texts, localize('Exclude time cannot be less than 6 months.');
        push @texts, localize('Exclude time cannot be for more than 5 years.');
        push @texts, localize('When you click "Ok" you will be excluded from trading on the site until the selected date.');

        #strings for change_passwordws
        push @texts, localize('Old password is wrong.');
        push @texts, localize('New password is same as old password.');

        #strings for profittable and statement
        push @texts, localize('Your account has no trading activity.');

        #strings for authenticate page
        push @texts, localize('To authenticate your account, kindly email the following to [_1]');
        push @texts, localize('A scanned copy of your passport, driving licence (provisional or full) or identity card, showing your name and date of birth. Your document must be valid for at least 6 months after this date.');
        push @texts, localize('A scanned copy of a utility bill or bank statement (no more than 3 months old).');
        push @texts, localize('This feature is not relevant to virtual-money accounts.');
        push @texts, localize('Your account is currently suspended. Only withdrawals are now permitted. For further information, please contact [_1].');
        push @texts, localize('Deposits and withdrawal for your account is not allowed at this moment. Please contact [_1] to unlock it.');
        push @texts, localize('Withdrawal for your account is not allowed at this moment. Please contact [_1] to unlock it.');

        #strings for japanws page
        push @texts, localize('Questions');
        push @texts, localize('True');
        push @texts, localize('False');
        push @texts, localize('There was some invalid character in an input field.');
        push @texts, localize('Please follow the pattern 3 numbers, a dash, followed by 4 numbers.');
        push @texts, localize('Score');
        push @texts, localize('Date');
        push @texts, localize('{JAPAN ONLY}Take knowledge test');
        push @texts, localize('{JAPAN ONLY}Knowledge Test Result');
        push @texts, localize('{JAPAN ONLY}Knowledge Test');
        push @texts, localize('{JAPAN ONLY}Section 1: Structure');
        push @texts, localize('{JAPAN ONLY}Section 2: Method');
        push @texts, localize('{JAPAN ONLY}Section 3: Outline');
        push @texts, localize('{JAPAN ONLY}Section 4: Risk');
        push @texts, localize('{JAPAN ONLY}Section 5: Calculation');
        push @texts, localize('{JAPAN ONLY}An option holder must buy ( or sell ) the underlying asset at a predetermined price within a specified period ( or at a specific time ).');
        push @texts, localize('{JAPAN ONLY}A Currency Option confers the right to sell one currency in exchange for another currency as the underlying asset. For example, the right to sell Yen and buy Dollars is known as a Yen Put / Dollar Call Option, or just Yen Put for short; and the opposite right to buy Yen and sell Dollar is called a Yen Call / Dollar Put Option, or just Yen Call for short.');
        push @texts, localize('{JAPAN ONLY}There are two types of option delivery: One requires exchanging the underlying asset, and the other requires a payment which depends on the difference between the fair market price and the exercise price. A Binary Option is the second type where if the fair market price meets certain conditions with respect to the exercise price, then an agreed fixed amount will be paid to the option buyer.');
        push @texts, localize('{JAPAN ONLY}A  Net Settlement type of option is one where the underlying asset does not include yen, but the option fee and settlement are paid in yen; it therefore requires some definition of how the settlement amounts will be calculated and converted to yen.');
        push @texts, localize('{JAPAN ONLY}A Binary Option contains the right for the buyer to receive a certain fixed amount if the market price reaches the exercise price by the exercise time, but it does not contain any rights to sell or buy the underlying asset.');
        push @texts, localize('{JAPAN ONLY}There are some types of Binary Option, such as Range Binary Options, Touch or No-Touch Binary Options, that are exceptions to the general rule where payment is made at a known exercise time. For these types of option a payment is made automatically at Exit Time when certain conditions have been met.');
        push @texts, localize('{JAPAN ONLY}There are many types of Binary Option, including some such as Range Binary Options and Touch or No-Touch Binary Options which do not always require automatic payment at Exercise Time and which will be settled earlier if certain conditions have been met. However, in all cases, for a payment to be required, the option must end In The Money.');
        push @texts, localize('{JAPAN ONLY}A Currency Binary Option is one where there is a target for a particular currency pair, so a strike price for the exchange rate is agreed, and a payout will be due if the judgment price meets the conditions of being over or under the target strike price, depending on the option type, by the exercise time.');
        push @texts, localize('{JAPAN ONLY}For a currency binary option which has the underlying exchange rate of dollars against yen, the right to receive a payout if the yen becomes weaker is known as a dollar-put binary option.');
        push @texts, localize('{JAPAN ONLY}For a currency binary option with the underlying exchange rate of dollars against yen, the right to receive a payout if the yen becomes stronger is known as a dollar-put binary option.');
        push @texts, localize('{JAPAN ONLY}If you sell a currency binary call option at a price of 500 yen, with an underlying of dollar against yen, the payout is 1,000 yen, and the strike price is 100, then if the judgment price at exercise time is 99, you will need to payout 1,000 yen to the buyer of the option.');
        push @texts, localize('{JAPAN ONLY}If you sell a currency binary put option at a price of 500 yen, with an underlying of dollar against yen, the payout is 1,000 yen, and the strike price is 100, then if the judgment price at exercise time is 99, you will need to payout 1,000 yen to the buyer of the option.');
        push @texts, localize('{JAPAN ONLY}If you buy a currency binary call option at a price of 500 yen, with an underlying of dollar against yen, the payout is 1,000 yen, and the strike price is 100, then if the judgment price at exercise time is 99, you will receive a payout 1,000 yen from the seller of the option.');
        push @texts, localize('{JAPAN ONLY}If you buy a currency binary put option at a price of 500 yen, with an underlying of dollar against yen, the payout is 1,000 yen, and the strike price is 100, then if the judgment price at exercise time is 99, you will receive a payout 1,000 yen from the seller of the option.');
        push @texts, localize('{JAPAN ONLY}If you buy a currency binary option at a price of 500 yen, and the judgment price meets the conditions so you receive a payout of 1,000 yen, then your profit can be calculated 500 yen after subtracting the 500 yen that was paid as a fee to the option seller.');
        push @texts, localize('{JAPAN ONLY}If you sell a currency binary option at a price of 500 yen, and the judgment price meets the conditions so you need to payout 1,000 yen, then your profit will be minus 500 yen after subtracting the 500 yen that was received as a fee from the option buyer.');
        push @texts, localize('{JAPAN ONLY}To avoid or hedge the future price of an underlying asset which you hold, you should buy a call option.');
        push @texts, localize('{JAPAN ONLY}To compensate for any rise in the price of an underlying asset that you intend to buy in future, you should buy a call option.');
        push @texts, localize('{JAPAN ONLY}If you believe the underlying asset price will move by a large amount in either direction, you can benefit by buying both a call and a put option, with the exercise prices set above and below the current underlying price.');
        push @texts, localize('{JAPAN ONLY}If you believe the underlying asset price will be only moderately volatile, you could still benefit by buying both a call and put option with exercise prices that are above and below the exercise price.');
        push @texts, localize('{JAPAN ONLY}A Covered option position is where you hold an offsetting position in the underlying asset.');
        push @texts, localize('{JAPAN ONLY}A binary call option buyer will benefit from a correct prediction that the asset price will decline to below the strike price by the judgment time.');
        push @texts, localize('{JAPAN ONLY}A binary put option buyer will benefit from a correct prediction that the asset price will decline to below the strike price by the judgment time.');
        push @texts, localize('{JAPAN ONLY}A binary put options buyer will benefit from a correct prediction that the asset price will rise above the strike price by the judgment time.');
        push @texts, localize('{JAPAN ONLY}A binary call options buyer will benefit from a correct prediction that the asset price will rise above the strike price by the judgment time.');
        push @texts, localize('{JAPAN ONLY}When buying a vanilla call option, the break-even price at the exercise point is the strike price plus the option price paid in units of the underlying.');
        push @texts, localize('{JAPAN ONLY}When buying a vanilla put option, the break-even price at the exercise point is the strike price minus the option price paid in units of the underlying.');
        push @texts, localize('{JAPAN ONLY}Using binary options for hedging a position in the underlying asset means that only part of the loss or gain can be hedged, because the payout amount is fixed.');
        push @texts, localize('{JAPAN ONLY}It is possible to use two binary options to make a profit if the asset price settles inbetween the two strikes. It is also possible to buy a single range option that will achieve the same result.');
        push @texts, localize('{JAPAN ONLY}It is possible to use two binary options to make a profit if the asset price settles outside the two strikes. It is also possible to buy a single range option that will achieve the same result.');
        push @texts, localize('{JAPAN ONLY}In Japan there are defined trading periods for binary options must be 2 hours or longer, and all trades must be conducted at the start of each trading period.');
        push @texts, localize('{JAPAN ONLY}A bought or sold binary option may be closed-out before exercise time by selling or buying-back the option, or alternatively by cancelling.');
        push @texts, localize('{JAPAN ONLY}In contrast to other types of FX options, short positions in FX Binary Options cannot be closed-out as they are not subject to loss-cut regulations.');
        push @texts, localize('{JAPAN ONLY}Short positions in FX Binary Options must be covered by initial margin and any further losses must be covered by further margin deposits.');
        push @texts, localize("{JAPAN ONLY}Although customers and brokers will set limits on customers trading losses, even if those losses are exceeded, it is the customer's responsibility to close the position and so mandatory loss-cuts will not be executed by the broker company.");
        push @texts, localize('{JAPAN ONLY}Options may be European or American style of exercise, and those which can be exercised at only one expiry time are the European style options.');
        push @texts, localize('{JAPAN ONLY}For a call option, if the price of the underlying asset is higher than the option exercise price, it is know as an in-the-money option.');
        push @texts, localize('{JAPAN ONLY}For a call option, if the price of the underlying asset is higher than the option exercise price, it is know as an out-of-the-money option.');
        push @texts, localize('{JAPAN ONLY}For both call and put options, if the underlying asset price is the same as the exercise price, it is known as an at-the-money option.');
        push @texts, localize('{JAPAN ONLY}For a put option, if the underlying asset price is lower than the option exercise price, it is known as an out-of-the-money option.');
        push @texts, localize('{JAPAN ONLY}For a put option, if the underlying asset price is higher than the option exercise price, it is known as an in-the-money option.');
        push @texts, localize('{JAPAN ONLY}The Exercise Price is the level at which the option buyer has the right to trade the underlying, and is also used for binary options to determine whether the buyer should receive a payout.');
        push @texts, localize('{JAPAN ONLY}The Exit Price is the price that is observed at the judgment time, and is used to determine whether a payout should be made.');
        push @texts, localize('{JAPAN ONLY}The payout is the amount that the option seller must pay to the buyer if the buyer exercises his right when the conditions for a payout have been satisfied.');
        push @texts, localize('{JAPAN ONLY}In OTC currency binary options trading, if the exchange rate during the trading period moves by more than expected in one direction, and there are no longer any exercise prices which can continue to trade, it is possible under certain conditions to add further exercise prices. However, even when further exercise price have been added, the prices of the original options will not be affected.');
        push @texts, localize('{JAPAN ONLY}The exit price is important in binary options. In case of handling the OTC currency-related binary options trading for private individuals, the broker company must perform inspections of the exit prices which have been used for determining option payout, and must check whether there is an error in the data in cases where that the company has used rated data provided by third company.');
        push @texts, localize("{JAPAN ONLY}About OTC currency for binary options trading, summarizes the profit and loss result of all transactions that have been made between the customer, to publish the information in the company's home page, at any time while the customer is doing the transaction before the start, or the transaction, the information Make sure, for that you're willing to trade under the calm judgment, we are committed to a variety of environmental improvement.");
        push @texts, localize('{JAPAN ONLY}For an individual investor, all profits from OTC currency options trading are tax-free.');
        push @texts, localize('{JAPAN ONLY}For an individual investor, profits and losses from OTC currency options traing cannot be combined with profits and losses from margin FX and securities-related OTC options.');
        push @texts, localize('{JAPAN ONLY}Unless special arrangements are made, cooling-off will not be available after OTC binary options trading contract has been made.');
        push @texts, localize('{JAPAN ONLY}If the buyer of an option does not exercise the option rights, there will be no fee payable to the option seller.');
        push @texts, localize('{JAPAN ONLY}If the buyer of an option waives his right to exercise, a transaction in the underlying asset will not be dealt between the seller and the buyer.');
        push @texts, localize('{JAPAN ONLY}The seller of an option should receive the option premium from the buyer, even if the buyer waives the right to exercise the option.');
        push @texts, localize('{JAPAN ONLY}If an option buyer wishes to exercise the option rights, the seller may still reject the deal.');
        push @texts, localize('{JAPAN ONLY}Options are said to be leveraged products because in the case of large moves in the underlying asset price, the values of the options can increase by large amounts compared to the price paid for the option.');
        push @texts, localize('{JAPAN ONLY}The buyer of a vanilla option can choose whether to exercise the option or not. His loss is limited to the price paid for the option, whereas his potential profit is unlimited.');
        push @texts, localize('{JAPAN ONLY}The seller of a vanilla option can not choose whether to exercise the option or not. His profit is limited to the price received for the option, whereas his potential loss is unlimited and could be substantial.');
        push @texts, localize('{JAPAN ONLY}If the exercise period passes without the option being exercised by the buyer, the option premium received by the seller will be the profit made on the trade.');
        push @texts, localize('{JAPAN ONLY}Even if the option is exercise or not exercised, the original option premium remains with the option seller.');
        push @texts, localize('{JAPAN ONLY}The maximum loss for the buyer of an option is the price paid, and the maximium loss for the option seller will be the payout amount minus the opion price he received.');
        push @texts, localize('{JAPAN ONLY}Because option prices are determined by the probability of being exercised, it cannot be said that cheaper options have any natural advantage over expensive options.');
        push @texts, localize('{JAPAN ONLY}Binary options have lower risk than vanilla options for option sellers, because with binary options the maximum loss is fixed.');
        push @texts, localize('{JAPAN ONLY}Even though losses in binary options are limited, it is still necessary to take care not to engage in excessive speculative trading and to moderate your transactions volume.');
        push @texts, localize('{JAPAN ONLY}If the probablility of a payout is 50% then when the potential payout is less than 100% of the price paid for the option, the expected return on the investment will be less than 100%.');
        push @texts, localize('{JAPAN ONLY}It cannot be said that binary options trading is unconditionally advanteous over regular spot fx trading, because investors may lose all of their investment whereas in spot fx trading there will still be some value in the trading position.');
        push @texts, localize('{JAPAN ONLY}The particular details of binary options are all the same, no matter which broking company you trade with.');
        push @texts, localize('{JAPAN ONLY}The price of OTC binary options of the same conditions, (sometimes) the price varies depending on transactions dealers handling financial instruments business.');
        push @texts, localize('{JAPAN ONLY}Price of OTC currency option is the calculated value based on multiple elements and is determined by relative trading basically.');
        push @texts, localize('{JAPAN ONLY}Regarding to the OTC price of financial instruments, in case that financial instruments business operator suggests both of  bid and ask price (or trading price and cancellation price), generally there is a difference of them. This option will be wider as the expiration approaches.');
        push @texts, localize('{JAPAN ONLY}Price of the option, the price of the underlying asset, price fluctuation rate of the underlying assets, the time until the exercise date, subject to any of the impact of interest rates.');
        push @texts, localize('{JAPAN ONLY}The price of an option can be affected by the underlying asset price, by the volatility rate of the underlying asset, or by the time remaining to the exercise time.');
        push @texts, localize('{JAPAN ONLY}Price of call option will be lower interest rates of the underlying assets is low, but the price of the put option, go up when the interest rates of the underlying assets is low.');
        push @texts, localize('{JAPAN ONLY}If the exercise prices and exercise times are the same for an American style and European style option, then the American style option will have a higher price.');
        push @texts, localize('{JAPAN ONLY}In case of the right to buy the underlying asset (call option), when the underlying asset price falls, the option price will increase.');
        push @texts, localize('{JAPAN ONLY}In case of the right to sell the underlying asset (put option), when the underlying asset price rises, the option price will increase.');
        push @texts, localize('{JAPAN ONLY}For an out-of-the-money option, the further away from the underlying asset price that the option exercise price is, the lower the price of the option will be.');
        push @texts, localize('{JAPAN ONLY}For an in-the-money option, the further away from the underlying asset price that the option exercise price is, the lower the price of the option will be.');
        push @texts, localize('{JAPAN ONLY}If implied volatility increases then the prices of both call and put types of plain vanilla options will increase.');
        push @texts, localize('{JAPAN ONLY}As the expected volatility of the underlying asset increases, a plain vanilla option price will move higher.');
        push @texts, localize('{JAPAN ONLY}For a plain vanilla option, as the time to the exercise point shortens, the price of the option will decrease.');
        push @texts, localize('{JAPAN ONLY}An option price is the sum of the intrinsic-value and the time-value.');
        push @texts, localize('{JAPAN ONLY}If the underlying asset price is 100 yen, the exercise price is 80 yen, and the call option price is 45 yen, then it can be said that the option\'s intrinsic-value is 20 yen, and its time-value is 25 yen.');
        push @texts, localize('{JAPAN ONLY}The time-value of an option represents the expected value of the option at the exercise point, and may be positive, even when the intrinsic-value is zero.');
        push @texts, localize('{JAPAN ONLY}As the time to the exercise point shortens, the time-value of a plain vanilla option decreases.');
        push @texts, localize('{JAPAN ONLY}A binary option price cannot exceed the payout amount.');
        push @texts, localize('{JAPAN ONLY}In general a binary option price will not exceed the payout amount.');
        push @texts, localize('{JAPAN ONLY}Unlike a plain vanilla option, an in-the-money binary option will have a lower price, the further away it is from the exercise point.');
        push @texts, localize('{JAPAN ONLY}In general the price of a binary option will be lower than the price of a plain vanilla option because the payout amount is fixed.');
        push @texts, localize('{JAPAN ONLY}A binary option which is out-of-the-money will have a lower price than an option which is in-the-money because the probability of receiving the payout amount is lower.');
        push @texts, localize('{JAPAN ONLY}A binary option which is in-the-money will have a higher value than an option that is out-of-the-money because there will be a higher probability of receiving the payout amount.');
        push @texts, localize('{JAPAN ONLY}As the exercise deadline approaches, the price of an in-the-money binary option will move towards the payout amount.');
        push @texts, localize('{JAPAN ONLY}As the exercise deadline approaches, the price of an out-of-the-money binary option will move towards zero.');
        push @texts, localize('{JAPAN ONLY}The price of a binary option is affected by not only the change in the underlying asset price, but also the change in remaining time to the exercise point.');
        push @texts, localize('{JAPAN ONLY}Implied volatility is a prediction of the future rate of change in the underlying asset.');
        push @texts, localize('{JAPAN ONLY}Historical volatility is a prediction of the future rate of change in the underlying asset.');
        push @texts, localize('{JAPAN ONLY}Delta refers to  a percentage change of the option price with respect to the change in the underlying asset price.');
        push @texts, localize('{JAPAN ONLY}Option prices are normally dependant on elements such as the underlying asset price, the exercise price, the length of time until the exercise point, volatility, and interest rates. Apart from the fixed exercise price, all other elements are changing constantly, so an understanding of the relationships between each element and changes in the options price is necessary for the management of options trading risk.');
        push @texts, localize('{JAPAN ONLY}Option prices are normally dependant on elements such as the underlying asset price, the exercise price, the length of time until the exercise point, volatility, and interest rates. However, when the remaining time to the exercise point is very short, there is no need to consider these when managing option trading risk, as all these elements are constant.');
        push @texts, localize('{JAPAN ONLY}The Black-Scholes model is widely used to calculate theoretical option prices.');
        push @texts, localize('{JAPAN ONLY}A modified version of the Black-Scholes model is widely used to calculate the theoretical prices of binary options.');
        push @texts, localize('{JAPAN ONLY}Congratulations, you have pass the test, our Customer Support will contact you shortly.');
        push @texts, localize('{JAPAN ONLY}Sorry, you have failed the test, please try again after 24 hours.');
        push @texts, localize('{JAPAN ONLY}Dear customer, you are not allowed to take knowledge test until [_1]. Last test taken at [_2].');
        push @texts, localize('{JAPAN ONLY}Dear customer, you\'ve already completed the knowledge test, please proceed to next step.');
        push @texts, localize('{JAPAN ONLY}Please complete the following questions.');
        push @texts, localize('{JAPAN ONLY}The test is unavailable now, test can only be taken again on next business day with respect of most recent test.');
        push @texts, localize('{JAPAN ONLY}[_1] [_2] payout if [_3] is strictly higher or equal than Exercise price at close  on [_4].');
        push @texts, localize('{JAPAN ONLY}[_1] [_2] payout if [_3] is strictly lower than Exercise price at close on [_4].');
        push @texts, localize('{JAPAN ONLY}[_1] [_2] payout if [_3] does not touch Exercise price through close on [_4].');
        push @texts, localize('{JAPAN ONLY}[_1] [_2] payout if [_3] touches Exercise price through close on [_4].');
        push @texts, localize('{JAPAN ONLY}[_1] [_2] payout if [_3] ends on or between low and high values of Exercise price at close on [_4].');
        push @texts, localize('{JAPAN ONLY}[_1] [_2] payout if [_3] ends otside low and high values of Exercise price at close on [_4].');
        push @texts, localize('{JAPAN ONLY}[_1] [_2] payout if [_3] stays between low and high values of Exercise price through close on [_4].');
        push @texts, localize('{JAPAN ONLY}[_1] [_2] payout if [_3] goes ouside of low and high values of Exercise price through close on [_4].');
        push @texts, localize('{JAPAN ONLY}Even if all details of the binary options match perfectly, there may still be differences in the prices shown by different broking companies.');
        push @texts, localize('{JAPAN ONLY}Prices for currency options are calculated relative the value of theunderlying spot price, and are dependant on multiple factors which may vary.');
        push @texts, localize('{JAPAN ONLY}Where broking companies show bid and offer prices for purchasing and sell-back of positions, these prices may become further apart the nearer you are to the exercise time.');
        push @texts, localize('{JAPAN ONLY}Option prices depend on the spot price, the time to expiry, the volatility of the spot rate and interest rates.');
        push @texts, localize('{JAPAN ONLY}The price of a vanilla call option will be lower when price of the underlying asset is low, but the price of the put option will be higher when the price of the underlying asset is low.');
        push @texts, localize('{JAPAN ONLY}This knowledge test is required by law. As we provide the test, we know customers better whether the customers are suitable investors to be carried out the binary options trading, and customers can start trading with us.');
        push @texts, localize('{JAPAN ONLY}To invest a binary options investment accurately, the customer are required knowledge and experience related to derivative transactions.');
        push @texts, localize('{JAPAN ONLY}This test is for the purpose of confirming if the customers have basic knowledge related to options trading .');
        push @texts, localize('{JAPAN ONLY}It is determined the customers have basic knowledge of option trading by the results of the knowledge test. If the customers start trading, the customers need to agree not have lawsuit despite the customer are shortage of knowledge related to options trading, and it cause damages, we admit to open the trading account.');
        push @texts, localize('{JAPAN ONLY}It prohibits the copying of the questions . In addition , You agree that you will not leak to third party');
        push @texts, localize('{JAPAN ONLY}HIGH/LOW');
        push @texts, localize('{JAPAN ONLY}TOUCH /NO-TOUCH');
        push @texts, localize('{JAPAN ONLY}END-IN/END-OUT');
        push @texts, localize('{JAPAN ONLY}STAY-IN/BREAK-OUT');
        push @texts, localize('{JAPAN ONLY}minute');
        push @texts, localize('{JAPAN ONLY}minutes');
        push @texts, localize('{JAPAN ONLY}hour');
        push @texts, localize('{JAPAN ONLY}hours');
        push @texts, localize('{JAPAN ONLY}day');
        push @texts, localize('{JAPAN ONLY}days');
        push @texts, localize('{JAPAN ONLY}week');
        push @texts, localize('{JAPAN ONLY}weeks');
        push @texts, localize('{JAPAN ONLY}month');
        push @texts, localize('{JAPAN ONLY}months');
        push @texts, localize('{JAPAN ONLY}year');
        push @texts, localize('{JAPAN ONLY}years');
        push @texts, localize('{JAPAN ONLY}Higher');
        push @texts, localize('{JAPAN ONLY}Lower');
        push @texts, localize('{JAPAN ONLY}Touches');
        push @texts, localize('{JAPAN ONLY}Does Not Touch');
        push @texts, localize('{JAPAN ONLY}Ends Between');
        push @texts, localize('{JAPAN ONLY}Ends Outside');
        push @texts, localize('{JAPAN ONLY}Stays Between');
        push @texts, localize('{JAPAN ONLY}Goes Outside');
        push @texts, localize('{JAPAN ONLY}FX Rate');
        push @texts, localize('{JAPAN ONLY}Option Type');
        push @texts, localize('{JAPAN ONLY}Trading Period');
        push @texts, localize('{JAPAN ONLY}Payout Amount');
        push @texts, localize('{JAPAN ONLY}Remaining time');
        push @texts, localize('You need to finish all 20 questions.');
        push @texts, localize('Weekday');

        #strings for digit_infows
        push @texts, localize('Select market');
        push @texts, localize('Number of ticks');
        push @texts, localize('Last digit stats for the latest [_1] ticks on [_2]');

        #strings for tnc_approvalws
        push @texts, localize('[_1] has updated its [_2]. By clicking OK, you confirm that you have read and accepted the updated [_2].');
        push @texts, localize('Terms & Conditions');
        push @texts, localize('Ok');

        #strings for paymentagentws
        push @texts, localize('Amount');
        push @texts, localize('Deposit');
        push @texts, localize('Login ID');
        push @texts, localize('Back');
        push @texts, localize('Confirm');
        push @texts, localize('View your statement');
        push @texts, localize('Please deposit before transfer to client.');
        push @texts, localize('Please fill in the Login ID and Amount you wish to transfer to your Client in the form below:');
        push @texts, localize('Transfer to Login ID');
        push @texts, localize('Please enter a valid amount.');
        push @texts, localize('Our site does not charge any transfer fees.');
        push @texts, localize('Once you click the \'Submit\' button, the funds will be withdrawn from your account and transferred to your Client\'s account.');
        push @texts, localize('Your Client will receive an email notification informing him/her that the transfer has been processed.');
        push @texts, localize('Please confirm the transaction details in order to complete the transfer:');
        push @texts, localize('Transfer to');
        push @texts, localize('Your request to transfer [_1] [_2] from [_3] to [_4] has been successfully processed.');

        #strings for iphistoryws
        push @texts, localize('Date and Time');
        push @texts, localize('Browser');
        push @texts, localize('IP Address');
        push @texts, localize('Status');
        push @texts, localize('Successful');
        push @texts, localize('Failed');
        push @texts, localize('Your account has no Login/Logout activity.');
        push @texts, localize('Login History');

        #strings for reality_check
        push @texts, localize('Please enter a number greater or equal to [_1].');
        push @texts, localize('Please enter a number between [_1].');
        push @texts, localize('Your trading statistics since [_1].');

        #strings for securityws
        push @texts, localize('Unlock Cashier');
        push @texts, localize('Your cashier is locked as per your request - to unlock it, please enter the password.');
        push @texts, localize('Lock Cashier');
        push @texts, localize('An additional password can be used to restrict access to the cashier.');
        push @texts, localize('Update');
        push @texts, localize('Sorry, you have entered an incorrect cashier password');

        #strings for job details page
        push @texts, localize('Information Technology');
        push @texts, localize('DevOps Manager');
        push @texts, localize('Senior Front-End Developer');
        push @texts, localize('Senior Perl Developer');
        push @texts, localize('Quality Assurance');
        push @texts, localize('Quality Assurance Engineer');
        push @texts, localize('Quantitative Analysis');
        push @texts, localize('Quantitative Developer');
        push @texts, localize('Quantitative Analyst');
        push @texts, localize('Marketing');
        push @texts, localize('Marketing Project Manager');
        push @texts, localize('Social Media Executive');
        push @texts, localize('Country Manager');
        push @texts, localize('Graphic Designers');
        push @texts, localize('Marketing Executives');
        push @texts, localize('Copywriter');
        push @texts, localize('Translator');
        push @texts, localize('Proofreader');
        push @texts, localize('Accounting');
        push @texts, localize('Accounts And Payments Executive');
        push @texts, localize('Compliance');
        push @texts, localize('Compliance Executive');
        push @texts, localize('Anti-Fraud Officer');
        push @texts, localize('Global Customer Service Representatives');
        push @texts, localize('Human Resources');
        push @texts, localize('Human Resource Executive');
        push @texts, localize('Administrator');
        push @texts, localize('Administrative Executive');
        push @texts, localize('Internal Audit');
        push @texts, localize('Internal Auditor');

        #strings for view popup ws
        push @texts, localize('Contract Information');
        push @texts, localize('Contract Expiry');
        push @texts, localize('Contract Sold');
        push @texts, localize('Current');
        push @texts, localize('Open');
        push @texts, localize('Closed');
        push @texts, localize('Entry Level');
        push @texts, localize('Exit Level');
        push @texts, localize('Stop Loss Level');
        push @texts, localize('Stop Profit Level');
        push @texts, localize('Current Level');
        push @texts, localize('Profit/Loss (points)');
        push @texts, localize('not available');
        push @texts, localize('Contract is not started yet');
        push @texts, localize('Price');
        push @texts, localize('Spot Time');
        push @texts, localize('Current Time');
        push @texts, localize('Exit Spot Time');
        push @texts, localize('Exit Spot');
        push @texts, localize('Indicative');
        push @texts, localize('This contract has WON');
        push @texts, localize('This contract has LOST');
        push @texts, localize('Sorry, an error occurred while processing your request.');
        push @texts, localize('There was an error');
        push @texts, localize('Sell at market');
        push @texts, localize('You have sold this contract at [_1] [_2]');
        push @texts, localize('Your transaction reference number is [_1]');
        push @texts, localize('Note');
        push @texts, localize('Contract will be sold at the prevailing market price when the request is received by our servers. This price may differ from the indicated price.');
        push @texts, localize('Contract ID');
        push @texts, localize('Reference ID');
        push @texts, localize('Remaining Time');
        push @texts, localize('This contract was affected by a Corporate Action event.');
        push @texts, localize('Barrier Change');
        push @texts, localize('Original Barrier');
        push @texts, localize('Original High Barrier');
        push @texts, localize('Original Low Barrier');
        push @texts, localize('Adjusted Barrier');
        push @texts, localize('Adjusted High Barrier');
        push @texts, localize('Adjusted Low Barrier');
        push @texts, localize('Corporate Action');

        # strings for financial assessment
        push @texts, localize('Financial Assessment');
        push @texts, localize('Forex trading experience');
        push @texts, localize('Forex trading frequency');
        push @texts, localize('Indices trading experience');
        push @texts, localize('Indices trading frequency');
        push @texts, localize('Commodities trading experience');
        push @texts, localize('Commodities trading frequency');
        push @texts, localize('Stocks trading experience');
        push @texts, localize('Stocks trading frequency');
        push @texts, localize('Binary options or other financial derivatives trading experience');
        push @texts, localize('Binary options or other financial derivatives trading frequency');
        push @texts, localize('Other financial instruments trading experience');
        push @texts, localize('Other financial instruments trading frequency');
        push @texts, localize('Industry of Employment');
        push @texts, localize('Level of Education');
        push @texts, localize('Income Source');
        push @texts, localize('Net Annual Income');
        push @texts, localize('Estimated Net Worth');
        push @texts, localize('0-1 year');
        push @texts, localize('1-2 years');
        push @texts, localize('Over 3 years');
        push @texts, localize('0-5 transactions in the past 12 months');
        push @texts, localize('6-10 transactions in the past 12 months');
        push @texts, localize('40 transactions or more in the past 12 months');
        push @texts, localize('Construction');
        push @texts, localize('Education');
        push @texts, localize('Finance');
        push @texts, localize('Health');
        push @texts, localize('Tourism');
        push @texts, localize('Other');
        push @texts, localize('Primary');
        push @texts, localize('Secondary');
        push @texts, localize('Tertiary');
        push @texts, localize('Salaried Employee');
        push @texts, localize('Self-Employed');
        push @texts, localize('Investments & Dividends');
        push @texts, localize('Pension');
        push @texts, localize('Less than $25,000');
        push @texts, localize('$25,000 - $100,000');
        push @texts, localize('$100,000 - $500,000');
        push @texts, localize('Over $500,001');
        push @texts, localize('Less than $100,000');
        push @texts, localize('$100,000 - $250,000');
        push @texts, localize('$250,000 - $1,000,000');
        push @texts, localize('Over $1,000,000');
        push @texts, localize('The financial trading services contained within this site are only suitable for customers who are able to bear the loss of all the money they invest and who understand and have experience of the risk involved in the acquistion of financial contracts. Transactions in financial contracts carry a high degree of risk. If purchased contracts expire worthless, you will suffer a total loss of your investment, which consists of the contract premium.');
        push @texts, localize('Your details have been updated.');
        push @texts, localize('Please complete the following financial assessment form before continuing.');
        push @texts, localize('Due to recent changes in the regulations, we are required to ask our clients to complete the following Financial Assessment. Please note that you will not be able to continue trading until this is completed.');

        # Strings for authorised_appsws
        push @texts, localize('Applications');
        push @texts, localize('You have not granted access to any applications.');
        push @texts, localize('Permissions');
        push @texts, localize('Last Used');
        push @texts, localize('Never');
        push @texts, localize('Revoke access');
        push @texts, localize('Keep track of your authorised applications.');
        push @texts, localize('Are you sure that you want to permanently revoke access to application');
        push @texts, localize('Transaction performed by');
        push @texts, localize('App ID');

        # Strings for lostpasswordws
        push @texts, localize('Please check your email to retrieve the token needed to reset your password.');
        push @texts, localize('[_1] Please click the link below to restart the password recovery process. If you require further assistance, please contact our Customer Support.');
        push @texts, localize('Details');
        push @texts, localize('Password Reset');
        push @texts, localize('Verification Token');
        push @texts, localize('Please check your email for the value of this token');
        push @texts, localize('New Password');
        push @texts, localize('Confirm New Password');
        push @texts, localize('Date of Birth');
        push @texts, localize('Format: yyyy-mm-dd (not required for virtual-money accounts)');
        push @texts, localize('Reset Password');
        push @texts, localize('Your password has been successfully reset. Please log into your account using your new password.');
        push @texts, localize('Verification code format incorrect.');
        push @texts, localize('Password must contains at least 1 digit, 1 uppercase letter and 1 lowercase letter.');
        push @texts, localize('Password does not match.');
        push @texts, localize('Invalid date of birth.');
        push @texts, localize('Failed to reset password. [_1], please retry.');

        # strings for cashierws page
        push @texts, localize('Your cashier is locked as per your request - to unlock it, please click [_1]here');
        push @texts, localize('For added security, please check your email to retrieve the verification token.');
        push @texts, localize('Please choose which currency you would like to transact in.');
        push @texts, localize('There was a problem validating your personal details. Please fix the fields [_1]here');
        push @texts, localize('If you need assistance feel free to contact our [_1]Customer Support');
        push @texts, localize('Your account is not fully authenticated. Please visit the <a href="[_1]">authentication</a> page for more information.');
        push @texts, localize('details');
        push @texts, localize('Deposit [_1] [_2] virtual money into your account [_3]');

        # strings for user/metatrader page
        push @texts, localize('Login');
        push @texts, localize('To create a real account for MetaTrader, switch to your [_1] real money account.');
        push @texts, localize('To create a real account for MetaTrader, <a href="[_1]">upgrade to [_2] real money account</a>.');
        push @texts, localize('Your new account has been created.');
        push @texts, localize('Deposit is done. Transaction ID:');
        push @texts, localize('Withdrawal is done. Transaction ID:');
        push @texts, localize('Start trading with your Demo Account');
        push @texts, localize('Start trading with your Real Account');
        push @texts, localize('Download MetaTrader');
        push @texts, localize('Congratulations! Your account has been created.');

        my %as_hash = @texts;
        $js .= "texts_json['" . $language . "'] = " . JSON::to_json(\%as_hash) . ";\n";
    }

    return $js;
}

sub _make_nobody_dir {
    my $dir  = shift;
    if (not -d $dir) {
        mkdir $dir;
    }

    my ($login, $pass, $uid, $gid) = getpwnam("nobody");
    chown($uid, $gid, $dir);
    return;
}

sub localize {
    my $text = shift;

    my $translated = BS::localize($text, '[_1]', '[_2]', '[_3]', '[_4]');
    if ($text eq $translated) {    #Not Translated.
        return;
    }
    $text =~ s/[\s.]/_/g;
    return ($text, $translated);
}

1;
