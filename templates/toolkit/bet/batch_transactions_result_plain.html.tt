[% IF comment %]<p>[% comment %]</p>[% END %]
<p>The following bet(s) were executed by attorney ([% attorney.loginid %] - [% attorney.first_name %] [% attorney.last_name %]):</p>
<p>Reference time: [% ref_time %]<br>
Bet Details: [% bet_description %]<br>
Total Amount: [% batch_transactions.0.currency %] [% total_amount %]</p>
<table>
    <tr>
        <th>LoginID</th><th>Type</th></th>Result</th><th>RefID</th><th>Price</th><th>ElapsedTime</th><th>ReasonOfFailure</th>
    </tr>
[% FOREACH bought IN batch_transactions %]
    <tr>
        <td>[% bought.loginid %]</td><td>[% bought.buysell %]</td><td>[% bought.result %]</td><td>[% bought.tradeRef %]</td><td>[% bought.price %]</td><td>[% bought.elapsed %]</td><td>[% bought.reason %]</td>
    </tr>
[% END %]
</table>
