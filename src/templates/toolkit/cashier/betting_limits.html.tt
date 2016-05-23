<div class='grd-grid-12 grd-row-padding'>
    <h2>[% l("[_1] - Trading Limits", client.loginid) %]</h2>
</div>
<div class='grd-grid-12'>
    [% WRAPPER 'container/full_table.html.tt' table_id='client-limits' %]
        <tr class="rbox-table-heading">
            <th class="first left-aligned">[% l('Item') %]</th>
            <th>[% l('Limit') %] ([% currency %])</strong></th>
        </tr>
        <tr class="even">
            <td class="first">[% l('Maximum number of open positions') %] [% tooltip_for.max_open_pos %]</td>
            <td class="num">[% limit.open_positions %]</td>
        </tr>
        <tr class="odd">
            <td class="first">[% l('Maximum account cash balance') %] [% tooltip_for.account_balance %]</td>
            <td class="num">[% limit.account_balance %]</td>
        </tr>
        <tr class="even">
            <td class="first">[% l('Maximum daily turnover') %] [% tooltip_for.daily_turnover %]</td>
            <td class="num">[% limit.daily_turnover %]</td>
        </tr>
        <tr class="odd">
            <td class="first">[% l('Maximum aggregate payouts on open positions') %] [% tooltip_for.payout %]</td>
            <td class="num">[% limit.payout %]</td>
        </tr>
    [% END %]
</div>
