/*
 * Copyright (c) 2016-present, IBM Research
 * Licensed under The MIT License [see LICENSE for details]
 */

'use strict';

const express        = require ('express');
const bodyParser     = require ('body-parser');
const request        = require ('request-promise-native');
const ObserverClient = require ('./configurableobserverclient')
const Notification   = require ('../notification');

const DEFAULT_ADDR   = 'http://localhost';

function setupEndpoints ()
{
	let repoCb = (req, res, action) =>
	{
		let notification = {
			action: action,
			object: Notification.object.REPOSITORY,
			args: {
				repository: req.params.repoName
			}
		};
		// console.debug(notification);
		this.notify (notification);
		res.sendStatus(200);
	}

	let entitiesCb = (req, res, action) =>
	{
		let notification = {
			action: action,
			object: Notification.object.ENTITIES,
			args: {
				repository: req.params.repoName,
				entities: req.body
			}
		};
		// console.log(notification);
		this.notify (notification);
		res.sendStatus(200);
	}

	this._webServer.post ('/repository/:repoName',
		(req, res) => repoCb (req, res, Notification.action.CREATE));

	this._webServer.delete ('/repository/:repoName',
		(req, res) => repoCb (req, res, Notification.action.DELETE));

	this._webServer.post ('/repository/:repoName/entity',
		(req, res) => entitiesCb (req, res, Notification.action.CREATE));

	this._webServer.put ('/repository/:repoName/entity',
		(req, res) => entitiesCb (req, res, Notification.action.UPDATE));

	this._webServer.delete ('/repository/:repoName/entity',
		(req, res) => entitiesCb (req, res, Notification.action.DELETE));
}

class RestObserverClient extends ObserverClient
{
	constructor (info, options, hkbaseOptions, observerServiceParams)
	{
		super (hkbaseOptions, observerServiceParams);
		this._baseUrl   = options.baseUrl;
		this._webServer = express ();
		this._port      = options.port || 0;
		this._address   = options.address || DEFAULT_ADDR;
		this._observerId = null;
		

		if (!this._baseUrl.endsWith('/'))
		{
			this._baseUrl = `${this._baseUrl}/`;
		}

		this._webServer.use (bodyParser.json());
	}

	static getType ()
	{
		return 'rest';
	}

	init ()
	{
		return new Promise ((resolve, reject) =>
			{
				setupEndpoints.call (this);
				let server = this._webServer.listen (this._port,
					async () =>
					{
						this._port = server.address().port;
						try
						{
							let listeningPath = `${this._address}:${this._port}`;
							if(this.usesSpecializedObserver())
							{
								this._observerConfiguration.callbackEndpoint = listeningPath;
								await this.registerObserver();
							}
							else
							{
								console.info('registering as observer of hkbase');
								let params = {method: 'put'};
								this.setHKBaseOptions(params);
								await request (`${this._baseUrl}observer/${encodeURIComponent(listeningPath)}`, params);
							}
							resolve ();
						}
						catch (err)
						{
							if (err.statusCode && err.statusCode >= 400 && err.statusCode < 500)
							{
								console.warn('observer already registered');
								resolve ();
							}
							else
							{
								console.error(err);
								reject (err);
							}
						}

					});
			});
	}

}

module.exports = RestObserverClient;
