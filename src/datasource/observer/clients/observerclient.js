/*
 * Copyright (c) 2016-present, IBM Research
 * Licensed under The MIT License [see LICENSE for details]
 */

/**
 * Abstract class with basic behaviour and API of an observer client
 */
class ObserverClient {
    constructor() {
        if (this.constructor == ObserverClient) {
            throw new Error("Abstract classes can't be instantiated.");
        }
        this._handlers = [];
    }
    /**
     * retrieves client type
     * @returns {string} client type
     */
    static getType() {
        return 'default';
    }
    /***
     * Initialize client and start calling handlers when notifications are received
     * @returns {Promise}
     */
    async init() {
        throw new Error("Abstract Method has no implementation");
    }
    /**
     * Deinitilize client and stop receiving notifications
     * @returns {Promise}
     */
    async deinit() {
        throw new Error("Abstract Method has no implementation");
    }
    /**
     * Add handler function to be called when notifications are received
   * Can be called more than once
   * All added handlers are called for all notifications recieved
     * @param {Function} callback handler function to be called when notifications are received
     */
    addHandler(callback) {
        if (typeof (callback) === 'function') {
            this._handlers.push(callback);
        }
    }
    /**
     * Calls every handler passing a notification as single parameter
     * @param {Object} notification notification received from HKBase or HKBase Observer Service
     */
    notify(notification) {
        this._handlers.forEach((handler) => handler(notification));
    }
}
export default ObserverClient;
