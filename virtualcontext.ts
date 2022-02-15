/*
 * Copyright (c) 2016-present, IBM Research
 * Licensed under The MIT License [see LICENSE for details]
 */

import { VIRTUAL_CONTEXT as VIRTUAL_CONTEXT_TYPE } from "./types";
import Context from "./context";

export class VirtualContext extends Context {
  type: string
  constructor(id: any, virtualSrc: string, parent?: string) {
    super(id, parent);

    const properties = { "readonly": true, "virtualsrc": virtualSrc };
    const metaProperties = { "readonly": "<http://www.w3.org/2001/XMLSchema#boolean>" };


    this.properties = Object.assign(this.properties, properties);


    if (this.metaProperties) {
      this.metaProperties = Object.assign(this.metaProperties, metaProperties);
    }
    else {
      this.metaProperties = metaProperties;
    }
    this.type = VIRTUAL_CONTEXT_TYPE;

  }

  static isValid(entity: VirtualContext) {
    let isValid = false;
    if (entity && typeof (entity) === 'object' && !Array.isArray(entity)) {
      if (entity.hasOwnProperty('type') && entity.type === VIRTUAL_CONTEXT_TYPE &&
        entity.hasOwnProperty('id') && entity.hasOwnProperty('parent') &&
        entity.properties !== undefined && entity.properties.hasOwnProperty('virtualsrc')) {
        isValid = true;
      }
    }

    return isValid;
  }
}