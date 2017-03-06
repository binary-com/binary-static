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
        push @texts, localize('Sorry, an error occurred while processing your request.');
        push @texts, localize('Please <a href="[_1]">log in</a> to view this page.');
        # top bar
        push @texts, localize('Upgrade to a Real Account');
        push @texts, localize('Upgrade to a Financial Account');
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
        push @texts, localize('hours');
        push @texts, localize('min');
        push @texts, localize('minutes');
        push @texts, localize('seconds');
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
        push @texts, localize('Amount per point');
        push @texts, localize('Stop-loss');
        push @texts, localize('Stop-profit');
        push @texts, localize('View');
        push @texts, localize('Statement');
        push @texts, localize('points');
        push @texts, localize('Tick');
        push @texts, localize('Buy price');
        push @texts, localize('Final price');
        push @texts, localize('Long');
        push @texts, localize('Short');
        push @texts, localize('Deposit of');
        push @texts, localize('is required. Current spread');
        push @texts, localize('Chart');
        push @texts, localize('Explanation');
        push @texts, localize('Last Digit Stats');
        push @texts, localize('Waiting for entry tick.');
        push @texts, localize('Waiting for exit tick.');
        push @texts, localize('Please log in.');
        push @texts, localize('All markets are closed now. Please try again later.');
        push @texts, localize('Account balance:');
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
        # back-end strings for limitsws page
        push @texts, localize('Major Pairs');
        push @texts, localize('Forex');
        #strings for detailsws
        push @texts, localize('This field is required.');
        push @texts, localize('Please select the checkbox.');
        push @texts, localize('Please accept the terms and conditions.');
        push @texts, localize('You should enter between [_1] characters.');
        push @texts, localize('Only [_1] are allowed.');
        push @texts, localize('letters');
        push @texts, localize('numbers');
        push @texts, localize('space');
        push @texts, localize('period');
        push @texts, localize('comma');
        push @texts, localize('Sorry, an error occurred while processing your account.');
        push @texts, localize('Your changes have been updated successfully.');
        push @texts, localize('Your settings have been updated successfully.');
        #strings for home and virtualws page
        push @texts, localize('verification token');
        push @texts, localize('Please submit a valid [_1].');
        push @texts, localize('email address');
        push @texts, localize('password');
        push @texts, localize('The two passwords that you entered do not match.');
        push @texts, localize('Your token has expired. Please click <a href="[_1]">here</a> to restart the verification process.');
        push @texts, localize('The email address provided is already in use. If you forgot your password, please try our <a href="[_1]">password recovery tool</a> or contact our customer service.');
        push @texts, localize('Password should have lower and uppercase letters with numbers.');
        push @texts, localize('Password is not strong enough.');
        push @texts, localize('Please [_1] to view this page');
        push @texts, localize('login');
        push @texts, localize('Your session duration limit will end in [_1] seconds.');
        #strings for realws page
        push @texts, localize('hyphen');
        push @texts, localize('apostrophe');
        push @texts, localize('Please input a valid date');
        push @texts, localize('Please select');
        push @texts, localize('Minimum of [_1] characters required.');
        #strings for trading_timesws page
        push @texts, localize('Asset');
        push @texts, localize('Opens');
        push @texts, localize('Closes');
        push @texts, localize('Settles');
        push @texts, localize('Upcoming Events');
        # back-end strings for trading_timesws page
        push @texts, localize('Closes early (at 21:00)');
        push @texts, localize('Closes early (at 18:00)');
        push @texts, localize("New Year's Day");
        push @texts, localize('Christmas Day');
        push @texts, localize('Fridays');
        push @texts, localize('today');
        push @texts, localize('today, Fridays');
        #strings for paymentagent_withdrawws page
        push @texts, localize('Please select a payment agent');
        push @texts, localize('The Payment Agent facility is currently not available in your country.');
        push @texts, localize('Invalid amount, minimum is');
        push @texts, localize('Invalid amount, maximum is');
        push @texts, localize('Your request to withdraw [_1] [_2] from your account [_3] to Payment Agent [_4] account has been successfully processed.');
        push @texts, localize('Only [_1] decimal points are allowed.');
        push @texts, localize('Your token has expired. Please click [_1]here[_2] to restart the verification process.');
        #strings for api_tokenws page
        push @texts, localize('New token created.');
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
        push @texts, localize('years');
        push @texts, localize('months');
        push @texts, localize('weeks');
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
        #strings for authenticate page
        push @texts, localize('Please send us the following documents in order to verify your identity and authenticate your account:');
        push @texts, localize('Proof of identity - A scanned copy of your passport, driving license (either provisional or full), or identity card that shows your full name and date of birth.');
        push @texts, localize('Proof of address - A scanned copy of a utility bill or bank statement that\'s not more than three months old.');
        push @texts, localize('If you have any questions, kindly contact our Customer Support team at <a href="mailto:[_1]">[_1]</a>.');
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
        push @texts, localize('[_1] [_2] payout if [_3] is strictly higher or equal than Exercise price at close  on [_4].');
        push @texts, localize('[_1] [_2] payout if [_3] is strictly lower than Exercise price at close on [_4].');
        push @texts, localize('[_1] [_2] payout if [_3] does not touch Exercise price through close on [_4].');
        push @texts, localize('[_1] [_2] payout if [_3] touches Exercise price through close on [_4].');
        push @texts, localize('[_1] [_2] payout if [_3] ends on or between low and high values of Exercise price at close on [_4].');
        push @texts, localize('[_1] [_2] payout if [_3] ends outside low and high values of Exercise price at close on [_4].');
        push @texts, localize('[_1] [_2] payout if [_3] stays between low and high values of Exercise price through close on [_4].');
        push @texts, localize('[_1] [_2] payout if [_3] goes outside of low and high values of Exercise price through close on [_4].');
        push @texts, localize('hour');
        push @texts, localize('mins');
        push @texts, localize('minute');
        push @texts, localize('second');
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
        push @texts, localize('Connection error: Please check your internet connection.');
        push @texts, localize('Sorry, your account is not authorised for any further contract purchases.');
        #strings for digit_infows
        push @texts, localize('Select market');
        push @texts, localize('Number of ticks');
        push @texts, localize('Last digit stats for the latest [_1] ticks on [_2]');
        #strings for paymentagentws
        push @texts, localize('Amount');
        push @texts, localize('Deposit');
        push @texts, localize('Your request to transfer [_1] [_2] from [_3] to [_4] has been successfully processed.');
        #strings for iphistoryws
        push @texts, localize('Date and Time');
        push @texts, localize('Browser');
        push @texts, localize('IP Address');
        push @texts, localize('Status');
        push @texts, localize('Successful');
        push @texts, localize('Failed');
        push @texts, localize('Your account has no Login/Logout activity.');
        #strings for reality_check
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
        push @texts, localize('You have not granted access to any applications.');
        push @texts, localize('Permissions');
        push @texts, localize('Never');
        push @texts, localize('Revoke access');
        push @texts, localize('Are you sure that you want to permanently revoke access to application');
        push @texts, localize('Transaction performed by [_1] (App ID: [_2])');
        # Strings for lost_passwordws
        push @texts, localize('[_1] Please click the link below to restart the password recovery process. If you require further assistance, please contact our Customer Support.');
        push @texts, localize('Your password has been successfully reset. Please log into your account using your new password.');
        push @texts, localize('Verification code format incorrect.');
        # strings for cashierws page
        push @texts, localize('details');
        push @texts, localize('Withdraw');
        push @texts, localize('Insufficient balance.');
        # strings for endpoint notification
        push @texts, localize('This is a staging server - For testing purposes only');
        push @texts, localize('The server <a href="[_1]">endpoint</a> is: [_2]');
        # strings for account signup error
        push @texts, localize('Sorry, account signup is not available in your country. Please contact <a href="[_1]">customer support</a> for more information.');
        # strings from back-end
        push @texts, localize('There was a problem accessing the server.');
        push @texts, localize('There was a problem accessing the server during purchase.');
        
        # strings for form_validation
        push @texts, localize('Should be a valid number');
        push @texts, localize('Should be more than [_1]');
        push @texts, localize('Should be less than [_1]');
        push @texts, localize('Only letters, numbers, space, hyphen, period, and apostrophe are allowed.');
        push @texts, localize('Only letters, space, hyphen, period, and apostrophe are allowed.');
        push @texts, localize('Only letters, numbers, and hyphen are allowed.');
        push @texts, localize('Only numbers, space, and hyphen are allowed.');
        push @texts, localize('Only numbers and spaces are allowed.');
        push @texts, localize('Please submit a valid verification token.');
        push @texts, localize('The two passwords that you entered do not match.');
        push @texts, localize('[_1] and [_2] cannot be the same.');
        push @texts, localize('You should enter [_1] characters.');

        # strings for metatrader
        push @texts, localize('Congratulations! Your [_1] Account has been created.');
        push @texts, localize('The main password of account number [_1] has been changed.');
        push @texts, localize('[_1] deposit from [_2] to account number [_3] is done. Transaction ID: [_4]');
        push @texts, localize('[_1] withdrawal from account number [_2] to [_3] is done. Transaction ID: [_4]');
        push @texts, localize('Your cashier is locked as per your request - to unlock it, please click <a href="[_1]">here</a>.');
        push @texts, localize('Sorry, this feature is not available.');
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
