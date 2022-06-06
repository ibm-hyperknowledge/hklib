/*
 * Copyright (c) 2016-present, IBM Research
 * Licensed under The MIT License [see LICENSE for details]
 */
"use strict";
const Types = require("./types");
const Node = require("./node");
const VirtualNode = require("./virtualnode");
const Context = require("./context");
const VirtualContext = require("./virtualcontext");
const VirtualLink = require("./virtuallink");
const Connector = require("./connector");
const Reference = require("./reference");
const Link = require("./link");
const Trail = require("./trail");
const HKEntity = require("./hkentity");
function _deserialize(input) {
    if (!input || !input.type) {
        return null;
    }
    switch (input.type) {
        case Types.NODE:
            return new Node(input);
        case Types.VIRTUAL_NODE:
            return new VirtualNode(input);
        case Context.type:
            return new Context(input);
        case Types.VIRTUAL_CONTEXT:
            if (input.properties !== undefined && input.properties.virtualsrc !== undefined)
                return new VirtualContext(input, input.properties.virtualsrc);
            return new VirtualContext(input);
        case Types.LINK:
            return new Link(input);
        case Types.VIRTUAL_LINK:
            return new VirtualLink(input);
        case Types.REFERENCE:
            return new Reference(input);
        case Types.CONNECTOR:
            return new Connector(input);
        case Types.TRAIL:
            return new Trail(input);
        default:
            return null;
    }
}
/**
 * Deserialize objects to create HKEntity instances.
 *
 * @param {Object | Array<Object>} serialized an object or an array of objects to create Hyperknowledge entities.
 * @returns {HKEntity | Array<HKEntity> | null} An entity or an array of entities that are instance of HKEntity. Or returns null if the input is not valid.
 */
function deserialize(serialized) {
    if (typeof serialized === "string") {
        serialized = JSON.parse(serialized);
    }
    if (Array.isArray(serialized)) {
        let out = [];
        for (let i = 0; i < serialized.length; i++) {
            let e = _deserialize(serialized[i]);
            if (e) {
                out.push(e);
            }
        }
        return out;
    }
    else if (typeof serialized === "object") {
        return _deserialize(serialized);
    }
    return null;
}
module.exports = deserialize;
