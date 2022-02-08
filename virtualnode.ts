/*
 * Copyright (c) 2016-present, IBM Research
 * Licensed under The MIT License [see LICENSE for details]
 */

"use strict";

const Types = require("./types");
const Context = require("./context");

class VirtualContext extends Context
{
	constructor(id, virtualSrc = null, parent = null)
	{
		super(id, parent);

		const properties = { "readonly": true, "virtualsrc": virtualSrc };
    const metaProperties = { "readonly": "<http://www.w3.org/2001/XMLSchema#boolean>"};

    if (this.properties)
    {
      this.properties = Object.assign(this.properties, properties);
    }
    else
    {
      this.properties = properties;
    }

    if (this.metaProperties)
    {
      this.metaProperties = Object.assign(this.metaProperties, metaProperties);
    }
    else
    {
      this.metaProperties = metaProperties;
    }
	}

	static isValid(entity)
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
}

const isValid = VirtualContext.isValid
module.exports = VirtualContext;
