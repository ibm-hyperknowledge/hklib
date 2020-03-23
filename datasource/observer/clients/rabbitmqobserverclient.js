/*
 * Copyright (c) 2016-present, IBM Research
 * Licensed under The MIT License [see LICENSE for details]
 */

'use strict';

const request        = require ('request-promise-native');
const ObserverClient = require ('./observerclient')
const amqp           = require ('amqplib');

async function createChannel ()
{
	try
	{
		this._channel = await this._connection.createChannel ();
		this._channel.on ('error', console.log);
		this._channel.on ('close', () => this.init() );

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

		this._connection = await amqp.connect (this._broker, options);
		this._connection.on ('error', console.log);

		await createChannel.call(this);
	}
	catch (err)
	{
		console.log(err);
		this._connection = null;
		return Promise.reject(err);
	}
}


class RabbitMQObserverClient extends ObserverClient
{
	constructor (info, options)
	{
		super ();
		this._broker       = info.broker;
		this._exchangeName = info.exchangeName;
		this._certificate  = info.certificate || options.certificate;
		this._connection   = null;
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
			const q = await this._channel.assertQueue ('', {exclusive: true});
			this._channel.bindQueue (q.queue, this._exchangeName, '');

			console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q.queue);

			this._channel.consume (q.queue,
				(msg) =>
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
		}
		catch (err)
		{
			console.log(err);
		}
	}
}

module.exports = RabbitMQObserverClient;
