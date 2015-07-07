<span class='grd-grid-5 form_label'>
    <select id="amount_type" name="amount_type">
  [%- FOREACH amount_type IN amount_types -%] <option value="[%- amount_type.value -%]"[% IF amount_type.value == amount_type %] selected="selected"[% END %]>[%- amount_type.text -%]</option> [%- END -%]
    </select>
</span>
<span class='grd-grid-7 grd-parent'>
    <span class='grd-grid-3'>
        [%- IF currencies.size > 1 -%]
          <select id="bet_currency" name="currency">
              [%- FOREACH currency IN currencies -%] 
              <option value="[%- currency -%]" [% IF currency == selected_currency %] selected="selected" [% END %]>[%- currency -%]</option>
              [%- END -%]
          </select>
        [%- ELSE -%]
          [% currencies.first %] <input type="hidden" name="currency" value="[%- currencies.first -%]" />
        [%- END -%]
    </span>
    <span class='grd-grid-9'>
        <input id="amount" name="amount" size=7 value="[%- amount -%]">
    </span>
</span>
