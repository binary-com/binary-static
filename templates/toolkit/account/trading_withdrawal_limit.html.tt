
<div class="grd-grid-12 grd-row-padding">
    <h1>[% l('Trading and Withdrawal Limits') %]</h1>
</div>
[% INCLUDE 'cashier/betting_limits.html.tt' %]

<div class="grd-grid-12 grd-row-padding">
    <h2>[% client.loginid %] - [% l('Withdrawal limits') %]</h2>
[% IF client.client_fully_authenticated %]
    <p>
        [% l('Your account is fully authenticated and your withdrawal limit of EUR [_1] has been lifted.', original_num_of_days_limit_monetary) %]
    </p>
[% ELSE %]
    [% IF num_of_days_limit == lifetime_limit %]
        <p>
            [%
                l(
                    'Your withdrawal limit is <strong>EUR [_1]</strong> (or [_2] in other currency).',
                    num_of_days_limit_monetary,
                    num_of_days_limit_equivalent
                )
            %]
        </p>
        <p>
            [%
                l(
                    'You have already withdrawn the equivalent of EUR [_1].',
                    withdrawal_since_inception_monetary
                )
            %]
        </p>
    [% ELSE %]
        <p>
            [%
                l(
                    'Your [_1] day withdrawal limit is currently <strong>EUR [_2]</strong> (or [_3] in other currency).',
                    num_of_days,
                    num_of_days_limit_monetary,
                    num_of_days_limit_equivalent
                )
            %]
        </p>
        <p>
            [%
                l(
                    'You have already withdrawn the equivalent of EUR [_1] in aggregate over the last [_2] days.',
                    withdrawal_for_x_days_monetary,
                    num_of_days
                )
            %]
        </p>
        [% IF lifetime_limit < 99999999 %]
            <p>
                [%
                    l(
                        'Your withdrawal limit for the entire duration of the account is currently: <b>EUR [_1]</b> (or [_2] in other currency.)',
                        lifetime_limit_monetary,
                        lifetime_limit_equivalent
                    )
                %]
            </p>
            <p>
                [%
                    l(
                        'You have already withdrawn the equivalent of EUR [_1] in aggregate over the lifetime of your account.',
                        withdrawal_since_inception_monetary
                    )
                %]
            </p>
        [% END %]

        [% IF remainder == 0 %]
            <p>[% l('Therefore you may not withdraw any additional funds.') %]</p>
        [% ELSE %]
            <p>
                [%
                    l(
                        'Therefore your current immediate maximum withdrawal (subject to your account having sufficient funds) is EUR [_1] (or [_2] in other currency',
                        remainder_monetary,
                        equivalent_remainder
                    )
                %]
            </p>
        [% END %]
    [% END %]
[% END %]
</div>

