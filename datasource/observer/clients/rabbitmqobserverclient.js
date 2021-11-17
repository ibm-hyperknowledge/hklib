/*
 * Copyright (c) 2016-present, IBM Research
 * Licensed under The MIT License [see LICENSE for details]
 */

'use strict';

const ObserverClient = require ('./observerclient')
const amqp           = require ('amqp-connection-manager');
const request        = require("request");
const Promisify      = require("ninja-util/promisify");


async function createChannel ()
{
	try
	{
		this._channelWrapper = this._connectionManager.createChannel ();
		this._channelWrapper.addSetup((channel) =>
		{
			channel.assertQueue(this._exchangeName, this._exchangeOptions);
			channel.on ('error', console.error);
			channel.on ('close', () => this.init());
		});
		return Promise.resolve ();
	}
	catch (err)
	{
		console.error(err);
		return Promise.reject();
	}
}

async function connect ()
{
	try
	{
		let options = {};
		if (this._certificate)
		{
			options.ca = [Buffer.from (this._certificate, 'base64')];
		}

		this._connectionManager = amqp.connect (this._broker, {connectionOptions: options});
		await this._connectionManager._connectPromise;
		this._connectionManager._currentConnection.connection.on ('error', console.error);

		await createChannel.call(this);
	}
	catch (err)
	{
		console.error(err);
		this._connectionManager = null;
		return Promise.reject(err);
	}
}


class RabbitMQObserverClient extends ObserverClient
{
	constructor (info, options)
	{
		super ();
		this._broker            = info.broker;
		this._exchangeName      = info.exchangeName;
		this._exchangeOptions   = info.exchangeOptions;
		this._certificate       = info.certificate || options.certificate;
		this._hkbaseObserverServiceUrl = info.hkbaseObserverServiceUrl;
		this._connectionManager = null;
		this._channelWrapper    = null;
		this._hkbaseObserverConfiguration = info.hkbaseObserverConfiguration || options.hkbaseObserverConfiguration;
	}

	static getType ()
	{
		return 'rabbitmq';
	}

	async init  ()
	{
		try
		{
			let queueName = '';
			
			// if specialized configuration is set up
			if(this._hkbaseObserverServiceUrl  && this._hkbaseObserverConfiguration)
			{
				// get specialized queueName
				let params =
				{
					headers: {"content-type": "application/json"},
					body: JSON.stringify(this._hkbaseObserverConfiguration)
				}
				let response = await Promisify.exec(request, request.post, this._hkbaseObserverServiceUrl + '/observer', params);
				queueName = JSON.parse(response.body).observerId;
			}
			await connect.call (this);
			this._channelWrapper.addSetup(async (channel) =>
			{
				const q = await channel.assertQueue (queueName, {exclusive: false});
				channel.bindQueue (q.queue, this._exchangeName, queueName);
				console.log(`Bound to exchange "${this._exchangeName}"`);
				console.log(" [*] Waiting for messages in %s.", q.queue);

				channel.consume (q.queue, (msg) =>
				{
					try
					{
						let notification = JSON.parse (msg.content.toString());
						if(queueName === '' || msg.fields.routingKey === queueName) 
						{
							this.notify (notification);
						}
					}
					catch (err)
					{
						console.error (err);
					}
				}, {noAck: true});
			});
		}			
		catch (err)
		{
			console.error(err);
		}
	}
}

module.exports = RabbitMQObserverClient;
