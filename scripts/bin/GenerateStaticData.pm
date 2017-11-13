package GenerateStaticData;

use strict;
use warnings;
use v5.10;

use JSON qw(to_json);
use File::Slurp;
use YAML::XS qw(LoadFile);
# our module in lib
use BS;
use Term::ANSIColor;

sub generate_data_files {
    my $js_path = shift;

    _make_nobody_dir($js_path);

    print colored(['cyan'], "\tGenerating files:\n");
    foreach my $language ((BS::all_languages(), 'ACH')) {
        my $file = "$js_path/${\lc $language}.js";
        printf "\t\t%-40s %5s", $file, "  .....  ";
        File::Slurp::write_file($file, { binmode => ':utf8' }, _texts($language));
        printf colored(['green'], "Done.\n");
    }
    return;
}

sub _texts {
    my $language = shift;
    my $js = "const texts_json = {};\n";
        BS::set_lang($language);

        my @texts;
        push @texts, localize('Day');
        push @texts, localize('Month');
        push @texts, localize('Year');
        push @texts, localize('Sorry, an error occurred while processing your request.');
        push @texts, localize('Please <a href="[_1]">log in</a> to view this page.');
        # top bar
        push @texts, localize('Open a Real Account');
        push @texts, localize('Open a Financial Account');
        # menu items
        push @texts, localize('Trade');
        push @texts, localize('Portfolio');
        push @texts, localize('Profit Table');
        push @texts, localize('Statement');
        push @texts, localize('Cashier');
        push @texts, localize('Resources');
        push @texts, localize('Asset Index');
        push @texts, localize('Trading Times');
        push @texts, localize('Shop');
        push @texts, localize('Payment Agent');
        # account drop down
        push @texts, localize('Virtual Account');
        push @texts, localize('Real Account');
        push @texts, localize('Investment Account');
        push @texts, localize('Gaming Account');
        # datepicker texts
        push @texts, localize('Sunday');
        push @texts, localize('Monday');
        push @texts, localize('Tuesday');
        push @texts, localize('Wednesday');
        push @texts, localize('Thursday');
        push @texts, localize('Friday');
        push @texts, localize('Saturday');
        push @texts, localize('Su');
        push @texts, localize('Mo');
        push @texts, localize('Tu');
        push @texts, localize('We');
        push @texts, localize('Th');
        push @texts, localize('Fr');
        push @texts, localize('Sa');
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
        push @texts, localize('Next');
        push @texts, localize('Previous');
        # timepicker texts
        push @texts, localize('Hour');
        push @texts, localize('Minute');
        push @texts, localize('AM');
        push @texts, localize('PM');
        push @texts, localize('End time must be after start time.');
        push @texts, localize('Time is in the wrong format.');
        # highchart localization text
        push @texts, localize('Start time');
        push @texts, localize('Entry spot');
        push @texts, localize('Purchase Time');
        push @texts, localize('Exit spot');
        push @texts, localize('End time');
        push @texts, localize('Sell time');
        push @texts, localize('Charting for this underlying is delayed');
        # text used by websocket trading page javascript
        push @texts, localize('year');
        push @texts, localize('month');
        push @texts, localize('week');
        push @texts, localize('day');
        push @texts, localize('days');
        push @texts, localize('h');
        push @texts, localize('hour');
        push @texts, localize('hours');
        push @texts, localize('min');
        push @texts, localize('minute');
        push @texts, localize('minutes');
        push @texts, localize('second');
        push @texts, localize('seconds');
        push @texts, localize('tick');
        push @texts, localize('ticks');
        push @texts, localize('Loss');
        push @texts, localize('Profit');
        push @texts, localize('Payout');
        push @texts, localize('Stake');
        push @texts, localize('Duration');
        push @texts, localize('End Time');
        push @texts, localize('Net profit');
        push @texts, localize('Return');
        push @texts, localize('Now');
        push @texts, localize('Contract Confirmation');
        push @texts, localize('Your transaction reference is');
        push @texts, localize('Rise/Fall');
        push @texts, localize('Higher/Lower');
        push @texts, localize('In/Out');
        push @texts, localize('Matches/Differs');
        push @texts, localize('Even/Odd');
        push @texts, localize('Over/Under');
        push @texts, localize('Up/Down');
        push @texts, localize('Ends In/Out');
        push @texts, localize('Touch/No Touch');
        push @texts, localize('Stays In/Goes Out');
        push @texts, localize('Potential Payout');
        push @texts, localize('Total Cost');
        push @texts, localize('Potential Profit');
        push @texts, localize('View');
        push @texts, localize('Statement');
        push @texts, localize('Tick');
        push @texts, localize('Buy price');
        push @texts, localize('Final price');
        push @texts, localize('Long');
        push @texts, localize('Short');
        push @texts, localize('Chart');
        push @texts, localize('Explanation');
        push @texts, localize('Last Digit Stats');
        push @texts, localize('Waiting for entry tick.');
        push @texts, localize('Waiting for exit tick.');
        push @texts, localize('Please log in.');
        push @texts, localize('All markets are closed now. Please try again later.');
        push @texts, localize('Account balance:');
        push @texts, localize('Try our [_1]Volatility Indices[_2].');
        push @texts, localize('Try our other markets.');
        push @texts, localize('Session');
        push @texts, localize('Cryptocurrency');
        push @texts, localize('Fiat Currency');
        #strings for limits page
        push @texts, localize('Your account is fully authenticated and your withdrawal limits have been lifted.');
        push @texts, localize('Your withdrawal limit is [_1] [_2].');
        push @texts, localize('Your withdrawal limit is [_1] [_2] (or equivalent in other currency).');
        push @texts, localize('You have already withdrawn [_1] [_2].');
        push @texts, localize('You have already withdrawn the equivalent of [_1] [_2].');
        push @texts, localize('Therefore your current immediate maximum withdrawal (subject to your account having sufficient funds) is [_1] [_2].');
        push @texts, localize('Therefore your current immediate maximum withdrawal (subject to your account having sufficient funds) is [_1] [_2] (or equivalent in other currency).');
        push @texts, localize('Your [_1] day withdrawal limit is currently [_2] [_3] (or equivalent in other currency).');
        push @texts, localize('You have already withdrawn the equivalent of [_1] [_2] in aggregate over the last [_3] days.');
        push @texts, localize('Contracts where the barrier is the same as entry spot.');
        push @texts, localize('Contracts where the barrier is different from the entry spot.');
        push @texts, localize('ATM');
        push @texts, localize('Non-ATM');
        push @texts, localize('Duration up to 7 days');
        push @texts, localize('Duration above 7 days');
        # back-end strings for limits page
        push @texts, localize('Major Pairs');
        push @texts, localize('Forex');
        #strings for personal details
        push @texts, localize('This field is required.');
        push @texts, localize('Please select the checkbox.');
        push @texts, localize('Please accept the terms and conditions.');
        push @texts, localize('Only [_1] are allowed.');
        push @texts, localize('letters');
        push @texts, localize('numbers');
        push @texts, localize('space');
        push @texts, localize('Sorry, an error occurred while processing your account.');
        push @texts, localize('Your changes have been updated successfully.');
        push @texts, localize('Your settings have been updated successfully.');
        push @texts, localize('Female');
        push @texts, localize('Male');
        #strings for home and virtual account opening page
        push @texts, localize('verification token');
        push @texts, localize('email address');
        push @texts, localize('Your token has expired or is invalid. Please click <a href="[_1]">here</a> to restart the verification process.');
        push @texts, localize('The email address provided is already in use. If you forgot your password, please try our <a href="[_1]">password recovery tool</a> or contact our customer service.');
        push @texts, localize('Password should have lower and uppercase letters with numbers.');
        push @texts, localize('Password is not strong enough.');
        push @texts, localize('Your session duration limit will end in [_1] seconds.');
        push @texts, localize('Invalid email address');
        push @texts, localize('Thank you for signing up! Please check your email to complete the registration process.');
        #strings for real account opening page
        push @texts, localize('ICO Account Opening');
        push @texts, localize('Please input a valid date');
        push @texts, localize('Please select');
        push @texts, localize('Minimum of [_1] characters required.');
        push @texts, localize('Please confirm that you are not a politically exposed person.');
        #strings for trading times page
        push @texts, localize('Asset');
        push @texts, localize('Opens');
        push @texts, localize('Closes');
        push @texts, localize('Settles');
        push @texts, localize('Upcoming Events');
        # back-end strings for trading times page
        push @texts, localize('Closes early (at 21:00)');
        push @texts, localize('Closes early (at 18:00)');
        push @texts, localize("New Year's Day");
        push @texts, localize('Christmas Day');
        push @texts, localize('Fridays');
        push @texts, localize('today');
        push @texts, localize('today, Fridays');
        #strings for paymentagent_withdraw page
        push @texts, localize('Please select a payment agent');
        push @texts, localize('The Payment Agent facility is currently not available in your country.');
        push @texts, localize('Invalid amount, minimum is');
        push @texts, localize('Invalid amount, maximum is');
        push @texts, localize('Your request to withdraw [_1] [_2] from your account [_3] to Payment Agent [_4] account has been successfully processed.');
        push @texts, localize('Only [_1] decimal points are allowed.');
        push @texts, localize('Your token has expired or is invalid. Please click [_1]here[_2] to restart the verification process.');
        #strings for api_token page
        push @texts, localize('New token created.');
        push @texts, localize('The maximum number of tokens ([_1]) has been reached.');
        push @texts, localize('Name');
        push @texts, localize('Token');
        push @texts, localize('Last Used');
        push @texts, localize('Scopes');
        push @texts, localize('Never Used');
        push @texts, localize('Delete');
        push @texts, localize('Are you sure that you want to permanently delete token');
        push @texts, localize('Please select at least one scope');
        #strings for Guide
        push @texts, localize('Guide');
        push @texts, localize('Finish');
        push @texts, localize('Step');
        #strings for Guide -> trading page
        push @texts, localize('Select your market');
        push @texts, localize('Select your underlying asset');
        push @texts, localize('Select your trade type');
        push @texts, localize('Adjust trade parameters');
        push @texts, localize('Predict the direction<br />and purchase');
        #strings for top_up_virtual
        push @texts, localize('Sorry, this feature is available to virtual accounts only.');
        push @texts, localize('[_1] [_2] has been credited to your Virtual money account [_3]');
        #strings for self_exclusion
        push @texts, localize('years');
        push @texts, localize('months');
        push @texts, localize('weeks');
        push @texts, localize('Your changes have been updated.');
        push @texts, localize('Please enter an integer value');
        push @texts, localize('Session duration limit cannot be more than 6 weeks.');
        push @texts, localize('You did not change anything.');
        push @texts, localize('Please select a valid date.');
        push @texts, localize('Please select a valid time.');
        push @texts, localize('Time out cannot be in the past.');
        push @texts, localize('Time out must be after today.');
        push @texts, localize('Time out cannot be more than 6 weeks.');
        push @texts, localize('Exclude time cannot be less than 6 months.');
        push @texts, localize('Exclude time cannot be for more than 5 years.');
        push @texts, localize('When you click "OK" you will be excluded from trading on the site until the selected date.');
        #strings for change_password
        push @texts, localize('Old password is wrong.');
        #strings for portfolio
        push @texts, localize('Ref.');
        push @texts, localize('Resale not offered');
        #strings for profit table and statement pages
        push @texts, localize('Date');
        push @texts, localize('Action');
        push @texts, localize('Contract');
        push @texts, localize('Sale Date');
        push @texts, localize('Sale Price');
        push @texts, localize('Total Profit/Loss');
        push @texts, localize('Your account has no trading activity.');
        push @texts, localize('Today');
        push @texts, localize('Details');
        # back-end string for statement page
        push @texts, localize('Sell');
        push @texts, localize('Buy');
        push @texts, localize('Virtual money credit to account');
        #strings for authenticate page
        push @texts, localize('This feature is not relevant to virtual-money accounts.');
        #strings for japan account opening page
        push @texts, localize('Japan');
        push @texts, localize('Questions');
        push @texts, localize('True');
        push @texts, localize('False');
        push @texts, localize('There was some invalid character in an input field.');
        push @texts, localize('Please follow the pattern 3 numbers, a dash, followed by 4 numbers.');
        push @texts, localize('Score');
        push @texts, localize('{JAPAN ONLY}Take knowledge test');
        push @texts, localize('{JAPAN ONLY}Knowledge Test Result');
        push @texts, localize('{JAPAN ONLY}Knowledge Test');
        push @texts, localize('{JAPAN ONLY}Congratulations, you have pass the test, our Customer Support will contact you shortly.');
        push @texts, localize('{JAPAN ONLY}Sorry, you have failed the test, please try again after 24 hours.');
        push @texts, localize('{JAPAN ONLY}Dear customer, you are not allowed to take knowledge test until [_1]. Last test taken at [_2].');
        push @texts, localize("{JAPAN ONLY}Dear customer, you've already completed the knowledge test, please proceed to next step.");
        push @texts, localize('{JAPAN ONLY}Please complete the following questions.');
        push @texts, localize('{JAPAN ONLY}The test is unavailable now, test can only be taken again on next business day with respect of most recent test.');
        push @texts, localize('You need to finish all 20 questions.');
        push @texts, localize('Weekday');
        push @texts, localize('Your Application is Being Processed.');
        push @texts, localize('{JAPAN ONLY}Your Application has Been Processed. Please Re-Login to Access Your Real-Money Account.');
        push @texts, localize('Processing your request...');
        push @texts, localize('Please check the above form for pending errors.');
        #strings for multi_barriers_trading page
        push @texts, localize('[_1] [_2] payout if [_3] is strictly higher than or equal to Barrier at close on [_4].');
        push @texts, localize('[_1] [_2] payout if [_3] is strictly lower than Barrier at close on [_4].');
        push @texts, localize('[_1] [_2] payout if [_3] does not touch Barrier through close on [_4].');
        push @texts, localize('[_1] [_2] payout if [_3] touches Barrier through close on [_4].');
        push @texts, localize('[_1] [_2] payout if [_3] ends on or between low and high values of Barrier at close on [_4].');
        push @texts, localize('[_1] [_2] payout if [_3] ends outside low and high values of Barrier at close on [_4].');
        push @texts, localize('[_1] [_2] payout if [_3] stays between low and high values of Barrier through close on [_4].');
        push @texts, localize('[_1] [_2] payout if [_3] goes outside of low and high values of Barrier through close on [_4].');
        push @texts, localize('M');
        push @texts, localize('D');
        push @texts, localize('Higher');
        push @texts, localize('Lower');
        push @texts, localize('Touches');
        push @texts, localize('Does Not Touch');
        push @texts, localize('Ends Between');
        push @texts, localize('Ends Outside');
        push @texts, localize('Stays Between');
        push @texts, localize('Goes Outside');
        push @texts, localize('All barriers in this trading window are expired');
        push @texts, localize('Remaining time');
        push @texts, localize('Market is closed. Please try again later.');
        push @texts, localize('This symbol is not active. Please try another symbol.');
        push @texts, localize('Sorry, your account is not authorised for any further contract purchases.');
        push @texts, localize('Lots');
        push @texts, localize('Payout per lot = 1,000');
        #strings for digit_info
        push @texts, localize('Select market');
        push @texts, localize('Number of ticks');
        push @texts, localize('Percentage');
        push @texts, localize('Digit');
        #strings for paymentagent
        push @texts, localize('Amount');
        push @texts, localize('Deposit');
        push @texts, localize('Withdrawal');
        push @texts, localize('Your request to transfer [_1] [_2] from [_3] to [_4] has been successfully processed.');
        #strings for iphistory
        push @texts, localize('Date and Time');
        push @texts, localize('Browser');
        push @texts, localize('IP Address');
        push @texts, localize('Status');
        push @texts, localize('Successful');
        push @texts, localize('Failed');
        push @texts, localize('Your account has no Login/Logout activity.');
        push @texts, localize('logout');
        #strings for reality_check
        push @texts, localize('Please enter a number between [_1].');
        push @texts, localize('[_1] days [_2] hours [_3] minutes');
        push @texts, localize('Your trading statistics since [_1].');
        #strings for security
        push @texts, localize('Unlock Cashier');
        push @texts, localize('Your cashier is locked as per your request - to unlock it, please enter the password.');
        push @texts, localize('Lock Cashier');
        push @texts, localize('An additional password can be used to restrict access to the cashier.');
        push @texts, localize('Update');
        push @texts, localize('Sorry, you have entered an incorrect cashier password');
        #strings for view popup
        push @texts, localize('Start Time');
        push @texts, localize('Entry Spot');
        push @texts, localize('Low Barrier');
        push @texts, localize('Low Barrier ([_1])');
        push @texts, localize('High Barrier');
        push @texts, localize('High Barrier ([_1])');
        push @texts, localize('Barrier ([_1])');
        push @texts, localize('This contract won');
        push @texts, localize('This contract lost');
        push @texts, localize('Spot');
        push @texts, localize('Barrier');
        push @texts, localize('Target');
        push @texts, localize('Equals');
        push @texts, localize('Not');
        push @texts, localize('Description');
        push @texts, localize('Credit/Debit');
        push @texts, localize('Balance');
        push @texts, localize('Purchase Price');
        push @texts, localize('Profit/Loss');
        push @texts, localize('Contract Information');
        push @texts, localize('Contract Expiry');
        push @texts, localize('Contract Sold');
        push @texts, localize('Current');
        push @texts, localize('Open');
        push @texts, localize('Closed');
        push @texts, localize('Contract has not started yet');
        push @texts, localize('Price');
        push @texts, localize('Spot Time');
        push @texts, localize('Current Time');
        push @texts, localize('Exit Spot Time');
        push @texts, localize('Exit Spot');
        push @texts, localize('Indicative');
        push @texts, localize('There was an error');
        push @texts, localize('Sell at market');
        push @texts, localize('You have sold this contract at [_1] [_2]');
        push @texts, localize('Your transaction reference number is [_1]');
        push @texts, localize('Note');
        push @texts, localize('Contract will be sold at the prevailing market price when the request is received by our servers. This price may differ from the indicated price.');
        push @texts, localize('Contract ID');
        push @texts, localize('Reference ID');
        push @texts, localize('Remaining Time');
        push @texts, localize('Barrier Change');
        push @texts, localize('Audit');
        push @texts, localize('Audit Page');
        push @texts, localize('View Chart');
        push @texts, localize('Contract Starts');
        push @texts, localize('Contract Ends');
        push @texts, localize('Start Time and Entry Spot');
        push @texts, localize('Exit Time and Exit Spot');
        # strings for financial assessment
        push @texts, localize('Please select a value');
        # Strings for authorised_apps
        push @texts, localize('You have not granted access to any applications.');
        push @texts, localize('Permissions');
        push @texts, localize('Never');
        push @texts, localize('Revoke access');
        push @texts, localize('Are you sure that you want to permanently revoke access to application');
        push @texts, localize('Transaction performed by [_1] (App ID: [_2])');
        push @texts, localize('Admin');
        push @texts, localize('Read');
        push @texts, localize('Payments');
        # Strings for lost_password
        push @texts, localize('[_1] Please click the link below to restart the password recovery process.');
        push @texts, localize('Your password has been successfully reset. Please log into your account using your new password.');
        push @texts, localize('Please check your email for the password reset link.');
        # strings for cashier page
        push @texts, localize('details');
        push @texts, localize('Withdraw');
        push @texts, localize('Insufficient balance.');
        # strings for endpoint notification
        push @texts, localize('This is a staging server - For testing purposes only');
        push @texts, localize('The server <a href="[_1]">endpoint</a> is: [_2]');
        # strings for account signup error
        push @texts, localize('Sorry, account signup is not available in your country.');
        # strings from back-end
        push @texts, localize('There was a problem accessing the server.');
        push @texts, localize('There was a problem accessing the server during purchase.');

        # strings for form_validation
        push @texts, localize('Should be a valid number');
        push @texts, localize('Should be more than [_1]');
        push @texts, localize('Should be less than [_1]');
        push @texts, localize('Should be between [_1] and [_2]');
        push @texts, localize('Only letters, numbers, space, hyphen, period, and apostrophe are allowed.');
        push @texts, localize('Only letters, space, hyphen, period, and apostrophe are allowed.');
        push @texts, localize('Only letters, numbers, and hyphen are allowed.');
        push @texts, localize('Only numbers, space, and hyphen are allowed.');
        push @texts, localize('Only numbers and spaces are allowed.');
        push @texts, localize('Only letters, numbers, space, and these special characters are allowed: - . \' # ; : ( ) , @ /');
        push @texts, localize('The two passwords that you entered do not match.');
        push @texts, localize('[_1] and [_2] cannot be the same.');
        push @texts, localize('You should enter [_1] characters.');
        push @texts, localize('Indicates required field');
        push @texts, localize('Verification code is wrong. Please use the link sent to your email.');
        push @texts, localize('The password you entered is one of the world\'s most commonly used passwords. You should not be using this password.');
        push @texts, localize('Hint: it would take approximately [_1][_2] to crack this password.');
        push @texts, localize('thousand');
        push @texts, localize('million');
        push @texts, localize('Should start with letter or number, and may contain hyphen and underscore.');

        # strings for metatrader
        push @texts, localize('Congratulations! Your [_1] Account has been created.');
        push @texts, localize('The main password of account number [_1] has been changed.');
        push @texts, localize('[_1] deposit from [_2] to account number [_3] is done. Transaction ID: [_4]');
        push @texts, localize('[_1] withdrawal from account number [_2] to [_3] is done. Transaction ID: [_4]');
        push @texts, localize('Your cashier is locked as per your request - to unlock it, please click <a href="[_1]">here</a>.');
        push @texts, localize('Sorry, this feature is not available in your jurisdiction.');
        push @texts, localize('Main password');
        push @texts, localize('Investor password');
        push @texts, localize('Current password');
        push @texts, localize('New password');
        push @texts, localize('Demo');
        push @texts, localize('Real Cent');
        push @texts, localize('Real Standard');
        push @texts, localize('Real STP');
        push @texts, localize('Real Volatility');
        push @texts, localize('Create Account');
        push @texts, localize('Change Password');

        # strings for account_transfer
        push @texts, localize('Min');
        push @texts, localize('Max');
        push @texts, localize('Current balance');
        push @texts, localize('Withdrawal limit');

        # strings for header notification
        push @texts, localize('[_1]Authenticate your account[_2] now to take full advantage of all payment methods available.');
        push @texts, localize('Please set the [_1]currency[_2] of your account.');
        push @texts, localize('Please set your 30-day turnover limit in our [_1]self-exclusion facilities[_2] to remove deposit limits.');
        push @texts, localize('Please set [_1]country of residence[_2] before upgrading to a real-money account.');
        push @texts, localize('Please complete the [_1]financial assessment form[_2] to lift your withdrawal and trading limits.');
        push @texts, localize('Please [_1]complete your account profile[_2] to lift your withdrawal and trading limits.');
        push @texts, localize('Please [_1]accept the updated Terms and Conditions[_2] to lift your withdrawal and trading limits.');
        push @texts, localize('Your account is restricted. Kindly [_1]contact customer support[_2] for assistance.');
        push @texts, localize('Connection error: Please check your internet connection.');
        push @texts, localize('You have reached the rate limit of requests per second. Please try later.');
        push @texts, localize('[_1] requires your browser\'s web storage to be enabled in order to function properly. Please enable it or exit private browsing mode.');
        push @texts, localize('We are reviewing your documents. For more details [_1]contact us[_2].');
        # browser-update message
        push @texts, localize('Your web browser ([_1]) is out of date and may affect your trading experience. Proceed at your own risk. [_2]Update browser[_3]');

        # binaryico message
        push @texts, localize('Bid');
        push @texts, localize('Closed Bid');
        push @texts, localize('Cancel Bid');
        push @texts, localize('Refund Bid');
        push @texts, localize('Claim Tokens');
        push @texts, localize('Ended');
        push @texts, localize('The ICO is currently unavailable.');
        push @texts, localize('Please select a value for account_opening_reason.');
        push @texts, localize('Minimum bid');

        # binaryico histogram chart
        push @texts, localize('Final Price');
        push @texts, localize('Total Bids');
        push @texts, localize('Price Band');

        # strings for accounts page
        push @texts, localize('Create');
        push @texts, localize('Commodities');
        push @texts, localize('Indices');
        push @texts, localize('Stocks');
        push @texts, localize('Volatility Indices');
        push @texts, localize('Set Currency');
        push @texts, localize('Please choose a currency');
        push @texts, localize('Create Account');
        push @texts, localize('Accounts List');
        push @texts, localize('[_1] Account');
        push @texts, localize('None');
        push @texts, localize('Investment');
        push @texts, localize('Gaming');
        push @texts, localize('Virtual');
        push @texts, localize('Real');
        push @texts, localize('Counterparty');

        # currency names
        push @texts, localize('Bitcoin');
        push @texts, localize('Bitcoin Cash');
        push @texts, localize('Ether');
        push @texts, localize('Ether Classic');
        push @texts, localize('Litecoin');

        # Authentication errors
        push @texts, localize('Invalid document format: "[_1]"');
        push @texts, localize('File ([_1]) size exceeds the permitted limit. Maximum allowed file size: 3MB');
        push @texts, localize('ID number is required for [_1].');
        push @texts, localize('Only letters, numbers, space, underscore, and hyphen are allowed for ID number.');
        push @texts, localize('Expiry date is required for [_1].');
        push @texts, localize('Passport');
        push @texts, localize('ID card');
        push @texts, localize('Driving licence');
        push @texts, localize('Front Side');
        push @texts, localize('Reverse Side');
        push @texts, localize('Front and reverse side photos of [_1] are required.');
        push @texts, localize('[_1]Your Proof of Identity or Proof of Address[_2] did not meet our requirements. Please check your email for further instructions.');

        my %as_hash = @texts;
        $js .= "texts_json['" . $language . "'] = " . JSON::to_json(\%as_hash) . ";\n";

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
