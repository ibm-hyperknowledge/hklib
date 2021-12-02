/*
 * Copyright (c) 2016-present, IBM Research
 * Licensed under The MIT License [see LICENSE for details]
 */

'use strict';

class ObserverClient
{
	constructor ()
	{
		this._handlers = [];
	}

	/**
	 * retrieves client type
	 * @returns {string} client type
	 */
	static getType ()
	{
		return 'default';
	}

	/***
	 * Initialize client and start calling handlers when notifications are received
	 * @returns {Promise}
	 */
	async init ()
	{
		return Promise.resolve();
	}

	/**
	 * Deinitilize client and stop receiving notifications
	 * @returns {Promise}
	 */
	async deinit()
	{
		return Promise.resolve();
	}

	/**
	 * Add handler function to be called when notifications are received
   * Can be called more than once
   * All added handlers are called for all notifications recieved
	 * @param {Function} callback handler function to be called when notifications are received
	 */
	addHandler (callback)
	{
		if (typeof (callback) === 'function')
		{
			this._handlers.push (callback);
		}
	}

	/**
	 * Calls every handler passing a notification as single parameter
	 * @param {Object} notification notification received from HKBase or HKBase Observer Service
	 */
	notify (notification)
	{
		this._handlers.forEach ( (handler) => handler(notification) );
	}
}

module.exports = ObserverClient;
