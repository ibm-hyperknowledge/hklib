/*
 * Copyright (c) 2016-present, IBM Research
 * Licensed under The MIT License [see LICENSE for details]
 */

"use strict";

const Types = require("./types");
const HKEntity = require("./hkentity");

class Node extends HKEntity
{
    /** Constructs a new node object. Both `id` and `parent` are optional.
     * 
     * @param {string | null} [id] Some id string for this node. Deprecated: json object, which will deserialized as a Node; use `nodify()` instead. 
     * @param {string | null} [parent] Parent id.
     */
    constructor(id = null, parent = null)
    {
        super();

        /** 
         * 
         * Id of this node. Might be null.
         * 
         * @public
         * @type {string | null}
         * 
         */
        this.id = id;

        /** 
         * Parent id. Might be null.
         * 
         * @public
         * @type {string | null}
         * 
         */
        this.parent = parent;

        /**
         *  Type of this node.
         * 
         * @public
         * @type {string | null}
        */
        this.type = Types.NODE;

        /**
         * Interface attributed to this node.
         * 
         * @public
         * @type {Object.<string,{type : string, properties : Object.<string, Object>}>}
         */
        this.interfaces = {};

        // TODO: this code seems to copy a node passed as an id. Create a separate clone/json-deserialize function for that.
        if (arguments[0] && typeof arguments[0] === "object")
        {
            let node = arguments[0];
            this.id = node.id || null;
            this.parent = node.parent || null;
            if (node.properties)
            {
                this.properties = node.properties;
            }
            if (node.metaProperties)
            {
                this.metaProperties = node.metaProperties;
            }
            if (node.interfaces)
            {
                this.interfaces = node.interfaces;
            }
        }
    }

    /**
     * 
     * @param {string} key Id of the interface
     * @param {string} type Type of the interface (anchor, etc)
     * @param {Object.<string,Object>} properties Properties for the interface  
     * 
     * @return {void}
     */
    addInterface(key, type, properties)
    {
        this.interfaces[key] = {
            type: type,
            properties: properties
        };
    }

    /**
     * Serializes this node to a plain json object.
     * 
     * @returns {Object.<string,Any>} a plain json object with recursively serialized fields. 
     */
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

    /**
     * Tests whether `entity` is a node structurally.
     * 
     * @param {Object} node The entity to be tested.
     * @returns {boolean} Returns `true` if valid; `false` otherwise.
     * 
     */
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
    /**
     * Tries to deserialize a json object, or a list of json objects, to node instances(s). 
     * 
     * Use `serialize` parameter to conver the output back to json objects. This feature can be used to normalize a json-object representation of hk nodes.
     * 
     * @param {Object | Array<Object>} data Data to deserialize. 
     * @param {boolean} serialize If `true`, reserialize the deserialized objects. 
     * @returns {Array<HKNode> | Array<Object>} An array of node instances if `serialize = false`; an array of json objects otherwise.
     */
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
const isValid = Node.isValid;
const nodefy = Node.nodefy;
const entitify = Node.entitify;
module.exports = Node;
