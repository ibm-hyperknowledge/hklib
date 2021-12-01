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

	static getType ()
	{
		return 'default';
	}

	async init ()
	{
		return Promise.resolve();
	}

	async deinit()
	{
		return Promise.resolve();
	}

	addHandler (cb)
	{
		if (typeof (cb) === 'function')
		{
			this._handlers.push (cb);
		}
	}

	notify (notification)
	{
		this._handlers.forEach ( (handler) => handler(notification) );
	}
}

module.exports = ObserverClient;
