/**
* Copyright (c) 2016-present, IBM Research
* Licensed under The MIT License [see LICENSE for details]
*/
export = ObserverClient;
/**
 * Abstract class with basic behaviour and API of an observer client
 */
declare class ObserverClient {
    /**
     * retrieves client type
     * @returns {string} client type
     */
    static getType(): string;
    _handlers: any[];
    /***
     * Initialize client and start calling handlers when notifications are received
     * @returns {Promise}
     */
    init(): Promise<any>;
    /**
     * Deinitilize client and stop receiving notifications
     * @returns {Promise}
     */
    deinit(): Promise<any>;
    /**
     * Add handler function to be called when notifications are received
   * Can be called more than once
   * All added handlers are called for all notifications recieved
     * @param {Function} callback handler function to be called when notifications are received
     */
    addHandler(callback: Function): void;
    /**
     * Calls every handler passing a notification as single parameter
     * @param {Object} notification notification received from HKBase or HKBase Observer Service
     */
    notify(notification: Object): void;
}
