"use strict";
/*
 * Copyright (c) 2016-present, IBM Research
 * Licensed under The MIT License [see LICENSE for details]
 */
const tslib_1 = require("tslib");
const types_1 = require("./types");
const link_1 = tslib_1.__importDefault(require("./link"));
class VirtualLink extends link_1.default {
    constructor(id, parent) {
        super(id, parent);
        this.type = types_1.VIRTUAL_LINK;
    }
    static isValid(entity) {
        let isValid = false;
        if (entity && typeof (entity) === 'object' && !Array.isArray(entity)) {
            if (entity.hasOwnProperty('type') && entity.type === types_1.VIRTUAL_LINK &&
                entity.hasOwnProperty('id') && entity.hasOwnProperty('parent') &&
                entity.properties !== undefined) {
                isValid = true;
            }
        }
        return isValid;
    }
}
module.exports = VirtualLink;
