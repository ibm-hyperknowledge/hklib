/**
* Copyright (c) 2016-present, IBM Research
* Licensed under The MIT License [see LICENSE for details]
*/
export = Node;
declare class Node extends HKEntity {
    /**
     * Tests whether `entity` is a node structurally.
     *
     * @param {Object} node The entity to be tested.
     * @returns {boolean} Returns `true` if valid; `false` otherwise.
     *
     */
    static isValid(node: Object): boolean;
    static entitify(data: any, setId?: boolean): {}[];
    /**
     * Tries to deserialize a json object, or a list of json objects, to node instances(s).
     *
     * Use `serialize` parameter to conver the output back to json objects. This feature can be used to normalize a json-object representation of hk nodes.
     *
     * @param {Object | Array<Object>} data Data to deserialize.
     * @param {boolean} serialize If `true`, reserialize the deserialized objects.
     * @returns {Array<Node> | Array<Object>} An array of node instances if `serialize = false`; an array of json objects otherwise.
     */
    static nodefy(data: Object | Array<Object>, serialize: boolean): Array<Node> | Array<Object>;
    /** Constructs a new node object. Both `id` and `parent` are optional.
     *
     * @param {string | null} [id] Some id string for this node. Deprecated: json object, which will deserialized as a Node; use `nodify()` instead.
     * @param {string | null} [parent] Parent id.
     */
    constructor(id?: string | null | undefined, parent?: string | null | undefined, ...args: any[]);
    /**
     *
     * Id of this node. Might be null.
     *
     * @public
     * @type {string | null}
     *
     */
    public id: string | null;
    /**
     * Parent id. Might be null.
     *
     * @public
     * @type {string | null}
     *
     */
    public parent: string | null;
    /**
     * Interface attributed to this node.
     *
     * @public
     * @type {Object.<string,{type : string, properties : Object.<string, Object>}>}
     */
    public interfaces: {
        [x: string]: {
            type: string;
            properties: {
                [x: string]: Object;
            };
        };
    };
    properties: any;
    metaProperties: any;
    /**
     *
     * @param {string} key Id of the interface
     * @param {string} type Type of the interface (anchor, etc)
     * @param {Object.<string,Object>} properties Properties for the interface
     *
     * @return {void}
     */
    addInterface(key: string, type: string, properties: {
        [x: string]: Object;
    }): void;
    /**
     * Serializes this node to a plain json object.
     *
     * @returns {Object.<string,any>} a plain json object with recursively serialized fields.
     */
    serialize(): {
        [x: string]: any;
    };
}
declare namespace Node {
    const type: string;
}
import HKEntity = require("./hkentity");
