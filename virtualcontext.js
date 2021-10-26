/*
 * Copyright (c) 2016-present, IBM Research
 * Licensed under The MIT License [see LICENSE for details]
 */

"use strict";

const Types = require("./types");
const HKEntity = require("./hkentity");
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

function isValid(entity)
{
	let isValid = false;
	if (entity && typeof(entity) === 'object' && !Array.isArray(entity))
	{
		if (entity.hasOwnProperty('type') && entity.type === Types.VIRTUALCONTEXT &&
			entity.hasOwnProperty('id') && entity.hasOwnProperty('parent') &&
			entity.hasOwnProperty('endpoint'))
		{
			isValid = true;
		}
	}

	return isValid;
}

VirtualContext.type = Types.VIRTUALCONTEXT;
VirtualContext.isValid = isValid;
module.exports = VirtualContext;
