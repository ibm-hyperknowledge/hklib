/*
 * Copyright (c) 2016-present, IBM Research
 * Licensed under The MIT License [see LICENSE for details]
 */

import * as Types from "./types.js";
import Node from "./node.js";
import * as VirtualNode from "./virtualnode.js";
import Context from "./context.js";
import * as VirtualContext from "./virtualcontext.js";
import * as VirtualLink from "./virtuallink.js";
import Connector from "./connector.js";
import Reference from "./reference.js";
import Link from "./link.js";
import Trail from "./trail.js";
import HKEntity from "./hkentity.js";

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
            return new VirtualContext(input.id, input.properties["virtualsrc"], input.properties["datasourcetype"], input.parent);
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
export default deserialize;
