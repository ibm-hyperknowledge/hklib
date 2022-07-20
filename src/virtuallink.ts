/*
 * Copyright (c) 2016-present, IBM Research
 * Licensed under The MIT License [see LICENSE for details]
 */

import { VIRTUAL_LINK as VIRTUAL_LINK_TYPE } from "./types.js";
import Link from "./link.js";

class VirtualLink extends Link {
  constructor(id: any, parent?: string) {
    super(id, parent);
    this.type = VIRTUAL_LINK_TYPE;
  }

  static isValid(entity: VirtualLink) {
    let isValid = false;
    if (entity && typeof (entity) === 'object' && !Array.isArray(entity)) {
      if (entity.hasOwnProperty('type') && entity.type === VIRTUAL_LINK_TYPE &&
        entity.hasOwnProperty('id') && entity.hasOwnProperty('parent') &&
        entity.properties !== undefined) {
        isValid = true;
      }
    }

    return isValid;
  }
}

export default VirtualLink;