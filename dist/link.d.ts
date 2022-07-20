/**
* Copyright (c) 2016-present, IBM Research
* Licensed under The MIT License [see LICENSE for details]
*/
export default Link;
declare class Link extends HKEntity {
    /**
     * Tests whether `entity` is a link structurally.
     *
     * @param {Object} entity The entity to be tested.
     * @returns {boolean} Returns `true` if valid; `false` otherwise.
     *
     */
    static isValid(entity: Object): boolean;
    /** Constructs a new link object.
     *
     * @param {string | null} [id] Some id string for this link. Deprecated: json object, which will deserialized as a Link.
     * @param {string | null} [connector] Connector id string for this link.
     * @param {string | null} [parent] Parent id.
     */
    constructor(id?: string | null | undefined, connector?: string | null | undefined, parent?: string | null | undefined, ...args: any[]);
    /**
      * Id of this link. Might be null.
      *
      * @public
      * @type {string | null}
      *
      */
    public id: string | null;
    /**
      * Connector id for this link. Might be null.
      *
      * @public
      * @type {string | null}
      *
      */
    public connector: string | null;
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
     * @type {Object.<string, Object.<string, Object>>}
     */
    public binds: {
        [x: string]: {
            [x: string]: Object;
        };
    };
    /**
     * Adds a new bind to this role;
     *
     * @param {string} role Role o be used to this bind.
     * @param {string} componentId Id of the object being linked.
     * @param {string} [anchor] Anchors name, or Constants.LAMBDA.
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
     * @returns {Array<string>} an array of string with role names.
     */
    getRoles(): Array<string>;
    /** Removes a bind to a component + anchor.
     *
     * @param {string} component Component id.
     * @param {string} [anchor] Anchor name.
     *
     * @returns {void}
     */
    removeBind(component: string, anchor?: string | undefined): void;
    /**
     * Serializes this link to a plain json object.
     *
     * @returns {Object.<string,any>} a plain json object with recursively serialized fields.
     */
    serialize(): {
        [x: string]: any;
    };
}
declare namespace Link {
    const type: string;
}
import HKEntity from "./hkentity.js";
