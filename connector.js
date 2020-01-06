/*
 * Copyright (c) 2016-present, IBM Research
 * Licensed under The MIT License [see LICENSE for details]
 */

"use strict";

const Types 		= require("./types");
const HKEntity 		= require("./hkentity");
const RoleType 		= require("./roletypes");

function Connector(id, className, roles)
{
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

Connector.prototype = Object.create(HKEntity.prototype);
Connector.prototype.constructor = Connector;

Connector.prototype.addRole = function(role, type = RoleType.NONE)
{
    if(!role.hasOwnProperty(role))
    {
        this.roles[role] = type;
    }
}


Connector.prototype.hasRole = function(role)
{
    return this.roles.hasOwnProperty(role);
}

Connector.prototype.getRoleType = function(role)
{
    return this.roles[role] || null;
}

Connector.prototype.setRoleType = function(role, type)
{
    if(this.roles.hasOwnProperty(role))
    {
        this.roles[role] = type;
    }
}

Connector.prototype.getRoles = function()
{
    return Object.keys(this.roles);
}

Connector.prototype.serialize = function()
{
	let connector = {
		id: this.id,
		type: Types.CONNECTOR,
		className: this.className,
		roles: this.roles
	}
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

function isValid(entity)
{

	let isValid = false;
	if (entity && typeof(entity) === 'object' && !Array.isArray(entity))
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

Connector.type = Types.CONNECTOR;
Connector.isValid = isValid;

module.exports = Connector;
