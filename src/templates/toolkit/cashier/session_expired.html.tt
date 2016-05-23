<script type="text/javascript">
function reloadWin(){
  var target = parent.postMessage ? parent : (parent.document.postMessage ? parent.document : undefined);
  if (typeof target != "undefined") target.postMessage({ action:'reloadwin' }, "*");
}
</script>
<h1>[% l('Your cashier session has expired') %]</h1>
<p>[% l('Either you left the cashier idle for a while or we were not able to log you in properly.') %]</p>
<p>[% l('To continue using our cashier system, please try accessing it again:') %]</p>
<p class="centerText">
    <a class="button" href="" onclick="reloadWin(); return false;">
        <span class="button">[% l('Reload Cashier') %]</span>
    </a>
</p>
