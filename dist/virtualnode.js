"use strict";
/*
 * Copyright (c) 2016-present, IBM Research
 * Licensed under The MIT License [see LICENSE for details]
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.VirtualNode = void 0;
const tslib_1 = require("tslib");
const types_1 = require("./types");
const node_1 = (0, tslib_1.__importDefault)(require("./node"));
class VirtualNode extends node_1.default {
    constructor(id, parent) {
        super(id, parent);
        this.type = types_1.VIRTUAL_NODE;
    }
    static isValid(entity) {
        let isValid = false;
        if (entity && typeof (entity) === 'object' && !Array.isArray(entity)) {
            if (entity.hasOwnProperty('type') && entity.type === types_1.VIRTUAL_NODE &&
                entity.hasOwnProperty('id') && entity.hasOwnProperty('parent') &&
                entity.properties !== undefined && entity.properties.hasOwnProperty('virtualsrc')) {
                isValid = true;
            }
        }
        return isValid;
    }
}
exports.VirtualNode = VirtualNode;
