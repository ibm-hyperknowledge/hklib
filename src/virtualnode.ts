/*
 * Copyright (c) 2016-present, IBM Research
 * Licensed under The MIT License [see LICENSE for details]
 */

import { VIRTUAL_NODE as VIRTUAL_NODE_TYPE } from "./types.js";
import Node from "./node.js";

export default class VirtualNode extends Node {
  constructor(id: any, parent?: string) {
    super(id, parent);
    this.type = VIRTUAL_NODE_TYPE;
  }

  static isValid(entity: VirtualNode) {
    let isValid = false;
    if (entity && typeof (entity) === 'object' && !Array.isArray(entity)) {
      if (entity.hasOwnProperty('type') && entity.type === VIRTUAL_NODE_TYPE &&
        entity.hasOwnProperty('id') && entity.hasOwnProperty('parent') &&
        entity.properties !== undefined) {
        isValid = true;
      }
    }

    return isValid;
  }
}