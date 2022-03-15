/*
 * Copyright (c) 2016-present, IBM Research
 * Licensed under The MIT License [see LICENSE for details]
 */

import { VIRTUAL_CONTEXT as VIRTUAL_CONTEXT_TYPE } from "./types";
import Context from "./context";

export = VirtualContext;
class VirtualContext extends Context {
  /** Constructs a new virtual context object. 
   * 
   * @param {string | null} [id] Some id string for this entity.
   * @param {string | null} [virtualSrc] Virtual endpoint to acceess information
   * @param {string | null} [parent] Parent id.
   */
  constructor(id: any, virtualSrc: string, parent?: string) {
    super(id, parent);

    const properties = { "readonly": true, "virtualsrc": virtualSrc };
    const metaProperties = { "readonly": "<http://www.w3.org/2001/XMLSchema#boolean>" };

    this.properties = Object.assign(this.properties, properties);
    this.metaProperties = Object.assign(this.metaProperties, metaProperties);

    this.type = VIRTUAL_CONTEXT_TYPE;
  }

  static isValid(entity: VirtualContext) {
    let isValid = false;
    if (entity && typeof (entity) === 'object' && !Array.isArray(entity)) {
      if (entity.hasOwnProperty('type') && entity.type === VIRTUAL_CONTEXT_TYPE &&
        entity.hasOwnProperty('id') && entity.hasOwnProperty('parent')) {
        isValid = true;
      }
    }

    return isValid;
  }

  setOrAppendToProperty(property: string, value: Object, metaProperty?: string | undefined): void {
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

VirtualContext.type = VIRTUAL_CONTEXT_TYPE;
