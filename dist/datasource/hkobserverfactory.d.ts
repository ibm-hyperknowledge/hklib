/**
* Copyright (c) 2016-present, IBM Research
* Licensed under The MIT License [see LICENSE for details]
*/
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
export function createObserver(basePath: string, observerOptions?: {
    isObserverService: boolean;
    hkbaseObserverServiceUrl: string;
    hkbaseObserverServiceExternalUrl: string;
    hkbaseObserverConfiguration: Object;
    certificate: string;
    port: number;
    address: string;
}, hkbaseOptions?: Object): Promise<ObserverClient>;
