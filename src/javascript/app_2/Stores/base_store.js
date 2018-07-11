import { action,
    reaction,
    toJS }               from 'mobx';
import { isEmptyObject } from '../../_common/utility';

/**
 * BaseStore class is the base class for all defined stores in the application. It handle some stuff such as:
 *  1. Creating snapshot object from the store.
 *  2. Saving the store's snapshot in local/session storage and keep them sync.
 */
export default class BaseStore {

    /**
     * An enume object to define LOCAL_STORAGE and SESSION_STORAGE
     */
    static STORAGES = Object.freeze({
        LOCAL_STORAGE  : Symbol('LOCAL_STORAGE'),
        SESSION_STORAGE: Symbol('SESSION_STORAGE'),
    });

    /**
     * Constructor of the base class that get properties name of child which should be saved in storages
     *
     * @param {Object}   root_store - An object that contained the root store of the app.
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
     * Returns an snapshot to the current store
     *
     * @param {String[]} properties - A list of properties' names that should be in the snapshot.
     *
     * @return {Object} Returns a clone object for the store.
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
     * Setups a reaction on properties which are mentioned in `local_storage_properties`
     *  and invoke `saveToStorage` when there are any changes on them.
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
     * Setups a reaction on properties which are mentioned in `session_storage_properties`
     *  and invoke `saveToStorage` when there are any changes on them.
     *
     */
    setupReactionForSessionStorage() {
        if (this.session_storage_properties.length) {
            reaction(
                () => this.local_storage_properties.map(i => this[i]),
                () => this.saveToStorage(this.session_storage_properties, BaseStore.STORAGES.SESSION_STORAGE)
            );
        }
    }

    /**
     * Saves the snapshot of the store includes properties that are mentioned in
     *  first parameter in the storage that is mentioned in second parameters.
     *
     * @param {String[]} properties - A list of name of properties of the store  which they should be saved on the storage.
     * @param {Symbol}   storage    - A symbol object that define the storage which the snapshot should stored on it.
     *
     */
    saveToStorage (properties, storage) {
        const snapshot = JSON.stringify(this.getSnapshot(properties));

        if ( storage === BaseStore.STORAGES.LOCAL_STORAGE) {
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
