JavaScript Rules
=============

### Style Guide

Most styling issues will be caught by ESLint, so before pushing your changes remember to run `grunt eslint` to catch and fix any issues that it finds.

Check below for the rules that are not caught by ESLint but should be followed.

### Import Rules

Use `require` instead of `import` to stay consistent with the current codebase. We could change it to `import` when switching to React.

Assignments are generally aligned by `=` for readability purposes.

```
const moment             = require('moment');                       // moment is an npm package
const CookieStorage      = require('./storage').CookieStorage;      // our own function
const applyToAllElements = require('./utility').applyToAllElements; // our own function
const createElement      = require('./utility').createElement;      // our own function
require('../../_common/lib/polyfills/array.includes');              // polyfill from lib folder
require('../../_common/lib/polyfills/string.includes');             // polyfill from lib folder

```

The order is important; it should be sorted alphabetically according to path: 
- `moment` comes first as it's not a relative path.
- `s` is before `u` so `./storage` comes before `./utility`.
- Both `applyToAllElements` and `createElement` are from the same file, but `a` is before `c`
- Unassigned `require` goes to the end 

When there are many functions being imported from the same file, consider combining it into one import line.

```
const Utility = require('./utility');

...

Utility.handleHash();
Utility.createElement('div');
...

```

---

### Naming Conventions

Variables should be lowercase words separated by `_`.

```
const var_one = 1;

```

Functions should be camelCase. This is to easily distinguish between variables and functions.

```
const myFunction = () => { ... };

```

Module names and classes should be PascalCase.

```
const MyModule = (() => { ... })();

```

jQuery variables should have a `$` in the beginning to mark them.

```
const $test = $('#test');

```

JavaScript elements can start with `el_` for a similar effect, but it's not as closely followed.

```
const el_test = document.getElementById('test');

``` 

Consider prefixes for form elements to make it more obvious what type of field they are, such as:

```
const fields: {
    txt_name  : { id: '#txt_name' },
    chk_tnc   : { id: '#chk_tnc' },
    ddl_agents: { id: '#ddl_agents' },
};

```

---

### Commenting

Feel free to add comments to explain code that is confusing, but also logic that is hardcoded in front-end and should move to API.

For changes that can be done in API V3, use the comment `// API_V3: [description of what needs to be moved to API]`

For changes that should be done in API V4, use the comment `// API_V4: [description of what needs to be moved to API]`
