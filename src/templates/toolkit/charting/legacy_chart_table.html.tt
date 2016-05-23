[% IF toomuchtodisplay %][% l('Sorry, there is too much data to display, please select a shorter interval') %][% END %]

[% WRAPPER 'container/full_table.html.tt' table_id='legacy-chart-data' %]
    <thead>
        <tr class="rbox-table-heading">
            [% IF quotetimes.size %]
                <th>[% l('System Time') %]</th>
                <th>[% l('Trade Time') %]</th>
            [% ELSE %]
                <th>[% l('Date') %]</th>
            [% END %]
            [% IF candles.size %]
                <th>[% l('High') %]</th>
                <th>[% l('Low') %]</th>
                <th>[% l('Close') %]</th>
                <th>[% l('Change') %]</th>
            [% ELSE %]
                <th>[% graph_title %]</th>
            [% END %]
        </tr>
    </thead>
    <tbody>
        [% IF candles.size %]
            [% FOREACH candle IN candles %]
                <tr>
                    <td>[% candle.x %]</td>
                    [% IF quotetimes.size %]<td>[% candle.t %]</td>[% END %]
                    <td class="num">[% candle.h %]</td>
                    <td class="num">[% candle.l %]</td>
                    <td class="num">[% candle.c %]</td>
                    <td class="num">[% candle.n %]</td>
                </tr>
            [% END %]
        [% ELSE %]
            [% FOREACH graph IN graphxy %]
                <tr>
                    <td>[% graph.x %]</td>
                    [% IF quotetimes %]<td>[% graph.t %]</td>[% END %]
                    <td class="num">[% graph.y %]</td>
                </tr>
            [% END %]
        [% END %]
    </tbody>
[% END %]
