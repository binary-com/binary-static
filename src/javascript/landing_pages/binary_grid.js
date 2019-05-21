fetch('https://grid.binary.me/version.json')
    .then(response => response.json())
    .then(app => {
        $('.download').attr('href', `https://grid.binary.me/download/${app.name}`);
    });
window.onload = function () {
    commonOnload();
};
