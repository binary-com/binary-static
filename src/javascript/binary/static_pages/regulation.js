const Regulation = (function() {
    const onLoad = function() {
        $(function() {
            $('#accordion').accordion({
                heightStyle: 'content',
                collapsible: true,
                active     : 0,
            });
        });

        const coords = [],
            $map_area = $('#planetmap').find('area'),
            $selector = $('img[usemap="#planetmap"]');
        if (coords.length === 0) {
            $map_area.each(function() {
                coords.push($(this).attr('coords'));
            });
        }
        function relocate_links() {
            $map_area.each(function(index) {
                let c = '';
                const new_width = $selector[0].getBoundingClientRect().width.toFixed(2);
                coords[index].split(',').map(function(v) { c += (c ? ',' : '') + ((v * new_width) / 900).toFixed(2); });
                $(this).attr('coords', c);
            });
        }
        $(document).ready(relocate_links);
        $(window).resize(relocate_links);
    };

    return {
        onLoad: onLoad,
    };
})();

module.exports = Regulation;
