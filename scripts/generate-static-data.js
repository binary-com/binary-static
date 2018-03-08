const color   = require('cli-color');
const fs      = require('fs');
const path    = require('path');
const common  = require('./common');
const GetText = require('./gettext');

const texts = [
    'Day',
    'Month',
    'Year',
    'Sorry, an error occurred while processing your request.',
    'Please [_1]log in[_2] or [_3]sign up[_2] to view this page.',

    // top bar
    'Open a Real Account',
    'Open a Financial Account',
    'Network status',
    'Online',
    'Offline',
    'Connecting to server',

    // account drop down
    'Virtual Account',
    'Real Account',
    'Investment Account',
    'Gaming Account',

    // datepicker texts
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Su',
    'Mo',
    'Tu',
    'We',
    'Th',
    'Fr',
    'Sa',
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
    'Next',
    'Previous',

    // timepicker texts
    'Hour',
    'Minute',
    'AM',
    'PM',
    'Time is in the wrong format.',

    // highchart localization text
    'Start time',
    'Entry spot',
    'Purchase Time',
    'Exit spot',
    'End time',
    'Sell time',
    'Charting for this underlying is delayed',

    // trading page
    'year',
    'month',
    'week',
    'day',
    'days',
    'h',
    'hour',
    'hours',
    'min',
    'minute',
    'minutes',
    'second',
    'seconds',
    'tick',
    'ticks',
    'Loss',
    'Profit',
    'Payout',
    'Units',
    'Stake',
    'Duration',
    'End Time',
    'Net profit',
    'Return',
    'Now',
    'Contract Confirmation',
    'Your transaction reference is',
    'Rise/Fall',
    'Higher/Lower',
    'In/Out',
    'Matches/Differs',
    'Even/Odd',
    'Over/Under',
    'Up/Down',
    'Ends Between/Ends Outside',
    'Touch/No Touch',
    'Stays Between/Goes Outside',
    'Potential Payout',
    'Total Cost',
    'Potential Profit',
    'View',
    'Tick',
    'Buy price',
    'Final price',
    'Long',
    'Short',
    'Chart',
    'Portfolio',
    'Explanation',
    'Last Digit Stats',
    'Waiting for entry tick.',
    'Waiting for exit tick.',
    'Please log in.',
    'All markets are closed now. Please try again later.',
    'Account balance:',
    'Try our [_1]Volatility Indices[_2].',
    'Try our other markets.',
    'Session',
    'Cryptocurrency',
    'Fiat Currency',
    'High',
    'Low',
    'Close',
    'Payoff',
    'High-Close',
    'Close-Low',
    'High-Low',

    // limits
    'Your account is fully authenticated and your withdrawal limits have been lifted.',
    'Your withdrawal limit is [_1] [_2].',
    'Your withdrawal limit is [_1] [_2] (or equivalent in other currency).',
    'You have already withdrawn [_1] [_2].',
    'You have already withdrawn the equivalent of [_1] [_2].',
    'Therefore your current immediate maximum withdrawal (subject to your account having sufficient funds) is [_1] [_2].',
    'Therefore your current immediate maximum withdrawal (subject to your account having sufficient funds) is [_1] [_2] (or equivalent in other currency).',
    'Your [_1] day withdrawal limit is currently [_2] [_3] (or equivalent in other currency).',
    'You have already withdrawn the equivalent of [_1] [_2] in aggregate over the last [_3] days.',
    'Contracts where the barrier is the same as entry spot.',
    'Contracts where the barrier is different from the entry spot.',
    'ATM',
    'Non-ATM',
    'Duration up to 7 days',
    'Duration above 7 days',

    // back-end strings for limits page
    'Major Pairs',
    'Forex',

    // personal details
    'This field is required.',
    'Please select the checkbox.',
    'Please accept the terms and conditions.',
    'Only [_1] are allowed.',
    'letters',
    'numbers',
    'space',
    'Sorry, an error occurred while processing your account.',
    'Your changes have been updated successfully.',
    'Your settings have been updated successfully.',
    'Female',
    'Male',
    'Please select a country',
    'Please confirm that all the information above is true and complete.',

    // home and virtual account opening page
    'verification token',
    'email address',
    'Your token has expired or is invalid. Please click <a href="[_1]">here</a> to restart the verification process.',
    'The email address provided is already in use. If you forgot your password, please try our <a href="[_1]">password recovery tool</a> or contact our customer service.',
    'Password should have lower and uppercase letters with numbers.',
    'Password is not strong enough.',
    'Your session duration limit will end in [_1] seconds.',
    'Invalid email address.',
    'Thank you for signing up! Please check your email to complete the registration process.',

    // real account opening
    'Please select',
    'Minimum of [_1] characters required.',
    'Please confirm that you are not a politically exposed person.',

    // trading times
    'Asset',
    'Opens',
    'Closes',
    'Settles',
    'Upcoming Events',

    // back-end strings for trading times page
    'Closes early (at 21:00)',
    'Closes early (at 18:00)',
    'New Year\'s Day',
    'Christmas Day',
    'Fridays',
    'today',
    'today, Fridays',

    // paymentagent_withdraw
    'Please select a payment agent',
    'The Payment Agent facility is currently not available in your country.',
    'Invalid amount, minimum is',
    'Invalid amount, maximum is',
    'Your request to withdraw [_1] [_2] from your account [_3] to Payment Agent [_4] account has been successfully processed.',
    'Up to [_1] decimal places are allowed.',
    'Your token has expired or is invalid. Please click [_1]here[_2] to restart the verification process.',

    // api_token
    'New token created.',
    'The maximum number of tokens ([_1]) has been reached.',
    'Name',
    'Token',
    'Last Used',
    'Scopes',
    'Never Used',
    'Delete',
    'Are you sure that you want to permanently delete the token',
    'Please select at least one scope',

    // Guide
    'Guide',
    'Finish',
    'Step',

    // Guide -> trading page
    'Select your market',
    'Select your underlying asset',
    'Select your trade type',
    'Adjust trade parameters',
    'Predict the direction<br />and purchase',

    // top_up_virtual
    'Sorry, this feature is available to virtual accounts only.',
    '[_1] [_2] has been credited to your Virtual money account [_3]',

    // self_exclusion
    'years',
    'months',
    'weeks',
    'Your changes have been updated.',
    'Please enter an integer value',
    'Session duration limit cannot be more than 6 weeks.',
    'You did not change anything.',
    'Please select a valid date.',
    'Please select a valid time.',
    'Time out cannot be in the past.',
    'Time out must be after today.',
    'Time out cannot be more than 6 weeks.',
    'Exclude time cannot be less than 6 months.',
    'Exclude time cannot be for more than 5 years.',
    'When you click "OK" you will be excluded from trading on the site until the selected date.',

    // change_password
    'Old password is wrong.',

    // portfolio
    'Ref.',
    'Resale not offered',

    // profit table and statement
    'Date',
    'Action',
    'Contract',
    'Sale Date',
    'Sale Price',
    'Total Profit/Loss',
    'Your account has no trading activity.',
    'Today',
    'Details',

    // back-end string for statement page
    'Sell',
    'Buy',
    'Virtual money credit to account',

    // authenticate
    'This feature is not relevant to virtual-money accounts.',

    // japan account opening
    'Japan',
    'Questions',
    'True',
    'False',
    'There was some invalid character in an input field.',
    'Please follow the pattern 3 numbers, a dash, followed by 4 numbers.',
    'Score',
    '{JAPAN ONLY}Take knowledge test',
    '{JAPAN ONLY}Knowledge Test Result',
    '{JAPAN ONLY}Knowledge Test',
    '{JAPAN ONLY}Congratulations, you have pass the test, our Customer Support will contact you shortly.',
    '{JAPAN ONLY}Sorry, you have failed the test, please try again after 24 hours.',
    '{JAPAN ONLY}Dear customer, you are not allowed to take knowledge test until [_1]. Last test taken at [_2].',
    '{JAPAN ONLY}Dear customer, you\'ve already completed the knowledge test, please proceed to next step.',
    '{JAPAN ONLY}Please complete the following questions.',
    '{JAPAN ONLY}The test is unavailable now, test can only be taken again on next business day with respect of most recent test.',
    'You need to finish all 20 questions.',
    'Weekday',
    'Your Application is Being Processed.',
    '{JAPAN ONLY}Your Application has Been Processed. Please Re-Login to Access Your Real-Money Account.',
    'Processing your request...',
    'Please check the above form for pending errors.',

    // contract types display names
    'Asian Up',
    'Asian Down',
    'Digit Matches',
    'Digit Differs',
    'Digit Odd',
    'Digit Even',
    'Digit Over',
    'Digit Under',

    // multi_barriers_trading
    '[_1] [_2] payout if [_3] is strictly higher than or equal to Barrier at close on [_4].',
    '[_1] [_2] payout if [_3] is strictly lower than Barrier at close on [_4].',
    '[_1] [_2] payout if [_3] does not touch Barrier through close on [_4].',
    '[_1] [_2] payout if [_3] touches Barrier through close on [_4].',
    '[_1] [_2] payout if [_3] ends on or between low and high values of Barrier at close on [_4].',
    '[_1] [_2] payout if [_3] ends outside low and high values of Barrier at close on [_4].',
    '[_1] [_2] payout if [_3] stays between low and high values of Barrier through close on [_4].',
    '[_1] [_2] payout if [_3] goes outside of low and high values of Barrier through close on [_4].',
    'M',
    'D',
    'Higher',
    'Higher or equal',
    'Lower',
    'Touches',
    'Does Not Touch',
    'Ends Between',
    'Ends Outside',
    'Stays Between',
    'Goes Outside',
    'All barriers in this trading window are expired',
    'Remaining time',
    'Market is closed. Please try again later.',
    'This symbol is not active. Please try another symbol.',
    'Sorry, your account is not authorised for any further contract purchases.',
    'Lots',
    'Payout per lot = 1,000',
    'This page is not available in the selected language.',

    // digit_info
    'Select market',
    'Number of ticks',
    'Percentage',
    'Digit',

    // paymentagent
    'Amount',
    'Deposit',
    'Withdrawal',
    'Your request to transfer [_1] [_2] from [_3] to [_4] has been successfully processed.',

    // iphistory
    'Date and Time',
    'Browser',
    'IP Address',
    'Status',
    'Successful',
    'Failed',
    'Your account has no Login/Logout activity.',
    'logout',

    // reality_check
    'Please enter a number between [_1].',
    '[_1] days [_2] hours [_3] minutes',
    'Your trading statistics since [_1].',

    // security
    'Unlock Cashier',
    'Your cashier is locked as per your request - to unlock it, please enter the password.',
    'Lock Cashier',
    'An additional password can be used to restrict access to the cashier.',
    'Update',
    'Sorry, you have entered an incorrect cashier password',
    'You have reached the withdrawal limit.',

    // view popup
    'Start Time',
    'Entry Spot',
    'Low Barrier',
    'Low Barrier ([_1])',
    'High Barrier',
    'High Barrier ([_1])',
    'Barrier ([_1])',
    'This contract won',
    'This contract lost',
    'Spot',
    'Barrier',
    'Target',
    'Equals',
    'Not',
    'Description',
    'Credit/Debit',
    'Balance',
    'Purchase Price',
    'Profit/Loss',
    'Contract Information',
    'Contract Expiry',
    'Contract Sold',
    'Current',
    'Open',
    'Closed',
    'Contract has not started yet',
    'Price',
    'Spot Time',
    'Spot Time (GMT)',
    'Current Time',
    'Exit Spot Time',
    'Exit Spot',
    'Indicative',
    'There was an error',
    'Sell at market',
    'You have sold this contract at [_1] [_2]',
    'Your transaction reference number is [_1]',
    'Note',
    'Contract will be sold at the prevailing market price when the request is received by our servers. This price may differ from the indicated price.',
    'Contract ID',
    'Contract Type',
    'Transaction ID',
    'Remaining Time',
    'Barrier Change',
    'Audit',
    'Audit Page',
    'View Chart',
    'Contract Starts',
    'Contract Ends',
    'Start Time and Entry Spot',
    'Exit Time and Exit Spot',

    // financial assessment
    'Please select a value',


    // authorised_apps
    'You have not granted access to any applications.',
    'Permissions',
    'Never',
    'Revoke access',
    'Are you sure that you want to permanently revoke access to the application',
    'Transaction performed by [_1] (App ID: [_2])',
    'Admin',
    'Read',
    'Payments',

    // lost_password
    '[_1] Please click the link below to restart the password recovery process.',
    'Your password has been successfully reset. Please log into your account using your new password.',
    'Please check your email for the password reset link.',

    // cashier page
    'details',
    'Withdraw',
    'Insufficient balance.',

    // endpoint notification
    'This is a staging server - For testing purposes only',
    'The server <a href="[_1]">endpoint</a> is: [_2]',

    // account signup error
    'Sorry, account signup is not available in your country.',

    // strings from back-end
    'There was a problem accessing the server.',
    'There was a problem accessing the server during purchase.',

    // form_validation
    'Should be a valid number.',
    'Should be more than [_1]',
    'Should be less than [_1]',
    'Should be between [_1] and [_2]',
    'Only letters, numbers, space, hyphen, period, and apostrophe are allowed.',
    'Only letters, space, hyphen, period, and apostrophe are allowed.',
    'Only letters, numbers, and hyphen are allowed.',
    'Only numbers, space, and hyphen are allowed.',
    'Only numbers and spaces are allowed.',
    'Only letters, numbers, space, and these special characters are allowed: - . \' # ; : ( ) , @ /',
    'The two passwords that you entered do not match.',
    '[_1] and [_2] cannot be the same.',
    'You should enter [_1] characters.',
    'Indicates required field',
    'Verification code is wrong. Please use the link sent to your email.',
    'The password you entered is one of the world\'s most commonly used passwords. You should not be using this password.',
    'Hint: it would take approximately [_1][_2] to crack this password.',
    'thousand',
    'million',
    'Should start with letter or number, and may contain hyphen and underscore.',
    'Your address could not be verified by our automated system. You may proceed but please ensure that your address is complete.',
    'Validate address',

    // metatrader
    'Congratulations! Your [_1] Account has been created.',
    'The main password of account number [_1] has been changed.',
    '[_1] deposit from [_2] to account number [_3] is done. Transaction ID: [_4]',
    '[_1] withdrawal from account number [_2] to [_3] is done. Transaction ID: [_4]',
    'Your cashier is locked as per your request - to unlock it, please click <a href="[_1]">here</a>.',
    'Your cashier is locked.',
    'You have insufficient funds in your Binary account, please <a href="[_1]">add funds</a>.',
    'Sorry, this feature is not available in your jurisdiction.',
    'You have reached the limit.',
    'Main password',
    'Investor password',
    'Current password',
    'New password',
    'Demo Standard',
    'Standard',
    'Demo Advanced',
    'Advanced',
    'Demo Volatility Indices',
    'Real Standard',
    'Real Advanced',
    'Real Volatility Indices',
    'Change Password',
    'Demo Accounts',
    'Real-Money Accounts',
    'Our MT5 service is currently unavailable to EU residents due to pending regulatory approval.',
    'for MT5 Account',
    '[_1] Account [_2]',

    // account_transfer
    'Min',
    'Max',
    'Current balance',
    'Withdrawal limit',

    // header notification
    '[_1]Authenticate your account[_2] now to take full advantage of all payment methods available.',
    'Please set the [_1]currency[_2] of your account.',
    'Please set your 30-day turnover limit in our [_1]self-exclusion facilities[_2] to remove deposit limits.',
    'Please set [_1]country of residence[_2] before upgrading to a real-money account.',
    'Please complete the [_1]financial assessment form[_2] to lift your withdrawal and trading limits.',
    'Please [_1]complete your account profile[_2] to lift your withdrawal and trading limits.',
    'Please [_1]accept the updated Terms and Conditions[_2] to lift your withdrawal and trading limits.',
    'Your account is restricted. Kindly [_1]contact customer support[_2] for assistance.',
    'Connection error: Please check your internet connection.',
    'You have reached the rate limit of requests per second. Please try later.',
    '[_1] requires your browser\'s web storage to be enabled in order to function properly. Please enable it or exit private browsing mode.',
    'We are reviewing your documents. For more details [_1]contact us[_2].',

    // browser-update message
    'Your web browser ([_1]) is out of date and may affect your trading experience. Proceed at your own risk. [_2]Update browser[_3]',

    // TODO: remove ico messages when all ico contracts are removed
    // binaryico message
    'Bid',
    'Closed Bid',

    // accounts
    'Create',
    'Commodities',
    'Indices',
    'Stocks',
    'Volatility Indices',
    'Set Currency',
    'Please choose a currency',
    'Create Account',
    'Accounts List',
    '[_1] Account',
    'Investment',
    'Gaming',
    'Virtual',
    'Real',
    'Counterparty',
    'This account is disabled',
    'This account is excluded until [_1]',

    // currency names
    'Bitcoin',
    'Bitcoin Cash',
    'Ether',
    'Ether Classic',
    'Litecoin',

    // Authentication errors
    'Invalid document format: "[_1]"',
    'File ([_1]) size exceeds the permitted limit. Maximum allowed file size: 3MB',
    'ID number is required for [_1].',
    'Only letters, numbers, space, underscore, and hyphen are allowed for ID number.',
    'Expiry date is required for [_1].',
    'Passport',
    'ID card',
    'Driving licence',
    'Front Side',
    'Reverse Side',
    'Front and reverse side photos of [_1] are required.',
    '[_1]Your Proof of Identity or Proof of Address[_2] did not meet our requirements. Please check your email for further instructions.',
];

/* eslint-disable no-console */
const map           = {};
const all_languages = [...common.languages, 'ach'].map(l => l.toLowerCase());

const build = () => {
    const gt = GetText.getInstance();
    all_languages.forEach(lang => {
        gt.setLang(lang);
        map[lang] = {};
        texts.forEach(text => {
            const key         = text.replace(/[\s.]/g, '_');
            const translation = gt.gettext(text, '[_1]', '[_2]', '[_3]', '[_4]');

            if (translation !== text) {
                map[lang][key] = translation;
            }
        });
    });
};

const generate = () => {
    const target_path = 'src/javascript/_autogenerated/';

    console.log(color.cyan('\nGenerating files:'));
    console.log(color.cyan('  Target: '), color.yellow(target_path));

    all_languages.forEach(lang => {
        process.stdout.write(color.cyan('    -'));
        process.stdout.write(` ${lang}.js ${'.'.repeat(15 - lang.length)}`);

        const js_path = path.join(common.root_path, `${target_path}${lang}.js`);
        const content = `const texts_json = {};\ntexts_json['${lang.toUpperCase()}'] = ${JSON.stringify(map[lang])};`;
        fs.writeFileSync(js_path, content, 'utf8');

        process.stdout.write(common.messageEnd());
    });
};

exports.build    = build;
exports.generate = generate;
exports.texts    = texts;
