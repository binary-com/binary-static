# FILE STRUCTURE STYLE GUIDE

## FILE STRUCTURE

In this project, it is tried to keep relevant files in 6 major directories 
which are called `Documents`, `CommonComponents`, `Modules`, `Services`, 
`Stores` and `Utils`.
We will describe them more in next sections.

Below is a sample file structure of the project.
```
app_2
    ├── CommonComponents/
    │   ├── Form/
    │   └── Layout/
    ├── Modules/
    │   ├── Trading/
    │   │   ├── Components/
    │   │   │   ├── chart.jsx
    │   │   │   ├── barrier.jsx
    │   │   │   └── …
    │   │   ├── Containers/
    │   │   │   ├── trade_form.jsx
    │   │   │   └── trade.jsx
    │   │   ├── Helpers/
    │   │   └── index.js
    │   └── Statement/
    │       ├── Components/
    │       ├── Containers/
    │       ├── Helpers/
    │       └── index.js
    ├── Services/
    ├── Stores/
    ├── Utils/
    │   ├── Date/
    │   └── …
    ├── Documents/
    └── index.js
```

This guide is based on presentational and container components. 
If you're not sure of the distinction between them, we recommend you read the 
[Presentational and Container Components](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0) 
article first.

## COMMON COMPONENTS

The `CommonComponents` directory contains subdirectories which contain common 
react components that are used all over the application (e.g. `Form`, `Layout`).

## MODULES

The predominant part of the project is `Modules` directory. 
All the presentational and container components are categorized by functionality 
here. Regarding the picture above, each functionality in the project has a 
directory in `Modules` directory (e.g. `Trading`) that contains two major subdirectories 
`Components` and `Containers`. We will explain more about `Components` and 
`Containers` directories in further sections.


### COMPONENTS

This directory contains React components, of either stateless or stateful varieties 
(e.g. `function` or `class` components).

The optimal structure for components is to place files relevant to a component inside 
its own subdirectory, e.g.:

```
Components/
└── Barrier/
    ├── test/    
    │   ├── barrier.spec.jsx
    │   └── other tests files ...
    ├── index.js
    ├── barrier.jsx
    ├── barrier.styles.scss
    ├── barrier.md (for react-styleguidist)
    └── other Barrier-related files...
```

The presentational components:

* Are concerned with how things look.
* May contain both presentational and container components inside, 
and usually, have some DOM markup and styles of their own.
* Often allow containment via this.props.children.
* Have no dependencies on the rest of the app, such as Flux actions or stores.
* Don’t specify how the data is loaded or mutated.
* Receive data and callbacks exclusively via props.
* Rarely have their own state (when they do, it’s UI state rather than data).
* Are written as functional components unless they need state, lifecycle hooks, 
or performance optimizations.
* Examples: Balance, AccountList, UserIfo, ...

#### Do:

* Keep all files immediately relevant to a component inside the given component directory.

* Add a basic `index.js` to import the component and export it 
to make it dead simple to import the component from elsewhere.
* Feel free to create subdirectories for relevant utils or helpers 
if it helps to keep things tidy
* Keep components small, focused and easy to test, breaking up complex 
components into smaller components
* Try to create new, reusable components instead of "sub-components" 
(i.e. prefer not to create sub-directories that contain more components)
* Connect all components (no matter how small) with `mobx-react` observer 
if they use props that come from the store for the best performance 
(e.g. the parent component passing store props into the child component)
* Always use `function` to define functional components instead of using ES6 arrow function.[?](https://medium.com/@stevemao/do-not-use-anonymous-functions-to-construct-react-functional-components-c5408ec8f4c7)
* __Be consistent__ — however, you choose to lay things out

#### Don't:

* Mix concerns (files, modules) that should really belong to other components
* Forget to write tests... :wink:

### CONTAINERS

This directory contains React container components. Container components are a 
concept borrowed from typical React-Redux projects. Containers are simply a 
bridge between application stores and UI components, making a connection to 
the relevant stores and passing down as props the properties and methods 
provided by the connected store(s).

It is easy to know if you should create a component or a container: 
if you need use `connect` function to connect a store, use containers otherwise 
use presentational components.

The optimal structure for container components is to place files relevant to a 
container inside its own subdirectory, e.g.:

```
Containers/
└── Trade/
    ├── test/
    │   ├── trade.spec.jsx
    │   └── other tests files ...
    ├── index.js
    ├── trade.jsx
    └── trade.md (for react-styleguidist)
```

Containers should follow rules:

* Are concerned with how thing work
* May contain both presentational and container components inside but usually 
__don’t have any DOM markup of their own__ except for some wrapping divs and 
never have any styles.
* Provide the data and behavior to presentational or other container components.
* Call Flux actions and provide these as callbacks to the presentational components.
* Are often stateful, as they tend to serve as data sources.
* Are usually generated using higher order components such as connect() from React 
Redux, createContainer() from Relay, or Container.create() from Flux Utils, 
rather than written by hand.
* Examples: Trade, Statement, Portfolio, Cashier, ...

#### Do:

* Connect your container components to the MobX stores
* Maintain a strict policy of giving container components little to no 
responsibilities relating to the UI: they ideally will not require styling 
because their child components should be the ones with styling applied.
* Keep all files immediately relevant to a container inside the given 
container directory.
* Add a basic index.js to import the container and export it to make it dead 
simple to import the container from elsewhere.
* __Be consistent__— however, you choose to lay things out.

#### Don't:

* Overcomplicate containers, they're not supposed to contain a lot of business 
logic. Usually, if you're creating methods on the container for complex logic, 
you might want to consider hoisting that logic up into the store it's 
connected to, or down into one of the components it's rendering.
* Mix concerns (files, modules) that should really belong to child components 
or provided stores.
* Forget to write tests... :wink:

## SERVICES

All javascript files which are related to sending, fetching and handling WebSocket 
requests and responses, are kept in `Services` directory.

## STORES

This directory contains everything that directly related to MobX stores, 
with each store having its own class definition.

The optimal structure for stores is to place files relevant to a store 
inside its own subdirectory, e.g.:

```
Stores/
├── test/
│   └── connect.spec.js
├── connect.js
└── Trade/
    ├── test/
    │   ├── trade.spec.js
    │   └── other tests files ...
    └── trade.js
```

### Do:
* Keep all files immediately relevant to a store inside the given store directory
* Add a basic index.js to import the store and export it to make it dead simple to 
import the store from elsewhere
* Use MobX's @action for action methods, rather than implicit set methods for clarity
* __Be consistent__— however, you choose to lay things out

### Don't:
* Place anything React-y inside stores— MobX is not reliant on React and uses 
no JSX, only basic ES6 classes and @ decorators.
* Instantiate stores (i.e. use new keyword) inside store definition files— 
stores are instantiated in the createStore module to avoid stores becoming singletons.
* Be afraid to use side-effects in actions, such as API calls
* Forget to write tests... :wink:

## UTILS

The `Utils` directory contains all javascript files that are used on other parts
of the project to help and simplify some routine processes 
(e.g. Date - to handle date formatting and conversion).
