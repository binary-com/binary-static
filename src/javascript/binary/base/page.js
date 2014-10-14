var Page = function(config) { 
    config = typeof config !== 'undefined' ? config : {};
    this.client = new Client();
    this.url = new URL();
    this.settings = new InScriptStore(config['settings']);
    this.header = new Header({ client: this.client, settings: this.settings, url: this.url});
    this.contents = new Contents(this.client);
    this.footer = new Footer();
};

Page.prototype = {
    language: function() {
        if ($('#language_select').length > 0) {
            return $('#language_select').attr('class').toUpperCase(); //Required as mojo still provides lower case lang codes and most of our system expects upper case.
        } else if(page.url.param('l')) {
            return page.url.param('l');
        } else {
            return 'EN';
        }
    },
    on_load: function() {
        this.url.reset();
        this.header.on_load();
        this.localize_for(this.language());
        this.on_change_language();
        this.record_affiliate_exposure();
        this.contents.on_load();
        this.footer.on_load();
        $('#current_width').val(get_container_width());//This should probably not be here.
    },
    on_unload: function() {
        this.header.on_unload();
        this.contents.on_unload();
    },
    on_change_language: function() {
        var that = this;
        $('#language_select').on('change', 'select', function() {
            var language = $(this).find('option:selected').attr('class');
            document.location = that.url_for_language(language);
        });
    },
    localize_for: function(language) {
        text = texts[language];
        moment.lang(language.toLowerCase());
    },
    url_for_language: function(lang) {
        lang = lang.trim().toUpperCase();
        SessionStore.set('selected.language', lang);
        var loc = document.location; // quick access
        var qs = loc.search || '?';
        var url = loc.protocol + '//' + loc.host + loc.pathname;
        if (qs.indexOf('l=') >= 0) {
            url += qs.replace(/(\?|&)l=[A-Z_]{2,5}/, "$1l=" + lang);
        } else {
            if (qs.length > 1) {
                lang = '&l=' + lang;
            } else {
                lang = 'l=' + lang;
            }
            url += qs + lang;
        }
        return url;
    },
    record_affiliate_exposure: function() {
        var token = this.url.param('t');
        var token_valid = /\w{32}/.test(token);
        var is_subsidiary = /\w{1}/.test(this.url.param('s'));

        if (!token_valid) {
            return false;
        }

        var cookie_value = $.cookie('affiliate_tracking');
        if(cookie_value) {
            var cookie_token = JSON.parse(cookie_value);

            //Already exposed to some other affiliate.
            if (is_subsidiary && cookie_token && cookie_token["t"]) {
                return false;
            }
        }

        //Record the affiliate exposure. Overwrite existing cookie, if any.
        var cookie_hash = {};
        if (token_valid) {
            cookie_hash["t"] = token.toString();
        }
        if (is_subsidiary) {
            cookie_hash["s"] = "1";
        }

        $.cookie("affiliate_tracking", JSON.stringify(cookie_hash), {
            expires: 365, //expires in 365 days
            path: '/',
            domain: '.' + location.hostname.split('.').slice(-2).join('.')
        });
    }
};
