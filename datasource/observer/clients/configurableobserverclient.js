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