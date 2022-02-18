/*
 * Copyright (c) 2016-present, IBM Research
 * Licensed under The MIT License [see LICENSE for details]
 */

import { VIRTUAL_NODE as VIRTUAL_NODE_TYPE } from "./types";
import Node from "./node";

export = VirtualNode;
class VirtualNode extends Node {
  type: string
  constructor(id: any, parent?: string) {
    super(id, parent);
    this.type = VIRTUAL_NODE_TYPE;
  }

  static isValid(entity: VirtualNode) {
    let isValid = false;
    if (entity && typeof (entity) === 'object' && !Array.isArray(entity)) {
      if (entity.hasOwnProperty('type') && entity.type === VIRTUAL_NODE_TYPE &&
        entity.hasOwnProperty('id') && entity.hasOwnProperty('parent') &&
        entity.properties !== undefined && entity.properties.hasOwnProperty('virtualsrc')) {
        isValid = true;
      }
    }

    return isValid;
  }
}