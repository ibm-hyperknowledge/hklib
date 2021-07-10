/*
 * Copyright (c) 2016-present, IBM Research
 * Licensed under The MIT License [see LICENSE for details]
 */

'use strict';

const ObserverClient = require ('./observerclient')
const amqp           = require ('amqp-connection-manager');

async function createChannel ()
{
	try
	{
		this._channelWrapper = this._connectionManager.createChannel ();
		this._channelWrapper.addSetup((channel) =>
		{
			channel.assertQueue(this._exchangeName, this._exchangeOptions);
			channel.on ('error', console.log);
			channel.on ('close', () => this.init());
		});
		return Promise.resolve ();
	}
	catch (err)
	{
		console.log(err);
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

		this._connectionManager = amqp.connect (this._broker, options);
		await this._connectionManager._connectPromise;
		this._connectionManager._currentConnection.connection.on ('error', console.log);

		await createChannel.call(this);
	}
	catch (err)
	{
		console.log(err);
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
			await connect.call (this);
			this._channelWrapper.addSetup(async (channel) =>
			{
				const q = await channel.assertQueue ('', {exclusive: true});
				channel.bindQueue (q.queue, this._exchangeName, '');
				console.log(`Bound to exchange "${this._exchangeName}"`);
				console.log(" [*] Waiting for messages in %s.", q.queue);

				channel.consume (q.queue, (msg) =>
				{
					try
					{
						let notification = JSON.parse (msg.content.toString());
						this.notify (notification);
					}
					catch (err)
					{
						console.log (err);
					}
				}, {noAck: true});
			});
		}			
		catch (err)
		{
			console.log(err);
		}
	}
}

module.exports = RabbitMQObserverClient;
