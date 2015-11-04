module.exports = {
    cachebuster: {
        options: {
            basedir: 'dist/',
            formatter: function (hashes) {
                var output = '{';
                var count = 1;
                var length = Object.keys(hashes).length;
                for (var filename in hashes) {
                    if (/css/g.test(filename)) {
                        output += '"binary_css_hash":"' + hashes[filename] + '"';
                    } else if (/\bbinary\b/.test(filename)) {
                        output += '"binary_js_hash":"' + hashes[filename] + '"';
                    } else if (/\bdata\b/.test(filename)) {
                        output += '"binary_data_hash":"' + hashes[filename] + '"';
                    } else {
                        output += '"binary_lib_hash":"' + hashes[filename] + '"';
                    }
                    if (count < length) {
                        output += ',';
                    }
                    count++;
                }
                output += '}';
                return output;
            }
        },
        files: {
            'dist/hashed.json': ['dist/js/binary.min.js', 'dist/css/binary.min.css'],
        },
    }
};
