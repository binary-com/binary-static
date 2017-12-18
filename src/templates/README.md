Migrating from perl to jsx
=============

Introduction
===

The goal is to move all html templates in `src/templates/*.html.tt` to jsx.  

for example the follwing perl `Block` ...
```html
[% BLOCK li %]
<li[% IF class %] class="[% class %]"[% END %][% IF id %] id="[% id %]"[% END %]>
    [% IF header %]
        [% IF !text %]<h3>[% ELSE %]<strong>[% END %]
        [% header %]
        [% IF text %]</strong>[% ELSE %]</h3>[% END %]
    [% END %]
    [% IF href %]
        <a
            href="[% href %][% param %]"
            [% IF target %] target="[% target %]"[% END %]
            [% IF href.search('^http') %] rel="noopener noreferrer"[% END %]
        >
    [% END %]
    [% IF p %]<p>[% END %]
    [%= text =%]
    [% IF p %]</p>[% END %]
    [% IF href %]</a>[% END %]
</li>
[% END %]
```

Becomes this react component:
```jsx
export const Li = ({
    className,
    id,
    href,
    param = '',
    target,
    text,
    header,
    p,
}) => {
    const content = p ? <p>{text}</p> : text;

    return (
        <li id={id} className={className}>
            {header && (
                text ? <strong>{header}</strong> : <h3>{header}</h3>
            )}
            {href ?
                <a
                    href={`${href}${param}`}
                    rel={/^http/.test(href) ? 'noopener noreferrer' : undefined}
                    target={target || undefined}
                >
                    {content}
                </a>
                : content
            }
        </li>
    );
};
```

Rules
===

- Use functional stateless components (`FSC`).
- Use destructuring to capture parameters if needed.
- Use `{condition && <el/> ...</el>}` syntax to conditionally render an element.
- Use `<el attr={value || undefined}` to conditionally render an attribute, React omits attributes with null or undefined values.  
- Use `it.L('...')` instead of `l("...")` for translations.
- Use `it.url_for('...')` instead of `request.url_for("...")`.
- Always name your components before default exporting them, for example:

```html
[% BLOCK loading %]
<div class="barspinner [% theme || 'dark' %]">
    [% FOREACH i IN [1..5] %]
    <div class="rect[% i %]"></div>
    [% END %]
</div>
[% END %]

[% PROCESS loading %]
```

Becomes:
```jsx
import React from 'react';

const Loading = ({theme}) => (
    <div className={`barspinner ${ theme || 'dark'}`}>
        { Array.from(new Array(5)).map((x, inx) => (
            <div key={inx} className={`rect${inx + 1}`}></div>
        ))}
    </div>
);

export default Loading;
```


Contributing
===
- Make sure you have `node >= 8` installed.
- Git checkout a new branch of [This branch](https://github.com/aminroosta/binary-static/tree/no_perl) and do `npm install`.
    - `git add remote noperl git@github.com:aminroosta/binary-static.git`
    - `git fetch noperl no_perl`
    - `git checkout -b no_perl noperl/no_perl`
    - `npm install`
- Compile your templates with perl and rename `dist` folder to `dist-perl`, we will use it later to validate the changes.
    - `grunt shell:compile_dev`
    - `mv dist dist-perl`
- Pick a template (lets say `/src/templates/static/charity.html.tt`) and duplicate it with `.jsx` extension (`/src/templates/static/charity.jsx`).  
    - Update the trello card, let everyone know you are working on this template :-)
- After converting it to `.jsx` syntax, compile with `node scripts/compile.js [options]`.
    - You can pass `node scripts/compile.js -h` to see available options. 
    - Usually something like `node scripts/compile.js --dev --path charity$` will do.
    - `--path` is a Regex.
- Make sure there is not eslint errors, you can try `grunt eslint` command.
- Validate your changes with `node scripts/validate --path <save_as_regex>`;
    - example `node scripts/validate --path charity$`
- Send a PR to the same branch.
