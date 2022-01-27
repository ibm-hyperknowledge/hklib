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
     * @returns {Array<HKNode> | Array<Object>} An array of node instances if `serialize = false`; an array of json objects otherwise.
     */
    static nodefy(data: Object | Array<Object>, serialize: boolean): Array<HKNode> | Array<Object>;
    /** Constructs a new node object. Both `id` and `parent` are optional.
     *
     * @param {String | null} [id] Some id string for this node. Deprecated: json object, which will deserialized as a Node; use `nodify()` instead.
     * @param {String | null} [parent] Parent id.
     */
    constructor(id?: string | null | undefined, parent?: string | null | undefined, ...args: any[]);
    /**
     *
     * Id of this node. Might be null.
     *
     * @public
     * @type {String | null}
     *
     */
    public id: string | null;
    /**
     * Parent id. Might be null.
     *
     * @public
     * @type {String | null}
     *
     */
    public parent: string | null;
    /**
     *  Type of this node.
     *
     * @public
     * @type {String | null}
    */
    public type: string | null;
    /**
     * Interface attributed to this node.
     *
     * @public
     * @type {Object.<String,{type : String, properties : Object.<String, Object>}>}
     */
    public interfaces: any;
    /**
     *
     * @param {String} key Id of the interface
     * @param {String} type Type of the interface (anchor, etc)
     * @param {Object.<String,Object>} properties Properties for the interface
     *
     * @return {void}
     */
    addInterface(key: string, type: string, properties: any): void;
    /**
     * Serializes this node to a plain json object.
     *
     * @returns {Object.<String,Any>} a plain json object with recursively serialized fields.
     */
    serialize(): any;
}
declare namespace Node {
    const type: string;
}
import HKEntity = require("./hkentity");
