/*
 * Copyright (c) 2016-present, IBM Research
 * Licensed under The MIT License [see LICENSE for details]
 */

'use strict';

const classes = require ('./observer/clients/');
const request = require ('request-promise-native');

const CONNECTION_REFUSED_ERROR = 'ECONNREFUSED';

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

		const isObserverService = observerOptions.isObserverService || false;
		const observerServiceParams = {};
		observerServiceParams.url = !isObserverService ? info.hkbaseObserverServiceUrl : undefined;
		observerServiceParams.observerConfiguration = !isObserverService ? info.hkbaseObserverConfiguration || observerOptions.hkbaseObserverConfiguration : undefined;
		if(observerServiceParams.url)
		{
			let observerServiceInfo = JSON.parse(await request (`${observerServiceParams.url}/observer/info`));
			observerServiceParams.heartbeatInterval = observerServiceInfo.heartbeat;
		}
		

		return new Klass (info, observerOptions, observerServiceParams);
	}
	catch (err)
	{
		if (err.error && err.error.code === CONNECTION_REFUSED_ERROR)
		{
			let error = new Error ();
			error.message = `could not connect to server at ${err.error.address}:${err.error.port}`
			error.code = CONNECTION_REFUSED_ERROR;
			throw error;
		}
		else
		{
			console.error (err);
			console.error ('Creating a default client');
			return new clients['default']();
		}
	}
}

module.exports.createObserver = createObserver;
