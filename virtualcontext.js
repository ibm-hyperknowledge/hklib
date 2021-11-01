/*
 * Copyright (c) 2016-present, IBM Research
 * Licensed under The MIT License [see LICENSE for details]
 */

"use strict";

const Types = require("./types");
const Context = require("./context");

function VirtualContext(id, endpoint=null, parent=null)
{
	if (arguments[0] && typeof arguments[0] === "object")
	{
		let vContext = arguments[0];
		this.id = vContext.id || null;
		this.parent = vContext.parent || null;
		this.endpoint = vContext.endpoint || null;
		if (vContext.properties)
		{
			this.properties = vContext.properties;
		}
		if (vContext.metaProperties)
		{
			this.metaProperties = vContext.metaProperties;
		}
		if (vContext.interfaces)
		{
			this.interfaces = vContext.interfaces;
		}
	}
	else
	{
		this.id = id || null;
		this.endpoint = endpoint || null;
		this.parent = parent || null;
		this.properties = {"readonly": true, "endpoint": endpoint};
	}

	this.type = Types.CONTEXT;
}

VirtualContext.prototype = Object.create(Context.prototype);
VirtualContext.prototype.constructor = VirtualContext;


function isValid(entity)
{
	let isValid = false;
	if (entity && typeof(entity) === 'object' && !Array.isArray(entity))
	{
		if (entity.hasOwnProperty('type') && entity.type === Types.CONTEXT &&
			entity.hasOwnProperty('id') && entity.hasOwnProperty('parent') &&
			entity.hasOwnProperty('endpoint'))
		{
			isValid = true;
		}
	}

	return isValid;
}

VirtualContext.isValid = isValid;
module.exports = VirtualContext;
