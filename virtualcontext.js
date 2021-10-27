/*
 * Copyright (c) 2016-present, IBM Research
 * Licensed under The MIT License [see LICENSE for details]
 */

"use strict";

const Types = require("./types");
const Context = require("./context");

function VirtualContext(id, src, parent=null)
{
	this.id = id;
	this.properties = {"readonly": true, "src": src};
	this.parent = parent;
	this.type = Types.VIRTUALCONTEXT;

}

VirtualContext.prototype = Object.create(Context.prototype);
VirtualContext.prototype.constructor = VirtualContext;

VirtualContext.prototype.serialize = function()
{
	let virtualContext = {
		id: this.id,
		type: Types.VIRTUALCONTEXT,
		parent: this.parent || null
	}

	if (this.properties)
	{
		virtualContext.properties = this.serializeProperties();
	}

	if (this.metaProperties)
	{
		virtualContext.metaProperties = this.serializeMetaProperties();
	}

	if (this.interfaces)
	{
		virtualContext.interfaces = {};
		for (let k in this.interfaces)
		{
			virtualContext.interfaces[k] = JSON.parse(JSON.stringify(this.interfaces[k])) // Lazy job
		}
	}

	return virtualContext;
}

function isValid(entity)
{
	let isValid = false;
	if (entity && typeof(entity) === 'object' && !Array.isArray(entity))
	{
		if (entity.hasOwnProperty('type') && entity.type === Types.VIRTUALCONTEXT &&
			entity.hasOwnProperty('id') && entity.hasOwnProperty('parent'))
		{
			isValid = true;
		}
	}

	return isValid;
}

VirtualContext.type = Types.VIRTUALCONTEXT;
VirtualContext.isValid = isValid;
module.exports = VirtualContext;
