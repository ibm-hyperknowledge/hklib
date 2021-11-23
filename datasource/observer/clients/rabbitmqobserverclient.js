/*
 * Copyright (c) 2016-present, IBM Research
 * Licensed under The MIT License [see LICENSE for details]
 */

'use strict';

const ObserverClient = require ('./configurableobserverclient')
const amqp           = require ('amqp-connection-manager');


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
	constructor (info, options, hkbaseOptions, observerServiceParams)
	{
		super (hkbaseOptions, observerServiceParams);
		this._broker            = info.broker;
		this._exchangeName      = info.exchangeName;
		this._exchangeOptions   = info.exchangeOptions;
		this._certificate       = info.certificate || options.certificate;
		this._connectionManager = null;
		this._channelWrapper    = null;
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
			let isDefaultQueue = true;
			
			// if specialized configuration is set up, get specialized queueName
			if(this.usesSpecializedObserver())
			{
				console.info('registering as observer of hkbase observer service');
				queueName = await this.registerObserver();
				isDefaultQueue = false;
			}
			else
			{
				console.info('registering as observer of hkbase');
			}
			await connect.call (this);
			this._channelWrapper.addSetup(async (channel) =>
			{
				const q = await channel.assertQueue (queueName, {exclusive: false});
				channel.bindQueue (q.queue, this._exchangeName, queueName);
				console.info(`Bound to exchange "${this._exchangeName}"`);
				console.info(" [*] Waiting for messages in %s.", q.queue);

				channel.consume (q.queue, (msg) =>
				{
					try
					{
						let message = JSON.parse (msg.content.toString());
						let observerId = message.observerId || '';
						if(isDefaultQueue && obseverId == '') 
						{
							this.notify (message);
						}
						else if(obseverId == queueName)
						{
							this.notify(message.notification)
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
