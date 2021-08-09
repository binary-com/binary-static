const onlyNumericOnKeypress = (ev, optional_value) => {
    const key         = ev.which;
    const char        = String.fromCharCode(key);
    let array_of_char = [0, 8, 37, 39, 46]; // special keypresses (tab, esc), delete, backspace, arrow keys
    if (optional_value && optional_value.length > 0) {
        array_of_char = array_of_char.concat(optional_value);
    }
    if ((char === '.' && ev.target.value.indexOf(char) >= 0) ||
        (!/[0-9.]/.test(char) && array_of_char.indexOf(key) < 0) ||
        /['%]/.test(char)) { // similarity to arrows key code in some browsers
        ev.returnValue = false;
        ev.preventDefault();
    }
};

const removeInvalidCharacters = (value)=>{
    const validBarrier = value.replace(/[^\d.+-]/g, '')// Remove all characters except .,+,-
        .replace(/(?!^)-/g, '')// Remove all dashes unless it is the first character
        .replace(/(?!^)\+/g, '')// Remove all + unless it is the first character
        .replace(/^([^.]*\.)|\./g, '$1');// Remove all periods unless it is the first one
    return validBarrier;
};

module.exports = {
    onlyNumericOnKeypress,
    removeInvalidCharacters,
};
