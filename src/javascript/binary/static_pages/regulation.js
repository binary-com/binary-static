var Regulation = (function() {
    var init = function() {
        $(function() {
            $( "#accordion" ).accordion({
              heightStyle: "content",
              collapsible: true,
              active: 0
            });
        });

        var coords = [],
            $map_area = $('#planetmap area'),
            $selector = $('img[usemap="#planetmap"]');
        if (coords.length === 0) {
            $map_area.each(function(){
                coords.push($(this).attr('coords'));
            });
        }
        function relocate_links() {
            $map_area.each(function(index){
              var c = '';
              var new_width = $selector[0].getBoundingClientRect().width.toFixed(2);
              coords[index].split(',').map(function(v) { c += (c ? ',' : '') + (v*new_width/900).toFixed(2); });
              $(this).attr('coords', c);
            });
        }
        $(document).ready(relocate_links);
        $(window).resize(relocate_links);
    };

    return {
        init: init,
    };
})();

module.exports = {
    Regulation: Regulation,
};
