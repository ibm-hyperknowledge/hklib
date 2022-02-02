/*
 * Copyright (c) 2016-present, IBM Research
 * Licensed under The MIT License [see LICENSE for details]
 */

"use strict";

const Types = require("./types");
const Node = require("./node");

class VirtualNode extends Node
{
  constructor({ id, virtualSrc, parent })
  {
    super(id, parent);
    const properties = { "virtualsrc": virtualSrc };
    const metaProperties = { "virtualsrc": virtualSrc };
    if (this.properties)
    {
      this.properties = Object.assign(this.properties, properties);
    }
    else
    {
      this.properties = properties;
    }
  }

  addInterface(key, type, properties)
  {
    if (!this.interfaces)
    {
      this.interfaces = {};
    }

    this.interfaces[key] = {
      type: type,
      properties: properties
    };
  }

  serialize()
  {
    let node = {
      id: this.id,
      type: Types.NODE,
      parent: this.parent || null
    };

    if (this.properties)
    {
      node.properties = this.serializeProperties();
    }

    if (this.metaProperties)
    {
      node.metaProperties = this.serializeMetaProperties();
    }

    if (this.interfaces)
    {
      node.interfaces = {};
      for (let k in this.interfaces)
      {
        node.interfaces[k] = JSON.parse(JSON.stringify(this.interfaces[k])); // Lazy job
      }
    }

    return node;
  }

  static isValid(node)
  {
    let isValid = false;
    if (node && typeof (node) === 'object' && !Array.isArray(node))
    {
      if (node.hasOwnProperty('type') && node.type === Types.NODE &&
        node.hasOwnProperty('id') && node.hasOwnProperty('parent'))
      {
        isValid = true;
      }
    }

    return isValid;
  }

  static entitify(data, setId = true)
  {
    if (!data)
    {
      return [];
    }

    if (!Array.isArray(data))
    {
      data = [data];
    }

    let out = [];
    for (let i = 0; i < data.length; i++)
    {
      let node = data[i];

      if (node.type !== Types.NODE)
      {
        continue;
      }

      let newObj = {};
      if (setId)
      {
        newObj.id = node.id;
      }

      node.foreachProperty((key, value) =>
      {
        newObj[key] = value;
      });

      out.push(newObj);
    }

    return out;
  }

  static nodefy(data, serialize)
  {
    if (!data)
    {
      return [];
    }
    if (!Array.isArray(data))
    {
      data = [data];
    }

    let out = [];
    for (let i = 0; i < data.length; i++)
    {
      let node = new Node();

      let entity = data[i];
      for (let k in entity)
      {
        let type = typeof entity[k];
        if (k === "id")
        {
          node.id = entity[k];
        }
        else if (type === "string" || type === "number")
        {
          node.setProperty(k, entity[k]);
        }
        else if (Array.isArray(entity[k]))
        {
          // I will think in this later...
          // for(let k in entity[k])
          // {

          // }
        }
        else if (type === "object")
        {
          let arr = nodefy(entity[k]);
          out = out.concat(arr);
        }
      }
      if (serialize)
      {
        node = node.serialize();
      }
      out.push(node);
    }
    return out;
  }
}

Node.type = Types.NODE;
const isValid = VirtualNode.isValid;
const nodefy = VirtualNode.nodefy;
const entitify = VirtualNode.entitify;
module.exports = VirtualNode;
