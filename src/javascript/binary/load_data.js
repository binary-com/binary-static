/*
 * Make sure data js is loaded before this
 * else website will not work properly
 * objects texts_json, markets_list, markets_json
 * should be available
 */

// make texts object as Localizable
var texts = {};
for (var key in texts_json) {
    if (texts_json.hasOwnProperty(key)) {
        texts[key] = new Localizable(texts_json[key]);
    }
}

// make markets object
var markets = new Markets(markets_list, markets_json);
