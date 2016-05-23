var load_chart_app = function () {
    var isMac = /Mac/i.test(navigator.platform),
        isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent),
        isAndroid = /Android/i.test(navigator.userAgent),
        isWindowsPhone = /Windows Phone/i.test(navigator.userAgent),
        isJavaInstalled = navigator.javaEnabled(),
        isMobile = isIOS || isAndroid || isWindowsPhone,
        shouldBeInstalled = !isJavaInstalled && !isMobile;

    $('#install-java').toggle(shouldBeInstalled);
    $('#download-app').toggle(isJavaInstalled);

    $('#download-app').on('click', function () {
        if (isMac) {
            alert('You need to change your security preferences!');
            return;
        }

        if (isMobile) {
            alert('The charting app is not available on mobile devices!');
        }
    });
};
