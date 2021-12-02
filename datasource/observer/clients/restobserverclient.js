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
		this.notify (notification);
		res.sendStatus(200);
	}

	this._app.post ('/repository/:repoName',
		(req, res) => repoCb (req, res, Notification.action.CREATE));

	this._app.delete ('/repository/:repoName',
		(req, res) => repoCb (req, res, Notification.action.DELETE));

	this._app.post ('/repository/:repoName/entity',
		(req, res) => entitiesCb (req, res, Notification.action.CREATE));

	this._app.put ('/repository/:repoName/entity',
		(req, res) => entitiesCb (req, res, Notification.action.UPDATE));

	this._app.delete ('/repository/:repoName/entity',
		(req, res) => entitiesCb (req, res, Notification.action.DELETE));
}

class RestObserverClient extends ObserverClient
{
	/**
	 * 
	 * @param {Object} info observer info from hkbase
	 * @param {Object} options observer initialization options
	 * @param {string} options.baseUrl base URL of hkbase to be used for registering observer
	 * @param {number} options.port port te be used when instantiating express server for receiving callback requests
	 * @param {string} options.address address to be used when instantiating express server for receiving callback requests
	 * @param {Object} hkbaseOptions options to be used when communicating with hkbase
	 * @param {Object} observerServiceParams observer service parameters (if using specialized observer)
	 */
	constructor (info, options, hkbaseOptions, observerServiceParams)
	{
		super (hkbaseOptions, observerServiceParams);
		this._baseUrl   = options.baseUrl;
		this._app = express ();
		this._port      = options.port || 0;
		this._address   = options.address || DEFAULT_ADDR;
		this._observerId = null;
		this._listeningPath = null;
		this._server = null;
		

		if (!this._baseUrl.endsWith('/'))
		{
			this._baseUrl = `${this._baseUrl}/`;
		}

		this._app.use (bodyParser.json());
	}

	static getType ()
	{
		return 'rest';
	}

	async init ()
	{
		console.info(`initializing REST observer client`);
		return new Promise ((resolve, reject) =>
			{
				setupEndpoints.call (this);
				this._server = this._app.listen (this._port,
					async () =>
					{
						this._port = this._server.address().port;
						console.info(`Express Server initialized at port ${this._port} for receiving callback requests of HKBase notifications`);
						try
						{
							let listeningPath = `${this._address}:${this._port}`;
							this._listeningPath = listeningPath;
							if(this.usesSpecializedObserver())
							{
								this._observerConfiguration.callbackEndpoint = listeningPath;
								await this.registerObserver();
							}
							else
							{
								let params = {method: 'put'};
								this.setHKBaseOptions(params);
								await request (`${this._baseUrl}observer/${encodeURIComponent(listeningPath)}`, params);
								console.info(`registered ${listeningPath} as observer of hkbase`);
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

	async deinit ()
	{
		console.info('Deiniting observer');
		if(this._observerId)
		{
			this.unregisterObserver();
		}
		else if (this._listeningPath)
		{
			let params = {method: 'delete'};
			this.setHKBaseOptions(params);
			await request (`${this._baseUrl}observer/${encodeURIComponent(this._listeningPath)}`, params);
			console.info(`unregistered ${this._listeningPath} as observer of hkbase`);
		}
		this._listeningPath = null;
		if(this._server)
		{
			await this._server.close();
			console.info(`Express Server at port ${this._port} was stopped`);
			this._port = null;
		}
		this._server = null;
		this._app = null;	
		console.info('Observer deinited');
	}

}

module.exports = RestObserverClient;
