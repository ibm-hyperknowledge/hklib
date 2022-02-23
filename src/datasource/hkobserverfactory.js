/*
 * Copyright (c) 2016-present, IBM Research
 * Licensed under The MIT License [see LICENSE for details]
 */

'use strict';

const classes = require ('./observer/clients/');
const request = require ('request-promise-native');
const ping		= require ('ping');

const CONNECTION_REFUSED_ERROR = 'ECONNREFUSED';

const clients = {};

for (let key in classes)
{
	const C = classes[key];
	clients[C.getType()] = C;
}

/**
 * Instantiate an observer client.
 * This method will ask the target HKBase which observer configuration it supports (REST or RabbitMQ)
 * and will instantiate the appropriate client with the provided configurations.
 * @param {string} basePath HKBase basePath that is used to communicate with the server
 * @param {Object} observerOptions Observer options that are used to initialize the observer client
 * @param {boolean} observerOptions.isObserverService if true, the factory method will assume that it 
 * is being called from the hkbaseObserverService and will ignore hkbaseObserverServiceUrl, hkbaseObserverServiceExternalUrl and hkbaseObserverConfiguration options
 * @param {string} observerOptions.hkbaseObserverServiceUrl url of the hkbaseObserverService to be used if hkbase does not inform one
 * @param {string} observerOptions.hkbaseObserverServiceExternalUrl external url of the hkbaseObserverService to be used if hkbaseObserverServiceUrl is not accessible to client
 * and hkbase does not provide one
 * @param {Object} observerOptions.hkbaseObserverConfiguration the ObserverConfiguration of this client, that includes which notification filters should be applied
 * and the desired notification format. The definition of ObserverConfiguration fields and possible filters is provided in OpenAPI/Swagger format at: 
 * "https://github.ibm.com/keg-core/hkbase-observer/blob/main/docs/spec.yml" or acessing the hkbaseObserverServiceUrl through a browser (Swagger UI)
 * @param {string} observerOptions.certificate if hkbase uses RabbitMQ notification, the AMQP connection certificate can be passed if needed
 * @param {number} observerOptions.port if hkbase uses REST notification, the port te be used when instantiating express server for receiving callback requests can be passed
 * @param {string} observerOptions.address if hkbase uses REST notification, the address to be used when instantiating express server for receiving callback requests can be passed
 * @param {Object} hkbaseOptions options that sould be passed when making requests to hkbase (e.g., authentication)
 * @returns {Promise<ObserverClient>} instance of ObserverClient or one of its subclasses
 */
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
		observerServiceParams.defaultUrl = !isObserverService ? info.hkbaseObserverServiceUrl || observerOptions.hkbaseObserverServiceUrl : undefined;
		observerServiceParams.externalUrl = !isObserverService ? info.hkbaseObserverServiceExternalUrl || observerOptions.hkbaseObserverServiceExternalUrl : undefined;
		observerServiceParams.observerConfiguration = !isObserverService ? info.hkbaseObserverConfiguration || observerOptions.hkbaseObserverConfiguration : undefined;
		if(observerServiceParams.defaultUrl && observerServiceParams.observerConfiguration)
		{
			observerServiceParams.url = observerServiceParams.defaultUrl;
			try
			{
					await request(observerServiceParams.defaultUrl);
			}
			catch(err)
			{
					if(observerServiceParams.externalUrl)
					{
							observerServiceParams.url = observerServiceParams.externalUrl;
					}
			}
			let observerServiceInfo = JSON.parse(await request (`${observerServiceParams.url}/observer/info`));
			observerServiceParams.heartbeatInterval = observerServiceInfo.heartbeat;
		}
		

		return new Klass (info, observerOptions, hkbaseOptions, observerServiceParams);
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
			console.error ('Could not initialize observer client');
		}
	}
}

module.exports.createObserver = createObserver;
