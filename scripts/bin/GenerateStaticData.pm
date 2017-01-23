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
    my $exports = <<'END_EXPORTS';

module.exports = {
    texts_json: texts_json,
};
END_EXPORTS

    File::Slurp::write_file("$js_path/texts.js", {binmode => ':utf8'}, _texts() . $exports);
    return;
}

sub _texts {
    my $js = "const texts_json = {};\n";
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
        push @texts, localize('End time must be after start time.');
        push @texts, localize('Time is in the wrong format.');
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
        push @texts, localize('weeks');
        push @texts, localize('week');
        push @texts, localize('day');
        push @texts, localize('hour');
        push @texts, localize('h');
        push @texts, localize('minute');
        push @texts, localize('min');
        push @texts, localize('mins');
        push @texts, localize('second');
        push @texts, localize('Purchase Time');
        push @texts, localize('Start Time');
        push @texts, localize('Entry Spot');
        push @texts, localize('Low Barrier');
        push @texts, localize('Low Barrier ([_1])');
        push @texts, localize('High Barrier');
        push @texts, localize('High Barrier ([_1])');
        push @texts, localize('Barrier ([_1])');
        push @texts, localize('Next');
        push @texts, localize('Previous');
        push @texts, localize('Su');
        push @texts, localize('Mo');
        push @texts, localize('Tu');
        push @texts, localize('We');
        push @texts, localize('Th');
        push @texts, localize('Fr');
        push @texts, localize('Sa');
        push @texts, localize('Hour');
        push @texts, localize('Minute');
        push @texts, localize('AM');
        push @texts, localize('PM');
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
        push @texts, localize('Sorry, an error occurred while processing your request.');

        # text used by websocket trading page javascript
        push @texts, localize('Start time');
        push @texts, localize('Entry spot');
        push @texts, localize('Exit spot');
        push @texts, localize('End time');
        push @texts, localize('Sell time');
        push @texts, localize('Charting for this underlying is delayed');
        push @texts, localize('Spot');
        push @texts, localize('Barrier');
        push @texts, localize('Target');
        push @texts, localize('Equals');
        push @texts, localize('Not');
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
        push @texts, localize('Waiting for exit tick.');
        push @texts, localize('Refresh page');
        push @texts, localize('Please log in.');
        push @texts, localize('All markets are closed now. Please try again later.');

        #strings for limitsws page
        push @texts, localize('Your account is fully authenticated and your withdrawal limits have been lifted.');
        push @texts, localize('Your withdrawal limit is [_1] [_2].');
        push @texts, localize('Your withdrawal limit is [_1] [_2] (or equivalent in other currency).');
        push @texts, localize('You have already withdrawn [_1] [_2].');
        push @texts, localize('You have already withdrawn the equivalent of [_1] [_2].');
        push @texts, localize('Therefore your current immediate maximum withdrawal (subject to your account having sufficient funds) is [_1] [_2].');
        push @texts, localize('Therefore your current immediate maximum withdrawal (subject to your account having sufficient funds) is [_1] [_2] (or equivalent in other currency).');
        push @texts, localize('Your [_1] day withdrawal limit is currently [_2] [_3] (or equivalent in other currency).');
        push @texts, localize('You have already withdrawn the equivalent of [_1] [_2] in aggregate over the last [_3] days.');
        push @texts, localize('Major Pairs');
        push @texts, localize('Forex');

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
        push @texts, localize('Your changes have been updated successfully.');
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
        push @texts, localize('email address');
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
        push @texts, localize('Closes early (at 21:00)');
        push @texts, localize('Closes early (at 18:00)');
        push @texts, localize("New Year's Day");
        push @texts, localize('Christmas Day');
        push @texts, localize('Fridays');

        #strings for paymentagent_withdrawws page
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
        push @texts, localize('Please select at least one scope');

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

        #strings for portfolio
        push @texts, localize('Resale not offered');

        #strings for profittable and statement
        push @texts, localize('Your account has no trading activity.');
        push @texts, localize('Withdrawal');
        push @texts, localize('Today');
        push @texts, localize('today');
        push @texts, localize('today, Fridays');

        #strings for authenticate page
        push @texts, localize('To authenticate your account, kindly email the following to [_1]:');
        push @texts, localize('A scanned copy of your passport, driving licence (provisional or full) or identity card, showing your name and date of birth. Your document must be valid for at least 6 months after this date.');
        push @texts, localize('A scanned copy of a utility bill or bank statement (no more than 3 months old)');
        push @texts, localize('This feature is not relevant to virtual-money accounts.');
        push @texts, localize('Your account is currently suspended. Only withdrawals are now permitted. For further information, please contact [_1].');
        push @texts, localize('Deposits and withdrawal for your account is not allowed at this moment. Please contact [_1] to unlock it.');
        push @texts, localize('Withdrawal for your account is not allowed at this moment. Please contact [_1] to unlock it.');

        #strings for japanws page
        push @texts, localize('Japan');
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
        push @texts, localize('{JAPAN ONLY}[_1] [_2] payout if [_3] ends outside low and high values of Exercise price at close on [_4].');
        push @texts, localize('{JAPAN ONLY}[_1] [_2] payout if [_3] stays between low and high values of Exercise price through close on [_4].');
        push @texts, localize('{JAPAN ONLY}[_1] [_2] payout if [_3] goes outside of low and high values of Exercise price through close on [_4].');
        push @texts, localize('{JAPAN ONLY}This knowledge test is required by law. As we provide the test, we know customers better whether the customers are suitable investors to be carried out the binary options trading, and customers can start trading with us.');
        push @texts, localize('{JAPAN ONLY}To invest a binary options investment accurately, the customer are required knowledge and experience related to derivative transactions.');
        push @texts, localize('{JAPAN ONLY}This test is for the purpose of confirming if the customers have basic knowledge related to options trading .');
        push @texts, localize('{JAPAN ONLY}It is determined the customers have basic knowledge of option trading by the results of the knowledge test. If the customers start trading, the customers need to agree not have lawsuit despite the customer are shortage of knowledge related to options trading, and it cause damages, we admit to open the trading account.');
        push @texts, localize('{JAPAN ONLY}It prohibits the copying of the questions . In addition , You agree that you will not leak to third party');
        push @texts, localize('{JAPAN ONLY}HIGH/LOW');
        push @texts, localize('{JAPAN ONLY}TOUCH /NO-TOUCH');
        push @texts, localize('{JAPAN ONLY}END-IN/END-OUT');
        push @texts, localize('{JAPAN ONLY}STAY-IN/BREAK-OUT');
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
        push @texts, localize('Remaining time');
        push @texts, localize('You need to finish all 20 questions.');
        push @texts, localize('Weekday');
        push @texts, localize('This contract can not be traded in the final 2 minutes before settlement');
        push @texts, localize('All barriers in this trading window are expired');
        push @texts, localize('{JAPAN ONLY}¥');
        push @texts, localize('{JAPAN ONLY},000');
        push @texts, localize('min: 1,000');
        push @texts, localize('max: 100,000');
        push @texts, localize('Your Application is Being Processed.');
        push @texts, localize('{JAPAN ONLY}Your Application has Been Processed. Please Re-Login to Access Your Real-Money Account.');
        push @texts, localize('Processing your request...');
        push @texts, localize('Please check the above form for pending errors.');
        push @texts, localize('Market is closed. Please try again later.');
        push @texts, localize('This symbol is not active. Please try another symbol.');
        push @texts, localize('Connection error: Please check your internet connection.');
        push @texts, localize('Sorry, your account is not authorised for any further contract purchases.');

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
        push @texts, localize('Please select a value');

        # Strings for authorised_appsws
        push @texts, localize('Applications');
        push @texts, localize('You have not granted access to any applications.');
        push @texts, localize('Permissions');
        push @texts, localize('Last Used');
        push @texts, localize('Never');
        push @texts, localize('Revoke access');
        push @texts, localize('Keep track of your authorised applications.');
        push @texts, localize('Are you sure that you want to permanently revoke access to application');
        push @texts, localize('Transaction performed by [_1] (App ID: [_2])');

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
        push @texts, localize('Your account is not fully authenticated.');
        push @texts, localize('details');
        push @texts, localize('Deposit [_1] [_2] virtual money into your account [_3]');
        push @texts, localize('Withdraw');
        push @texts, localize('Insufficient balance.');

        # strings for endpoint notification
        push @texts, localize('This is a staging server - For testing purposes only');
        push @texts, localize('The server <a href="[_1]">endpoint</a> is: [_2]');

        # strings for account signup error
        push @texts, localize('Sorry, account signup is not available in your country. Please contact <a href="[_1]">customer support</a> for more information.');

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
