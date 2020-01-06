/*
 * Copyright (c) 2016-present, IBM Research
 * Licensed under The MIT License [see LICENSE for details]
 */

'use strict';

const classes = require ('./observer/clients/');
const request = require ('request-promise-native');

const clients = {};

for (let key in classes)
{
	const C = classes[key];
	clients[C.getType()] = C;
}

async function createObserver (basePath, observerOptions = {}, hkbaseOptions = {})
{
	try
	{
		if (! basePath.endsWith('/'))
		{
			basePath = `${basePath}/`;
		}

		let info = JSON.parse(await request (`${basePath}observer/info`, hkbaseOptions));

		let Klass = clients[info.type];
		if (!Klass)
		{
			throw `Cannot create a client for observer: ${info.type}`;
		}

		observerOptions.baseUrl = basePath;

		return new Klass (info, observerOptions);
	}
	catch (err)
	{
		console.error (err);
		console.error ('Creating a default client');
		return new clients['default']();
	}
}

module.exports.createObserver = createObserver;
