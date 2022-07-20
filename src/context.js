/*
 * Copyright (c) 2016-present, IBM Research
 * Licensed under The MIT License [see LICENSE for details]
 */

import * as Types from "./types.js";
import Node from "./node.js";

export default class Context extends Node {
    /** Constructs a new context object.
     *
     * @param {string | null} [id] Some id string for this context. Deprecated: json object, which will deserialized as a Context; use `nodify()` instead.
     * @param {string | null} [parent] Parent id.
     */
    constructor(id = null, parent = null) {
        super(id, parent);
        /**
         *  Type of this link.
         *
         * @public
         * @type {string | null}
        */
        this.type = Types.CONTEXT;
    }
    /**
     * Serializes this context to a plain json object.
     *
     * @returns {Object.<string,Any>} a plain json object with recursively serialized fields.
     */
    serialize() {
        let context = {
            id: this.id,
            type: Types.CONTEXT,
            parent: this.parent || null
        };
        if (this.properties) {
            context.properties = this.serializeProperties();
        }
        if (this.metaProperties) {
            context.metaProperties = this.serializeMetaProperties();
        }
        if (this.interfaces) {
            context.interfaces = {};
            for (let k in this.interfaces) {
                context.interfaces[k] = JSON.parse(JSON.stringify(this.interfaces[k])); // Lazy job
            }
        }
        return context;
    }
    /**
     * Tests whether `entity` is a context structurally.
     *
     * @param {Object} entity The entity to be tested.
     * @returns {boolean} Returns `true` if valid; `false` otherwise.
     *
     */
    static isValid(entity) {
        let isValid = false;
        if (entity && typeof (entity) === 'object' && !Array.isArray(entity)) {
            if (entity.hasOwnProperty('type') && entity.type === Types.CONTEXT &&
                entity.hasOwnProperty('id') && entity.hasOwnProperty('parent')) {
                isValid = true;
            }
        }
        return isValid;
    }
}
Context.type = Types.CONTEXT;
const isValid = Context.isValid;
