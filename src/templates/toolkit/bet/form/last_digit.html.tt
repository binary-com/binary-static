<div>
    <span class='grd-grid-5 form_label'>
        <label for="bet_H">
            [% l('Last Digit Prediction') %]:
        </label>
    </span>
    <span class='grd-grid-7'>
        <select name="H" id="bet_H">
          [% FOREACH digit IN [ '0', '1', '2', '3', '4', '5', '6', '7', '8', '9' ] -%]
           <option value="[%- digit -%]"[% IF digit == H %] selected[% END %]>[%- digit -%]</option>
          [% END %]
        </select>
    </span>
</div>

<input type="hidden" name="pip_size" value="[%- pip_size -%]">
