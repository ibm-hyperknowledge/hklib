/**
* Copyright (c) 2016-present, IBM Research
* Licensed under The MIT License [see LICENSE for details]
*/
export = Link;
declare class Link extends HKEntity {
    /**
     * Tests whether `entity` is a link structurally.
     *
     * @param {Object} entity The entity to be tested.
     * @returns {booelan} Returns `true` if valid; `false` otherwise.
     *
     */
    static isValid(entity: Object): booelan;
    /** Constructs a new link object.
     *
     * @param {String | null} [id] Some id string for this link. Deprecated: json object, which will deserialized as a Link.
     * @param {String | null} [connector] Connector id string for this link.
     * @param {String | null} [parent] Parent id.
     */
    constructor(id?: string | null | undefined, connector?: string | null | undefined, parent?: string | null | undefined, ...args: any[]);
    /**
      * Id of this link. Might be null.
      *
      * @public
      * @type {String | null}
      *
      */
    public id: string | null;
    /**
      * Connector id for this link. Might be null.
      *
      * @public
      * @type {String | null}
      *
      */
    public connector: string | null;
    /**
     * Parent id. Might be null.
     *
     * @public
     * @type {String | null}
     *
     */
    public parent: string | null;
    /**
     *  Type of this link.
     *
     * @public
     * @type {String | null}
    */
    public type: string | null;
    /**
     * Interface attributed to this node.
     *
     * @public
     * @type {Object.<String, Object.<String, Object>>}
     */
    public binds: any;
    /**
     * Adds a new bind to this role;
     *
     * @param {String} role Role o be used to this bind.
     * @param {String} componentId Id of the object being linked.
     * @param {String} [anchor] Anchors name, or Constants.LAMBDA.
     *
     * @returns {void}
     */
    addBind(role: string, componentId: string, anchor?: string | undefined): void;
    forEachBind(callback?: () => void): void;
    forEachCrossBind(roles: any, callback?: () => void): void;
    hasBinds(bindObject: any): boolean;
    /**
     * Returns a Array of roles present in this link.
     *
     * @returns {Array<String>} an array of string with role names.
     */
    getRoles(): Array<string>;
    /** Removes a bind to a component + anchor.
     *
     * @param {String} component Component id.
     * @param {String} [anchor] Anchor name.
     *
     * @returns {void}
     */
    removeBind(component: string, anchor?: string | undefined): void;
    /**
     * Serializes this link to a plain json object.
     *
     * @returns {Object.<String,Any>} a plain json object with recursively serialized fields.
     */
    serialize(): any;
}
declare namespace Link {
    const type: string;
}
import HKEntity = require("./hkentity");
