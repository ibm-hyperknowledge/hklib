/*
 * Copyright (c) 2016-present, IBM Research
 * Licensed under The MIT License [see LICENSE for details]
 */

'use strict';

const express        = require ('express');
const bodyParser     = require ('body-parser');
const request        = require ('request-promise-native');
const ObserverClient = require ('./observerclient')
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
		console.log(notification);
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
		console.log(notification);
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
	constructor (info, options)
	{
		super ();
		this._baseUrl   = options.baseUrl;
		this._webServer = express ();
		this._port      = options.port || 0;
		this._address   = options.address || DEFAULT_ADDR;
		this._observerId = null;
		let isObserverService = options.isObserverService || false;
		this._hkbaseObserverServiceUrl = !isObserverService ? info.hkbaseObserverServiceUrl : undefined;
		this._hkbaseObserverConfiguration = !isObserverService ? info.hkbaseObserverConfiguration || options.hkbaseObserverConfiguration : undefined;

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
							if(this._hkbaseObserverServiceUrl && this._hkbaseObserverConfiguration)
							{
								this._hkbaseObserverConfiguration.callbackEndpoint = listeningPath;
								let options = {
									method: 'POST',
									body: JSON.stringify(this._hkbaseObserverConfiguration),
									headers: {"content-type": "application/json"},
								};
								let response = await request (`${this._hkbaseObserverServiceUrl}/observer`, options);
								this._observerId = JSON.parse(response).observerId;
							}
							else
							{
								await request (`${this._baseUrl}observer/${encodeURIComponent(listeningPath)}`, {method: 'put'});
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
