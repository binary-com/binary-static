import React, { Component } from 'react';
import { inject, Provider } from 'mobx-react';
import { isBoxedObservable, isObservable, isObservableArray, isObservableMap, toJS } from 'mobx';

const SPECIAL_REACT_KEYS = { children: true, key: true, ref: true };

export class MobxProvider extends Provider {
    getChildContext() {
        const stores = {};

        // inherit stores
        const baseStores = this.context.mobxStores;
        if (baseStores) {
            for (const key in baseStores) { // eslint-disable-line
                stores[key] = baseStores[key];
            }
        }

        // add own stores
        for (const key in this.props.store) { // eslint-disable-line
            if (!SPECIAL_REACT_KEYS[key]) {
                stores[key] = this.props.store[key];
            }
        }

        return {
            mobxStores: stores,
        };
    }
}

const isFunction = (fn) => typeof (fn) === 'function';
const isShallowEqual = (a, b) => {
    for (const key in a) { // eslint-disable-line
        if (isFunction(a[key]) && isFunction(b[key])) {
            continue; // eslint-disable-line
        }

        if (a[key] !== b[key]) {
            return false;
        }
    }
    return true;
};

const unboxProps = (props) => {
    const unboxedProps = {};
    Object.keys(props).forEach(key => {
        if (isObservableArray(props[key])) {
            unboxedProps[key] = props[key].peek();
        } else if (isObservableMap(props[key])) {
            unboxedProps[key] = props[key].toJS();
        } else if (isBoxedObservable(props[key])) {
            unboxedProps[key] = props[key].get();
        } else if (isObservable(props[key])) {
            unboxedProps[key] = toJS(props[key]);
        } else {
            unboxedProps[key] = props[key];
        }
    });

    return unboxedProps;
};

export const connect = mapStoresToProps => (WrappedComponent) => {
    class UnboxedComponent extends Component {
        render() {
            return (
                <WrappedComponent {...this.props} />
            );
        }

        shouldComponentUpdate(nextProps) {
            return !isShallowEqual(nextProps, this.props);
        }
    }

    // wrap the mapping function usually passed to mobx-react's inject method
    // so that it additionally unboxes any observables
    const unboxedMapStoresToProps = (stores, props, context) => {
        const injectedProps = mapStoresToProps(stores, props, context);
        Object.assign(injectedProps, props);
        return unboxProps(injectedProps);
    };

    // apply the mobx store injection with our wrapped function
    const InjectedComponent = inject(unboxedMapStoresToProps)(UnboxedComponent);

    // make some nice names that will show up in the React Devtools
    const wrappedDisplayName = WrappedComponent.displayName
        || WrappedComponent.name
        || (WrappedComponent.constructor && WrappedComponent.constructor.name)
        || 'Unknown';
    InjectedComponent.displayName = `inject-${wrappedDisplayName}`;
    UnboxedComponent.displayName = `unbox-${wrappedDisplayName}`;

    return InjectedComponent;
};