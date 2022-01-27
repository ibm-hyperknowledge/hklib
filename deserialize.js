/*
 * Copyright (c) 2016-present, IBM Research
 * Licensed under The MIT License [see LICENSE for details]
 */

"use strict";

const Node = require("./node");
const Context = require("./context");
const Connector = require("./connector");
const Reference = require("./reference");
const Link = require("./link");
const Trail = require("./trail");
const VirtualContext = require("./virtualcontext");
const HKEntity = require("./hkentity");

function _deserialize(input)
{
    if (!input || !input.type)
    {
        return null;
    }
    switch (input.type)
    {
        case Node.type:
            return new Node(input);
        case Context.type:
            if (input.properties !== undefined && input.properties.virtualsrc !== undefined) return new VirtualContext(input);
            return new Context(input);
        case Link.type:
            return new Link(input);
        case Reference.type:
            return new Reference(input);
        case Connector.type:
            return new Connector(input);
        case Trail.type:
            return new Trail(input);
        default:
            return null;
    }
}

/**
 * Deserialize objects to create instances of HKEntity
 *
 * @param {object} serialized an object or an array of objects to create Hyperknowledge entities
 * @returns {HKEntity | HKEntity[] | null} An entity or an array of entities that are instance of HKEntity. Or returns null if the input is not valid
 */
function deserialize(serialized)
{
    if (typeof serialized === "string")
    {
        serialized = JSON.parse(serialized);
    }

    if (Array.isArray(serialized))
    {
        let out = [];

        for (let i = 0; i < serialized.length; i++)
        {
            let e = _deserialize(serialized[i]);
            if (e)
            {
                out.push(e);
            }
        }
        return out;
    }
    else if (typeof serialized === "object")
    {
        return _deserialize(serialized);
    }
    return null;
}

module.exports = deserialize;
