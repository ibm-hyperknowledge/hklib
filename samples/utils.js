/*
 * Copyright (c) 2016-present, IBM Research
 * Licensed under The MIT License [see LICENSE for details]
 */
'use strict'

const createObserver = require("../datasource/hkobserverfactory").createObserver;
const HKDatasource         = require("../datasource/hkdatasource");

// NOTIFICATION HANDLER (This sample only prints the notification, but what is done with the notification is up to you)
function notificationHandler (notification)
{
	try
	{
    console.debug("Notification Received:", JSON.stringify(notification));
	}
	catch (err)
	{
		console.error(err);
	}
}

// CREATE OBSERVER (This code instantiates the observer and binds the handler function with it)
async function startObserver(hkbUrl, hkbToken, notificationOptions, notificationHandler)
{
  try
  {
    const hkbOptions = {auth: {bearer: hkbToken}};
    let hkobserverClient = await createObserver (hkbUrl, notificationOptions, hkbOptions);
    await hkobserverClient.init ();
    hkobserverClient.addHandler (notificationHandler);
  }
  catch (err)
  {
    console.log(err);
  }
}

module.exports.notificationHandler = notificationHandler;
module.exports.startObserver = startObserver;
module.exports.getAuthToken = HKDatasource.getAuthToken;
