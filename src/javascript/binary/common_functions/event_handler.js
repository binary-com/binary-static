function onlyNumericOnKeypress(ev) {
    var key = ev.keyCode;
    var char = String.fromCharCode(ev.which);
    if (
        (char === '.' && ev.target.value.indexOf(char) >= 0) ||
        (!/[0-9\.]/.test(char) && [8, 37, 39, 46].indexOf(key) < 0) || // delete, backspace, arrow keys
        /['%]/.test(char)) { // similarity to arrows key code in some browsers
        ev.returnValue = false;
        ev.preventDefault();
    }
}

module.exports = {
    onlyNumericOnKeypress: onlyNumericOnKeypress,
};
