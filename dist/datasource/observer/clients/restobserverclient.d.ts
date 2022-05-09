/**
* Copyright (c) 2016-present, IBM Research
* Licensed under The MIT License [see LICENSE for details]
*/
export = RestObserverClient;
declare class RestObserverClient extends ConfigurableObserverClient {
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
    constructor(info: Object, options: {
        baseUrl: string;
        port: number;
        address: string;
    }, hkbaseOptions: Object, observerServiceParams: Object);
    _baseUrl: string;
    _app: any;
    _port: number;
    _address: string;
    _listeningPath: string | null;
    _server: any;
    deinit(): Promise<void>;
}
import ConfigurableObserverClient = require("./configurableobserverclient");
