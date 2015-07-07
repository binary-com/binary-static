<div class="bet_confirm_wrapper">
<h4>[% l('Batch Transactions') %]</h4>
[% IF comment %]<p class="comment">[% comment %]</p>[% END %]
<p>[% l('You have sold the following contract:') %]</p>
<div class="bet_confirm_desc">[% bet_description %]</div>

<table class="batch_sell_transactions">
    <thead>
        <tr class="header">
            <th id="loginid">[% l('Client ID') %]</th>
            <th id="result">[% l('Result') %]</th>
            <th id="refid">RefID</th>
            <th id="price">[% l('Price') %] ([% batch_transactions.0.currency %])</th>
        </tr>
    </thead>
    <tfoot>
        <tr class="footer[% IF (batch_transactions.size+1) % 2 %] odd[% ELSE %] even[% END %]">
            <th colspan="3" class="batch_transaction_total">Total</th>
            <th class="batch_transaction_total_price">[% total_amount %]</th>
        </tr>
    </tfoot>
    <tbody>
        [% FOREACH bought IN batch_transactions %]
        <tr class="[% IF (loop.index+1) % 2 %]odd[%ELSE%]even[% END %]">
            <td>[% bought.loginid %] [% IF bought.loginid == attorney_loginid %](yourself)[% END %]</td>
            <td><abbr rel="tooltip" title="[% bought.reason %]">[% bought.result %]</abbr></td>
            <td>[% bought.tradeRef %]</td>
            <td class="num">[% bought.price %]</td>
        </tr>
        [% END %]
    </tbody>
</table>
</div>
