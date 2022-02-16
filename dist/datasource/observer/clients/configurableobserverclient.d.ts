/**
* Copyright (c) 2016-present, IBM Research
* Licensed under The MIT License [see LICENSE for details]
*/
export = ConfigurableObserverClient;
/**
 * Abstract class that defines the behaviour of a configurable observer client
 */
declare class ConfigurableObserverClient extends ObserverClient {
    /**
     * @param {Object} hkbaseOptions options to be used when communicating with hkbase
     * @param {Object} observerServiceParams observer service parameters (if using specialized observer)
     * @param {string} observerServiceParams.url url of the hkbase observer service
     * @param {Object} observerServiceParams.observerConfiguration the ObserverConfiguration of this client,
     * that includes which notification filters should be applied and the desired notification format.
     * The definition of ObserverConfiguration fields and possible filters is provided in OpenAPI/Swagger format at:
     * "https://github.ibm.com/keg-core/hkbase-observer/blob/main/docs/spec.yml" or acessing the hkbaseObserverServiceUrl through a browser (Swagger UI)
     * @param {number} observerServiceParams.heartbeatInterval heartbeat interval of the hkbase observer service
     * if this interval is greater than 0, a recurrent heartbeat function will be set when a specialized observer is initialized
     * this function makes a request to the heartbeat endpoint of the hkbase observer service to reset the configuration timeout
     * if the server stops receiving the heartbeat for this observer configuration it will be erased after it times out
     * and the notifications will stop being emmited for its clients
     */
    constructor(hkbaseOptions: Object, observerServiceParams: {
        url: string;
        observerConfiguration: Object;
        heartbeatInterval: number;
    });
    _hkbaseOptions: Object;
    _observerServiceUrl: string;
    _observerConfiguration: Object;
    _observerServiceHeartbeatInterval: number;
    _heartbeatTimeout: NodeJS.Timeout | null;
    _observerId: any;
    usesSpecializedObserver(): "" | Object;
    registerObserver(): Promise<any>;
    unregisterObserver(): Promise<void>;
    setHeartbeat(observerId: any): void;
    setHKBaseOptions(params: any): void;
}
import ObserverClient = require("./observerclient");
