/*
 * Copyright (c) 2016-present, IBM Research
 * Licensed under The MIT License [see LICENSE for details]
 */

"use strict";

const Types = require("./types");
const Node = require("./node");

class Context extends Node
{
    constructor(id, parent)
    {
        super(id, parent)
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
            if (context.interfaces)
            {
                this.interfaces = context.interfaces;
            }
        }

        else
        {
            this.id = id || null;
            this.parent = parent || null;
        }
        this.type = Types.CONTEXT;
    }

    addInterface(key, type, properties)
    {
        if (!this.interfaces)
        {
            this.interfaces = {};
        }

        this.interfaces[key] = {
            type: type,
            properties: properties
        };
    }

    serialize()
    {
        let context = {
            id: this.id,
            type: Types.CONTEXT,
            parent: this.parent || null
        };

        if (this.properties)
        {
            context.properties = this.serializeProperties();
        }

        if (this.metaProperties)
        {
            context.metaProperties = this.serializeMetaProperties();
        }

        if (this.interfaces)
        {
            context.interfaces = {};
            for (let k in this.interfaces)
            {
                context.interfaces[k] = JSON.parse(JSON.stringify(this.interfaces[k])); // Lazy job
            }
        }

        return context;
    }



    static isValid(entity)
    {
        let isValid = false;
        if (entity && typeof (entity) === 'object' && !Array.isArray(entity))
        {
            if (entity.hasOwnProperty('type') && entity.type === Types.CONTEXT &&
                entity.hasOwnProperty('id') && entity.hasOwnProperty('parent'))
            {
                isValid = true;
            }
        }

        return isValid;
    }

}

Context.type = Types.CONTEXT;
const isValid = Context.isValid;
module.exports = Context;
