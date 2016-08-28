module.exports = {
    create: function() {
        var span = $("<span></span>", {class: "button"});
        var button = $("<button></button>", {class: "button"});
        span.append(button);
        return span;
    }
};
