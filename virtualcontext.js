/*
 * Copyright (c) 2016-present, IBM Research
 * Licensed under The MIT License [see LICENSE for details]
 */

"use strict";

const Types = require("./types");
const Context = require("./context");

function VirtualContext(id, endpoint, parent=null)
{
	this.id = id;
	this.endpoint = endpoint;
	this.parent = parent;
	this.readonly = true;
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
