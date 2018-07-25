import {
    action,
    reaction,
    toJS }               from 'mobx';
import { isEmptyObject } from '../../_common/utility';

/**
 * BaseStore class is the base class for all defined stores in the application. It handles some stuff such as:
 *  1. Creating snapshot object from the store.
 *  2. Saving the store's snapshot in local/session storage and keeping them in sync.
 */
export default class BaseStore {

    /**
     * An enum object to define LOCAL_STORAGE and SESSION_STORAGE
     */
    static STORAGES = Object.freeze({
        LOCAL_STORAGE  : Symbol('LOCAL_STORAGE'),
        SESSION_STORAGE: Symbol('SESSION_STORAGE'),
    });

    /**
     * Constructor of the base class that gets properties' name of child which should be saved in storages
     *
     * @param {Object}   root_store - An object that contains the root store of the app.
     * @param {String[]} local_storage_properties - A list of properties' names that should be kept in localStorage.
     * @param {String[]} session_storage_properties - A list of properties' names that should be kept in sessionStorage.
     */
    constructor(
        root_store = null,
        local_storage_properties = null,
        session_storage_properties = null
    ) {

        Object.defineProperty(this, 'root_store', {
            enumerable: false,
            writable  : true,
        });
        Object.defineProperty(this, 'local_storage_properties', {
            enumerable: false,
            writable  : true,
        });
        Object.defineProperty(this, 'session_storage_properties', {
            enumerable: false,
            writable  : true,
        });

        this.root_store = root_store;
        this.local_storage_properties   = local_storage_properties || [];
        this.session_storage_properties = session_storage_properties || [];

        this.setupReactionForLocalStorage();
        this.setupReactionForSessionStorage();
        this.retrieveFromStorage();
    }

    /**
     * Returns an snapshot of the current store
     *
     * @param {String[]} properties - A list of properties' names that should be in the snapshot.
     *
     * @return {Object} Returns a cloned object of the store.
     */
    getSnapshot(properties) {
        let snapshot = toJS(this);

        if (!isEmptyObject(this.root_store)) {
            snapshot.root_store = this.root_store;
        }

        if (properties && properties.length) {
            snapshot = properties.reduce(
                (result, p) => Object.assign(result, { [p]: snapshot[p]}),
                {}
            );
        }

        return snapshot;
    }

    /**
     * Sets up a reaction on properties which are mentioned in `local_storage_properties`
     *  and invokes `saveToStorage` when there are any changes on them.
     *
     */
    setupReactionForLocalStorage() {
        if (this.local_storage_properties.length) {
            reaction(
                () => this.local_storage_properties.map(i => this[i]),
                () => this.saveToStorage(this.local_storage_properties, BaseStore.STORAGES.LOCAL_STORAGE)
            );
        }
    }

    /**
     * Sets up a reaction on properties which are mentioned in `session_storage_properties`
     *  and invokes `saveToStorage` when there are any changes on them.
     *
     */
    setupReactionForSessionStorage() {
        if (this.session_storage_properties.length) {
            reaction(
                () => this.session_storage_properties.map(i => this[i]),
                () => this.saveToStorage(this.session_storage_properties, BaseStore.STORAGES.SESSION_STORAGE)
            );
        }
    }

    /**
     * Removes properties that are not passed from the snapshot of the store and saves it to the passed storage
     *
     * @param {String[]} properties - A list of the store's properties' names which should be saved in the storage.
     * @param {Symbol}   storage    - A symbol object that defines the storage which the snapshot should be stored in it.
     *
     */
    saveToStorage(properties, storage) {
        const snapshot = JSON.stringify(this.getSnapshot(properties));

        if (storage === BaseStore.STORAGES.LOCAL_STORAGE) {
            localStorage.setItem(this.constructor.name, snapshot);
        } else if (storage === BaseStore.STORAGES.SESSION_STORAGE) {
            sessionStorage.setItem(this.constructor.name, snapshot);
        }
    }

    /**
     * Retrieves saved snapshot of the store and assigns to the current instance.
     *
     */
    @action
    retrieveFromStorage() {
        const local_storage_snapshot = JSON.parse(localStorage.getItem(this.constructor.name, {}));
        const session_storage_snapshot = JSON.parse(sessionStorage.getItem(this.constructor.name, {}));

        const snapshot = {...local_storage_snapshot, ...session_storage_snapshot};

        Object.keys(snapshot).forEach((k) => this[k] = snapshot[k]);
    }
}
