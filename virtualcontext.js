/*
 * Copyright (c) 2016-present, IBM Research
 * Licensed under The MIT License [see LICENSE for details]
 */

"use strict";

const Types = require("./types");
const Context = require("./context");

function VirtualContext(id, virtualSrc=null, parent=null)
{
	if (arguments[0] && typeof arguments[0] === "object")
	{
		let vContext = arguments[0];
		this.id = vContext.id || null;
		this.parent = vContext.parent || null;
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
		this.parent = parent || null;
		this.properties = {"readonly": true, "virtualsrc": virtualSrc};
	}

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
			entity.properties !== undefined && entity.properties.hasOwnProperty('virtualsrc'))
		{
			isValid = true;
		}
	}

	return isValid;
}

VirtualContext.isValid = isValid;
module.exports = VirtualContext;
