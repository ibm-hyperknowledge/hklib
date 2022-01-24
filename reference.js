/*
 * Copyright (c) 2016-present, IBM Research
 * Licensed under The MIT License [see LICENSE for details]
 */

"use strict";

const Types = require("./types");
const Node = require("./node");

class Reference extends Node
{

constructor(id, refId, parent)
{
  super(id, parent);
  if (arguments[0] && typeof arguments[0] === "object")
  {
    let ref = arguments[0];
    this.id = ref.id || null;
    this.ref = ref.ref || null;
    this.parent = ref.parent || null;
    if (ref.properties)
    {
      this.properties = ref.properties;
    }
    if (ref.metaProperties)
    {
      this.metaProperties = ref.metaProperties;
    }
  }
  else
  {
    this.id = id || null;
    this.ref = refId;
    this.parent = parent || null;
  }
  this.type = Types.REFERENCE;
}


serialize = function ()
{
  let ref =
  {
    id: this.id,
    type: Types.REFERENCE,
    ref: this.ref,
    parent: this.parent || null
  }

  if (this.properties)
  {
    ref.properties = this.serializeProperties();
  }

  if (this.metaProperties)
  {
    ref.metaProperties = this.serializeMetaProperties();
  }

  return ref;
}

static isValid(ref)
{
  let isValid = false;
  if (ref && typeof (ref) === 'object' && !Array.isArray(ref))
  {
    if (ref.hasOwnProperty('type') && ref.type === Types.REFERENCE &&
      ref.hasOwnProperty('id') && ref.hasOwnProperty('parent') &&
      ref.hasOwnProperty('ref'))
    {
      isValid = true;
    }
  }

  return isValid;
}
}

Reference.type       = Types.REFERENCE;
const isValid        = Reference.isValid;
module.exports       = Reference;
