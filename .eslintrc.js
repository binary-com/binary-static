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
        camelcase                           : 0,
        semi                                : ['error', 'always'],
        'array-callback-return'             : 0,
        'brace-style'                       : ['error', '1tbs', { allowSingleLine: true }],
        'eol-last'                          : ['error', 'always'],
        'func-names'                        : ['error', 'never'],
        'keyword-spacing'                   : ['error', { after: true }],
        'no-else-return'                    : ['error', { allowElseIf: true }],
        'no-multi-assign'                   : 0,
        'no-param-reassign'                 : ['error', { props: false }],
        'no-restricted-globals'             : 0,
        'no-script-url'                     : 0,
        'object-curly-spacing'              : ['error', 'always', { arraysInObjects: true, objectsInObjects: true }],
        'one-var'                           : ['error', { initialized: 'never', uninitialized: 'always' }],
        'prefer-destructuring'              : 0,
        // react rules
        'import/no-extraneous-dependencies' : [0, { extensions: ['.jsx'] }],
        'jsx-quotes'                        : ['error', 'prefer-single'],
        'react/jsx-closing-bracket-location': ['error', { selfClosing: 'line-aligned', nonEmpty: 'line-aligned' }],
        'react/jsx-closing-tag-location'    : 'error',
        'react/jsx-first-prop-new-line'     : ['error', 'multiline-multiprop'],
        'react/jsx-indent'                  : ['error', 4],
        'react/jsx-indent-props'            : ['error', 4],
        'react/jsx-max-props-per-line'      : ['error', { when: 'multiline' }],
        'react/prop-types'                  : 0,
        'react/self-closing-comp'           : 'error',
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
    settings: {
        react: {
            version: '16',
        }
    }
};
