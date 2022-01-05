/**
* Copyright (c) 2016-present, IBM Research
* Licensed under The MIT License [see LICENSE for details]
*/
export = RabbitMQObserverClient;
declare class RabbitMQObserverClient extends ConfigurableObserverClient {
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
    constructor(info: {
        broker: string;
        brokerExternal: string;
        exchangeName: string;
        exchangeOptions: Object;
        certificate: string;
    }, options: {
        certificate: string;
    }, hkbaseOptions: Object, observerServiceParams: Object);
    _broker: string;
    _brokerExternal: string;
    _exchangeName: string;
    _defaultExchangeName: string;
    _exchangeOptions: Object;
    _certificate: string;
    _connectionManager: any;
    _channelWrapper: any;
    _setupFunction: ((channel: any) => Promise<void>) | null;
    _queueName: any;
    _init(exchangeName: any): Promise<void>;
    _isInitialized: boolean | undefined;
}
import ConfigurableObserverClient = require("./configurableobserverclient");
