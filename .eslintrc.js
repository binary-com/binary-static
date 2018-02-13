module.exports = {
    parser: 'babel-eslint',
    env: {
        es6    : true,
        browser: true,
        amd    : true,
        mocha  : true,
        jquery : true,
    },
    globals: {
        dataLayer : true,
        texts_json: false,
    },
    rules: {
        camelcase                          : 0,
        semi                               : ['error', 'always'],
        'array-callback-return'            : 0,
        'func-names'                       : ['error', 'never'],
        'keyword-spacing'                  : ['error', { after: true }],
        'no-param-reassign'                : ['error', { props: false }],
        'no-script-url'                    : 0,
        'one-var'                          : ['error', { initialized: 'never', uninitialized: 'always' }],
        // react rules
        'import/no-extraneous-dependencies': [0, { extensions: ['.jsx'] }],
        'jsx-quotes'                       : ['error', 'prefer-single'],
        'react/prop-types'                 : 0,
        'import/prefer-default-export'     : 0,
    },
    extends: [
        'airbnb-base',
        'binary',
        'plugin:react/recommended',
    ],
    parserOptions: {
        ecmaVersion : 6,
        ecmaFeatures: {
            jsx: true,
        },
    },
};
