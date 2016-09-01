module.exports = {
	all: {
		options: {
			reporter: 'spec',
			quiet: false, // Optionally suppress output to standard out (defaults to false)
			clearRequireCache: false, // Optionally clear the require cache before running tests (defaults to false)
            require: 'src/javascript/binary/common_functions/compatibility.js'
		},
		src: ['src/javascript/binary/**/__tests__/*.js']
	}
};
