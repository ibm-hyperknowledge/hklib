"use strict";
/*
 * Copyright (c) 2016-present, IBM Research
 * Licensed under The MIT License [see LICENSE for details]
 */
const tslib_1 = require("tslib");
const types_1 = require("./types");
const context_1 = tslib_1.__importDefault(require("./context"));
class VirtualContext extends context_1.default {
    /** Constructs a new virtual context object.
     *
     * @param {any} [id] Some id string for this entity.
     * @param {string | null} [virtualSrc] Virtual endpoint to acceess information
     * @param {string | null} [parent] Parent id.
     */
    constructor(id, virtualSrc, parent) {
        super(id, parent);
        const properties = { "readonly": true, "virtualsrc": virtualSrc };
        const metaProperties = { "readonly": "<http://www.w3.org/2001/XMLSchema#boolean>" };
        this.properties = Object.assign(this.properties, properties);
        this.metaProperties = Object.assign(this.metaProperties, metaProperties);
        this.type = types_1.VIRTUAL_CONTEXT;
    }
    static isValid(entity) {
        let isValid = false;
        if (entity && typeof (entity) === 'object' && !Array.isArray(entity)) {
            if (entity.hasOwnProperty('type') && entity.type === types_1.VIRTUAL_CONTEXT &&
                entity.hasOwnProperty('id') && entity.hasOwnProperty('parent')) {
                isValid = true;
            }
        }
        return isValid;
    }
    setOrAppendToProperty(property, value, metaProperty) {
        if (this.hasProperty(property)) {
            if (property === "virtualsrc" || property === "readonly") {
                this.properties[property] = value;
            }
            else {
                this.appendToProperty(property, value, metaProperty);
            }
        }
        else {
            this.setProperty(property, value, metaProperty);
        }
    }
}
VirtualContext.type = types_1.VIRTUAL_CONTEXT;
module.exports = VirtualContext;
