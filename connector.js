/*
 * Copyright (c) 2016-present, IBM Research
 * Licensed under The MIT License [see LICENSE for details]
 */

"use strict";

const Types = require("./types");
const HKEntity = require("./hkentity");
const RoleType = require("./roletypes");

class Connector extends HKEntity
{
constructor(id, className, roles)
{
	super();
	if (arguments[0] && typeof arguments[0] === "object")
	{
		let connector = arguments[0];
		this.id = connector.id || null;
		this.className = connector.className || null;
		this.roles = connector.roles || {};
		if (connector.properties)
		{
			this.properties = connector.properties;
		}
		if (connector.metaProperties)
		{
			this.metaProperties = connector.metaProperties;
		}
	}
	else
	{
		this.id = id || null;
		this.className = className || null;
		this.roles = roles || {};
	}
	this.type = Types.CONNECTOR;
}

addRole(role, type = RoleType.NONE)
{
	if (!role.hasOwnProperty(role))
	{
		this.roles[role] = type;
	}
}

hasRole(role)
{
	return this.roles.hasOwnProperty(role);
}

getRoleType(role)
{
	return this.roles[role] || null;
}

setRoleType(role, type)
{
	if (this.roles.hasOwnProperty(role))
	{
		this.roles[role] = type;
	}
}

getRoles()
{
	return Object.keys(this.roles);
}

serialize()
{
	let connector = {
		id: this.id,
		type: Types.CONNECTOR,
		className: this.className,
		roles: this.roles
	};
	if (this.properties)
	{
		connector.properties = this.serializeProperties();
	}
	if (this.metaProperties)
	{
		connector.metaProperties = this.serializeMetaProperties();
	}
	return connector;
}

static isValid(entity)
{

	let isValid = false;
	if (entity && typeof (entity) === 'object' && !Array.isArray(entity))
	{
		if (entity.hasOwnProperty('type') &&
			entity.type === Types.CONNECTOR &&
			entity.hasOwnProperty('id') &&
			entity.hasOwnProperty('className') &&
			entity.hasOwnProperty('roles'))
		{
			isValid = true;
		}
	}
	return isValid;
}

}

Connector.type = Types.CONNECTOR;
const isValid = Connector.isValid
module.exports = Connector;
