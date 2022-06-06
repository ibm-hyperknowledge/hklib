/*
 * Copyright (c) 2016-present, IBM Research
 * Licensed under The MIT License [see LICENSE for details]
 */
"use strict";
const Types = require("./types");
const Node = require("./node");
class Reference extends Node {
    /** Constructs a new reference node object.
     *
     * @param {string | null} [id] Some if string for this node. Deprecated: json object, which will deserialized as a Reference;
     * @param {string | null} [refId] Id of the referenced entity.
     * @param {string | null} [parent] optional parent id.
     */
    constructor(id = null, refId = null, parent = null) {
        super(id, parent);
        this.serialize = function () {
            let ref = {
                id: this.id,
                type: Types.REFERENCE,
                ref: this.ref,
                parent: this.parent || null
            };
            if (this.properties) {
                ref.properties = this.serializeProperties();
            }
            if (this.metaProperties) {
                ref.metaProperties = this.serializeMetaProperties();
            }
            return ref;
        };
        /**
         *
         * Id of referenced entity. Might be null.
         *
         * @public
         * @type {string | null}
         *
         */
        this.ref = refId;
        this.type = Types.REFERENCE;
        if (arguments[0] && typeof arguments[0] === "object") {
            let ref = arguments[0];
            this.ref = ref.ref || null;
        }
    }
    /**
     * Tests whether `entity` is a reference node structurally.
     *
     * @param {Object} ref The entity to be tested.
     * @returns {boolean} Returns `true` if valid; `false` otherwise.
     *
     */
    static isValid(ref) {
        let isValid = false;
        if (ref && typeof (ref) === 'object' && !Array.isArray(ref)) {
            if (ref.hasOwnProperty('type') && ref.type === Types.REFERENCE &&
                ref.hasOwnProperty('id') && ref.hasOwnProperty('parent') &&
                ref.hasOwnProperty('ref')) {
                isValid = true;
            }
        }
        return isValid;
    }
}
Reference.type = Types.REFERENCE;
const isValid = Reference.isValid;
module.exports = Reference;
