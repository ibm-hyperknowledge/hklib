/*
 * Copyright (c) 2016-present, IBM Research
 * Licensed under The MIT License [see LICENSE for details]
 */
"use strict";
export const NODE = 'node';
export const CONTEXT = 'context';
export const LINK = 'link';
export const CONNECTOR = 'connector';
export const REFERENCE = 'ref';
export const INTERFACE = 'interface';
export const BIND = 'bind';
export const TRAIL = 'trail';
export const VIRTUAL_NODE = 'virtualnode';
export const VIRTUAL_CONTEXT = 'virtualcontext';
export const VIRTUAL_LINK = 'virtuallink';
export const VIRTUAL_SOURCE_PROPERTY = "virtualsrc";
export const isValidType = function (type) {
    for (let key in exports) {
        if (exports[key] === type) {
            return true;
        }
    }
    return false;
};
