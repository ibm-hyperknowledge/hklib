/*
 * Copyright (c) 2016-present, IBM Research
 * Licensed under The MIT License [see LICENSE for details]
 */
"use strict";
exports.NODE = 'node';
exports.CONTEXT = 'context';
exports.LINK = 'link';
exports.CONNECTOR = 'connector';
exports.REFERENCE = 'ref';
exports.INTERFACE = 'interface';
exports.BIND = 'bind';
exports.TRAIL = 'trail';
exports.ACTION = 'action';
exports.VIRTUAL_NODE = 'virtualnode';
exports.VIRTUAL_CONTEXT = 'virtualcontext';
exports.VIRTUAL_LINK = 'virtuallink';
exports.VIRTUAL_SOURCE_PROPERTY = "virtualsrc";
exports.isValidType = function (type) {
    for (let key in exports) {
        if (exports[key] === type) {
            return true;
        }
    }
    return false;
};
