/*
 * Copyright (c) 2016-present, IBM Research
 * Licensed under The MIT License [see LICENSE for details]
 */

'use strict';

const ObserverClient = require ('./observerclient');
const request        = require("request");
const Promisify      = require("ninja-util/promisify");

class ConfigurableObserverClient extends ObserverClient
{
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
  constructor(hkbaseOptions, observerServiceParams)
  {
    super();
    this._hkbaseOptions = hkbaseOptions;
    this._observerServiceUrl = observerServiceParams.url;
    this._observerConfiguration = observerServiceParams.observerConfiguration;
    this._observerServiceHeartbeatInterval = observerServiceParams.heartbeatInterval;
    this._heartbeatTimeout = null;
    this._observerId = null;
  }

  static getType ()
	{
		return 'configurable';
	}

  usesSpecializedObserver()
  {
    return this._observerServiceUrl && this._observerConfiguration;
  }

  async registerObserver()
  {
    let params =
    {
      headers: { "content-type": "application/json" },
      body: JSON.stringify(this._observerConfiguration)
    }
    this.setHKBaseOptions(params);
    console.info(`registered as observer of hkbase observer service (${this._observerServiceUrl}) with configuration:`);
		console.info(JSON.stringify(this._observerConfiguration));
    let response = await Promisify.exec(request, request.post, this._observerServiceUrl + '/observer', params);
    if (response.statusCode > 300 || response.statusCode < 200) throw response.body;
    const observerId = JSON.parse(response.body).observerId;
    console.info('registered with observerId:', observerId);
    this.setHeartbeat(observerId);
    this._observerId = observerId;
    return observerId;
  }

  async unregisterObserver()
  {
    if(!this._observerId) return;
    let params =
    {
      headers: { "content-type": "application/json" },
    }
    this.setHKBaseOptions(params);
    console.info(`unregistering observer ${this._observerId}`);
    let response = await Promisify.exec(request, request.delete,`${this._observerServiceUrl}/observer/${this._observerId}`, params);
    if (response.statusCode > 300 || response.statusCode < 200) throw response.body;
    console.info(`unregistered observer ${this._observerId}`);
    this._observerId = null;
  }

  setHeartbeat(observerId)
  {
    if (this._observerServiceHeartbeatInterval >= 0)
    {
      if (this._heartbeatTimeout) clearTimeout(this._heartbeatTimeout);
      this._heartbeatTimeout = setTimeout(async () =>
      {
        let params = {};
        this.setHKBaseOptions(params);
        let response = await Promisify.exec(request, request.post, `${this._observerServiceUrl}/observer/${observerId}/heartbeat`, params);
        if (response.statusCode > 300 || response.statusCode < 200) throw response.body;
        this.setHeartbeat(observerId);
      }, this._observerServiceHeartbeatInterval);
    }
  }

  setHKBaseOptions(params)
  {
    if (this._hkbaseOptions)
      Object.assign(params, this._hkbaseOptions);
  }
}

module.exports = ConfigurableObserverClient;