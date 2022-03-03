"use strict";
/*
 * Copyright (c) 2016-present, IBM Research
 * Licensed under The MIT License [see LICENSE for details]
 */
const tslib_1 = require("tslib");
const types_1 = require("./types");
const context_1 = (0, tslib_1.__importDefault)(require("./context"));
class VirtualContext extends context_1.default {
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
}
module.exports = VirtualContext;
