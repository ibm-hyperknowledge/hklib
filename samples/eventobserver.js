/*
 * Copyright (c) 2016-present, IBM Research
 * Licensed under The MIT License [see LICENSE for details]
 */
'use strict'

const { notificationHandler, startObserver, getAuthToken } = require('./utils');

// OBSERVER CONFIGURATIONS (Adjust according to the HKBase server you are using)
const HKB_SECRET = 'testSecret';
const HKB_TOKEN = getAuthToken(HKB_SECRET);
const HKB_URL = 'http://localhost:3000';
const NOTIFICATION_OPTIONS = {
  "hkbaseObserverServiceUrl": "http://localhost:8080",
  "hkbaseObserverConfiguration": {
    "filterExpression": {
      "filters": [{
        "type": "EventFilter",
        "eventType": "create"
      },
      {
        "type": "EventFilter",
        "eventType": "delete"
      }],
      "operator": "OR"
    },
    "notificationType": "id"
  }
};

startObserver(HKB_URL, HKB_TOKEN, NOTIFICATION_OPTIONS, notificationHandler);

// TODO modify entities


