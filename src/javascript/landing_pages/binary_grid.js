const systems = {
    mac  : ['Mac68K', 'MacIntel', 'MacPPC'],
    linux: [
        'HP-UX',
        'Linux i686',
        'Linux amd64',
        'Linux i686 on x86_64',
        'Linux i686 X11',
        'Linux x86_64',
        'Linux x86_64 X11',
        'FreeBSD',
        'FreeBSD i386',
        'FreeBSD amd64',
        'X11',
    ],
    ios: [
        'iPhone',
        'iPod',
        'iPad',
        'iPhone Simulator',
        'iPod Simulator',
        'iPad Simulator',
    ],
    android: [
        'Android',
        'Linux armv7l', // Samsung galaxy s2 ~ s5, nexus 4/5
        'Linux armv8l',
        null,
    ],
    windows: [
        'Win16',
        'Win32',
        'Win64',
        'WinCE',
    ],
};
fetch('https://grid.binary.me/version.json')
    .then(response => response.json())
    .then(app => {
        $('.download').attr('href', `https://grid.binary.me/download/${app.name}`);
    });

const OSDetect = () => {
    // For testing purposes or more compatibility, if we set 'config.os'
    // inside our localStorage, we ignore fetching information from
    // navigator object and return what we have straight away.
    if (localStorage.getItem('config.os')) {
        return localStorage.getItem('config.os');
    }

    if (typeof navigator !== 'undefined' && navigator.platform) {
        return Object.keys(systems).map((os) => {
            if (systems[os].some((platform) => navigator.platform === platform)) {
                return os;
            }

            return false;
        }).filter((os) => os)[0];
    }

    return 'Unknown OS';
};

window.onload = function () {
    const os = OSDetect();
    const desktop_buttons = document.querySelectorAll('.try-desktop');
    const ios_messages    = document.querySelectorAll('.ios-message');
    const android_buttons = document.querySelectorAll('.android-button');
    if (os === 'android') {
        // hide desktop
        android_buttons.forEach(element => element.classList.remove('invisible'));
    } else if (os === 'ios') {
        // hide all button
        ios_messages.forEach(element => element.classList.remove('invisible'));
    } else {
        // show both buttons on desktop
        android_buttons.forEach(element => element.classList.remove('invisible'));
        desktop_buttons.forEach(element => element.classList.remove('invisible'));
    }

    commonOnload();
};
