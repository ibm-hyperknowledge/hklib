/*
 * Copyright (c) 2016-present, IBM Research
 * Licensed under The MIT License [see LICENSE for details]
 */

'use strict';

const ConfigurableObserverClient = require ('./configurableobserverclient')
const amqp                       = require ('amqp-connection-manager');
const Promisify 								 = require("ninja-util/promisify");
const NetcatClient							 = require ('netcat/client');
const nc												 = new NetcatClient();


async function createChannel ()
{
	try
	{
		this._channelWrapper = this._connectionManager.createChannel ();
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

		let brokerURL = new URL(this._broker);
		let brokerHost = brokerURL.hostname;
		let brokerPort = brokerURL.port;
		let portsStatus = await Promisify.exec(null, nc.addr(brokerHost).scan, brokerPort);
		brokerPort = `${brokerPort}`;
		if(portsStatus.hasOwnProperty(brokerPort) && portsStatus[brokerPort] == 'open')
		{
			this._connectionManager = amqp.connect (this._broker, {connectionOptions: options});
		}
		else if(this._brokerExternal)
		{
			this._connectionManager = amqp.connect (this._brokerExternal, {connectionOptions: options});
		}
		else
		{
			throw `Cannot reach broker on port ${brokerPort} of host ${brokerHost}`;
		}

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


class RabbitMQObserverClient extends ConfigurableObserverClient
{
	/**
	 * @param {Object} info observer info from hkbase
	 * @param {string} info.broker amqp broker default address
	 * @param {string} info.brokerExternal amqp broker external address to be used if default address is not accessible
	 * @param {string} info.exchangeName name of the RabbitMQ exchange where hkbase will publish messages
	 * @param {Object} info.exchangeOptions additional options to be used when connecting to hkbase echange
	 * @param {string} info.certificate RabbitMQ connection certificate (if needed)
	 * @param {Object} options observer initialization options
	 * @param {string} options.certificate RabbitMQ connection certificate (if needed)
	 * @param {Object} hkbaseOptions options to be used when communicating with hkbase
	 * @param {Object} observerServiceParams observer service parameters (if using specialized observer)
	 */
	constructor (info, options, hkbaseOptions, observerServiceParams)
	{
		super (hkbaseOptions, observerServiceParams);
		this._broker              = info.broker;
		this._brokerExternal      = info.brokerExternal;
		this._exchangeName        = info.exchangeName;
		this._defaultExchangeName = info.exchangeName;
		this._exchangeOptions     = info.exchangeOptions;
		this._certificate         = info.certificate || options.certificate;
		this._connectionManager   = null;
		this._channelWrapper      = null;
		this._setupFunction       = null;
		this._queueName           = null;
	}

	static getType ()
	{
		return 'rabbitmq';
	}

	async init  ()
	{
		console.info(`initializing RabbitMQ observer client`);
		try
		{
			let exchangeName = this._exchangeName;
			// if specialized configuration is set up, get specialized queueName
			if(this.usesSpecializedObserver())
			{
				exchangeName = await this.registerObserver();
			}
			else
			{
				console.info(`registered as observer of hkbase`);
			}
			await this._init(exchangeName);
		}			
		catch (err)
		{
			console.error(err);
		}
	}

	async _init(exchangeName)
	{
		await connect.call(this);
		this._setupFunction = async (channel) =>
		{
			this._exchangeName = exchangeName;
			const q = await channel.assertQueue('', { exclusive: true, autoDelete: true });
			this._queueName = q.queue;
			channel.bindQueue(this._queueName, this._exchangeName, 'create');
			console.info(`Bound to exchange "${this._exchangeName}"`);
			console.info(" [*] Waiting for messages in %s.", this._queueName);

			channel.consume(this._queueName, (msg) =>
			{
				if(!msg) return;
				try
				{
					let message = JSON.parse(msg.content.toString());
					if (this._observerId && message.observerId == this._observerId)
					{
						this.notify(message.notification);
					}
					else if (!this._observerId)
					{
						this.notify(message);
					}
				}
				catch (err)
				{
					console.error(err);
				}
			}, { noAck: true });
		}
		this._channelWrapper.addSetup(this._setupFunction);
		this._isInitialized = true;
	}

	async deinit ()
	{
		let _deinit = () => setTimeout( async () =>
		{
			if(this._isInitialized && !this._queueName) 
			{
				_deinit();
				return;
			}
			console.info("Deiniting observer");
			
			if(!this._channelWrapper)
			{
				console.warn('Observer already deinited!');
				return;
			} 
			await this._channelWrapper.cancelAll();
			console.info('canceled AMQP consumer');
			if(this._observerId)
			{
				await this.unregisterObserver();
			}
			
			await this._channelWrapper.deleteQueue(this._queueName);
			console.info(`removed queue ${this._queueName}`);
			this._queueName = null;

			if(this._setupFunction)
			{
				this._channelWrapper.removeSetup(this._setupFunction, (c) => c.close(), async () => 
				{
					await this._channelWrapper.close();
					await this._connectionManager.close();
					this._setupFunction = null;
					this._channelWrapper = null;
					this._connectionManager = null;
					this._isInitialized = false;
					this._exchangeName = this._defaultExchangeName;
					console.info("Observer deinited!");
				});
			}
			else
			{
				await this._channelWrapper.close();
				await this._connectionManager.close();
				console.info("Observer deinited!");
			}
		}, 1000);
		_deinit();
		
	}
}

module.exports = RabbitMQObserverClient;
