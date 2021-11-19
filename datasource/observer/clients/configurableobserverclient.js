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
  constructor(observerServiceParams)
  {
    super();
    this._observerServiceUrl = observerServiceParams.url;
    this._observerConfiguration = observerServiceParams.observerConfiguration;
    this._observerServiceHeartbeatInterval = observerServiceParams.heartbeatInterval;
    this._heartbeatTimeout = null;
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
    let response = await Promisify.exec(request, request.post, this._observerServiceUrl + '/observer', params);
    if (response.statusCode > 300 || response.statusCode < 200) throw response.body;
    const observerId = JSON.parse(response.body).observerId;
    this.setHeartbeat(observerId);
    return observerId;
  }

  setHeartbeat(observerId)
  {
    if (this._observerServiceHeartbeatInterval >= 0)
    {
      if (this._heartbeatTimeout) clearTimeout(this._heartbeatTimeout);
      this._heartbeatTimeout = setTimeout(async () =>
      {
        let response = await Promisify.exec(request, request.post, `${this._observerServiceUrl}/observer/${observerId}/heartbeat`);
        if (response.statusCode > 300 || response.statusCode < 200) throw response.body;
      }, this.heartbeatInterval);
    }
  }
}

module.exports = ConfigurableObserverClient;