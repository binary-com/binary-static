window._trackJs = {
    onError: (payload) => {
        const itemExistInList = (item, list) => {
            for (let i = 0; i < list.length; i++) {
                if (item.indexOf(list[i]) > -1) {
                    return true;
                }
            }
            return false;
        };

        const ignorable_errors = [
            // General script error, not actionable
            '[object Event]',
            // General script error, not actionable
            'Script error.',
            // error when user  interrupts script loading, nothing to fix
            'Error loading script',
            // an error caused by DealPly (http://www.dealply.com/) chrome extension
            'DealPly',
            // this error is reported when a post request returns error, i.e. html body
            // the details provided in this case are completely useless, thus discarded
            'Unexpected token <',
        ];

        if (itemExistInList(payload.message, ignorable_errors)) {
            return false;
        }

        payload.network = payload.network.filter(item => (
            // ignore random errors from Intercom
            !(item.statusCode === 403 && payload.message.indexOf('intercom') > -1)
        ));

        return true;
    },
};

// if Track:js is already loaded, we need to initialize it
if (typeof trackJs !== 'undefined') trackJs.configure(window._trackJs);
