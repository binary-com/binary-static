const OSDetect = () => {
    const Systems = {
        macos  : ['Mac68K', 'MacIntel', 'MacPPC'],
        linux  : ['HP-UX', 'Linux i686', 'Linux armv7l', ''],
        ios    : ['iPhone', 'iPod', 'iPad'],
        android: ['Android'],
        windows: ['Win16', 'Win32', 'WinCE'],
    };
    if (typeof navigator !== 'undefined') {
        return Object.keys(Systems)
            .map(os => {
                if (Systems[os].some(platform => navigator.platform === platform)) {
                    return os;
                }
                return false;
            })
            .filter(os => os)[0];
    }

    return 'Unknown OS';
};

module.exports = OSDetect;
