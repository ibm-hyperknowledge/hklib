/*
 * Copyright (c) 2016-present, IBM Research
 * Licensed under The MIT License [see LICENSE for details]
 */

"use strict";

const Types = require("./types");
const HKEntity = require("./hkentity");
const Constants = require("./constants");

function Link(id, connector, parent)
{
	if (arguments[0] && typeof arguments[0] === "object")
	{
		let link = arguments[0];
		this.id = link.id || null;
		this.connector = link.connector || null;
		this.parent = link.parent || null;

		if (link.binds)
		{
			this.binds = link.binds;
		}
		else
		{
			this.binds = {};
		}

		if (link.properties)
		{
			this.properties = link.properties;
		}
		if (link.metaProperties)
		{
			this.metaProperties = link.metaProperties;
		}
	}
	else
	{
		this.id = id || null;
		this.connector = connector || null;
		this.parent = parent || null;
		this.binds = {};
	}
	this.type = Types.LINK;
}

Link.prototype = Object.create(HKEntity.prototype);
Link.prototype.constructor = Link;

Link.prototype.addBind = function(role, componentId, anchor = Constants.LAMBDA)
{
	if (!this.binds.hasOwnProperty(role))
	{
		this.binds[role] = {};
	}

	if (!this.binds[role].hasOwnProperty(componentId))
	{
		this.binds[role][componentId] = [];
	}

	this.binds[role][componentId].push(anchor);
}

Link.prototype.forEachBind = function(callback = () => {})
{
    for (let role in this.binds)
    {
        let boundComponents = this.binds[role];
        for (let component in boundComponents)
        {
            let anchors = boundComponents[component];
            for (let i = 0; i < anchors.length; i++)
            {
                callback(role, component, anchors[i]);
            }
        }
    }
}


function _crossBind(self, roles, idx, vetor, withAnchors, callback)
{
    if(idx < roles.length)
    {
        let binds = self.binds[roles[idx]];

        for(let k in binds)
        {
            vetor[idx] = k;
            _crossBind(self, roles, idx + 1, vetor, withAnchors, callback);
        }
    }
    else
    {
        callback.apply(this, vetor);
    }
}

Link.prototype.forEachCrossBind = function(roles, callback = ()=>{})
{

    if(!(roles && Array.isArray(roles)))
    {
        callback([]);
        return;
    }

    if(roles.length === 0)
    {
        callback([]);
        return;
    }

    let array = new Array(roles.length);

    // console.log(array);
    _crossBind(this, roles, 0, array, false, callback);
}

Link.prototype.hasBinds = function(bindObject) // {role_1: entityId_1, role_2: entityId_2}
{
    let hasAllBinds = true;

    for(let role in bindObject)
    {
        if(bindObject.hasOwnProperty(role))
        {
            let component = bindObject[role];

            if(this.binds.hasOwnProperty(role))
            {
                let boundsComponents = this.binds[role];
                if(boundsComponents.hasOwnProperty(component))
                {
                    continue;
                }
            }

            hasAllBinds = false;
            break;
        }
    }
    return hasAllBinds;
}

Link.prototype.getRoles = function()
{
    if(this.binds)
    {
        return Object.keys(this.binds);
    }
    return [];
}

Link.prototype.removeBind = function(component, anchor = null)
{
    let dirtyRoles = new Set();
    for (let role in this.binds)
    {
        let boundComponents = this.binds[role];

        if(boundComponents.hasOwnProperty(component))
        {
            if(!anchor)
            {
                dirtyRoles.add(role);
                delete boundComponents[component];
            }
            else
            {
                let bounds = boundComponents[component];
                let idx = bounds.indexOf(anchor);
                if(idx >= 0)
                {
                    dirtyRoles.add(role);
                    bounds.splice(idx, 1);

                    if(Object.keys(boundComponents[component]).length === 0)
                    {
                        delete boundComponents[component];
                    }
                }
            }
        }
    }

    for(let k of dirtyRoles)
    {
        if(Object.keys(this.binds[k]).length === 0)
        {
            delete this.binds[k];
        }
    }

}

Link.prototype.serialize = function()
{
	let link = {
		id: this.id,
		type: Types.LINK,
		parent: this.parent || null,
		connector: this.connector,
		binds: this.binds
	};


	if (this.properties)
	{
		link.properties = this.serializeProperties();
	}

	if (this.metaProperties)
	{
		link.metaProperties = this.serializeMetaProperties();
	}

	return link;
}


function isValid(entity)
{
	if (entity && typeof(entity) === 'object' && !Array.isArray(entity))
	{
		if (entity.hasOwnProperty('type') &&
			entity.type === Types.LINK &&
			entity.hasOwnProperty('id') &&
			entity.hasOwnProperty('parent') &&
			entity.hasOwnProperty('connector') &&
			entity.hasOwnProperty('binds') &&
			typeof(entity.binds) === 'object')
		{
			return true;
		}
	}

	return false;
}

Link.type = Types.LINK;
Link.isValid = isValid;
module.exports = Link;
