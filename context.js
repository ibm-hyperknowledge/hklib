/*
 * Copyright (c) 2016-present, IBM Research
 * Licensed under The MIT License [see LICENSE for details]
 */

"use strict";

const Types = require("./types");
const HKEntity = require("./hkentity");

function Context(id, parent)
{
	if (arguments[0] && typeof arguments[0] === "object")
	{
		let context = arguments[0];
		this.id = context.id || null;
		this.parent = context.parent || null;
		if (context.properties)
		{
			this.properties = context.properties;
		}
		if (context.metaProperties)
		{
			this.metaProperties = context.metaProperties;
		}
	}
	else
	{
		this.id = id || null;
		this.parent = parent || null;
	}
	this.type = Types.CONTEXT;
}

Context.prototype = Object.create(HKEntity.prototype);
Context.prototype.constructor = Context;

Context.prototype.serialize = function()
{
	let context = {
		id: this.id,
		type: Types.CONTEXT,
		parent: this.parent || null
	}

	if (this.properties)
	{
		context.properties = this.serializeProperties();
	}

	if (this.metaProperties)
	{
		context.metaProperties = this.serializeMetaProperties();
	}


	return context;
}

function isValid(entity)
{
	let isValid = false;
	if (entity && typeof(entity) === 'object' && !Array.isArray(entity))
	{
		if (entity.hasOwnProperty('type') && entity.type === Types.CONTEXT &&
			entity.hasOwnProperty('id') && entity.hasOwnProperty('parent'))
		{
			isValid = true;
		}
	}

	return isValid;
}


Context.type = Types.CONTEXT;
Context.isValid = isValid;
module.exports = Context;
