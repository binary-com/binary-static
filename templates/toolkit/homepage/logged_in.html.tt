<div class="grd-grid-12">
    <h1>[% l('Welcome!') %]</h1>
    <p>
        [% l('Account') %] : <span class="clientid">[% client.loginid %]</span> - [% welcome_text %]
    </p>

    [% IF client.is_virtual %]
        [% IF virtual_topup_link %]
            <p>
                <a href="[% virtual_topup_link %]">[% l('Deposit [_1] virtual money into your account', virtual_topup_amount) %]</a>
            </p>
        [% END %]
    [% ELSE %]
        [% IF attorney_note %]
            <p>[% attorney_note %]</p>
        [% END %]

        [% IF client.payment_agent && client.payment_agent.is_authenticated %]
            <p>
            [% l('Your account is registered as a Payment Agent.') %]
            <a class="pjaxload with_login_cookies" href="[% request.url_for('paymentagent_transfer.cgi') %]">[% l('Transfer to client') %]</a>
            </p>
        [% END %]

        [% IF promo_messages %]
        <div class='notice-msg'>
            [% FOREACH message IN promo_messages %]
            <p>
                [% message %]
            </p>
            [% END %]
        </div>
        [% END %]
    [% END %]
</div>
<div class='grd-grid-12 grd-row-padding grd-parent'>
    <div class='grd-grid-6 grd-grid-mobile-12 grd-parent'>
        <div class='grd-grid-6 grd-parent'>
            <div class='grd-grid-8 grd-with-padding'>
                <a href="[% request.url_for('portfolio.cgi') %]" class="pjaxload">
                    <img class='responsive' src="[% request.url_for('images/pages/my_account/portfolio-icon.svg') %]"/>
                </a>
            </div>
            <div class='grd-grid-12'>
                <h4>
                    <a href="[% request.url_for('portfolio.cgi') %]" class="pjaxload">[% l('Portfolio') %]</a>
                </h4>
                <p>
                    [% l('View your open positions.') %]
                </p>
            </div>
        </div>
        <div class='grd-grid-6 grd-parent'>
            <div class='grd-grid-8 grd-with-padding'>
                <a href="[% request.url_for('profit_table.cgi') %]" class="pjaxload">
                    <img class='responsive' src="[% request.url_for('images/pages/my_account/profit-table-icon.svg') %]"/>
                </a>
            </div>
            <div class='grd-grid-12'>
                <h4>
                    <a href="[% request.url_for('profit_table.cgi') %]" class="pjaxload">[% l('Profit Table') %]</a>
                </h4>
                <p>
                    [% l('View your trading profit/loss.') %]
                </p>
            </div>
        </div>
    </div>
    <div class='grd-grid-6 grd-grid-mobile-12 grd-parent'>
        <div class='grd-grid-6 grd-parent'>
            <div class='grd-grid-8 grd-with-padding'>
                <a href="[% request.url_for('statement.cgi') %]" class="pjaxload">
                    <img class='responsive' src="[% request.url_for('images/pages/my_account/statement-icon.svg') %]"/>
                </a>
            </div>
            <div class='grd-grid-12'>
                <h4>
                    <a href="[% request.url_for('statement.cgi') %]" class="pjaxload">[% l('Statement') %]</a>
                </h4>
                <p>
                    [% l('View your historical transactions.') %]
                </p>
            </div>
        </div>
    </div>
    <div class='grd-grid-6 grd-grid-mobile-12 grd-parent'>
        <div class='grd-grid-6 grd-parent by_client_type client_real'>
            <div class='grd-grid-8 grd-with-padding'>
                <a href="[% request.url_for('available_payment_methods.cgi') %]" class="pjaxload">
                    <img class='responsive' src="[% request.url_for('images/pages/my_account/cashier-icon.svg') %]"/>
                </a>
            </div>
            <div class='grd-grid-12'>
                <h4>
                    <a href="[% request.url_for('available_payment_methods.cgi') %]" class="pjaxload">[% l('Cashier') %]</a>
                </h4>
                <p>
                    [% l('Make a deposit or withdraw') %]
                </p>
            </div>
        </div>
    </div>
</div>
