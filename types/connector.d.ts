/**
* Copyright (c) 2016-present, IBM Research
* Licensed under The MIT License [see LICENSE for details]
*/
export = Connector;
declare class Connector extends HKEntity {
    /**
     * Tests whether `entity` is a connector structurally.
     *
     * @param {Object} node The entity to be tested.
     * @returns {boolean} Returns `true` if valid; `false` otherwise.
     *
     */
    static isValid(entity: any): boolean;
    /**
     * Creates a new instance of Connector.
     *
     * @param {String | null} id Id of the connector that will be used as the predicate in links (e.g. frinendOf, instanceOf, etc). Deprecated: can be a json object that will be deserialized as a connector.
     * @param {String | null} className One of the contants in `connectorclass.js`.
     * @param {Object.<String,String>} roles A map from role names to values in `RoleType`.
     *
     */
    constructor(id?: string | null, className?: string | null, roles?: any, ...args: any[]);
    /**
     *  Type of this entity.
     *
     * @public
     * @type {string | null}
    */
    public type: string | null;
    id: any;
    className: any;
    roles: any;
    /**
     * Adds a new role to this connector.
     *
     * @param {string} role Name of the role.
     * @param {string} type Values in `RoleType`.
     *
     * @returns {void}
     */
    addRole(role: string, type?: string): void;
    /**
     * Tests whether `role` is a role in this connector.
     *
     * @param {string} role Name of the role to be tested.
     * @returns {boolean} Returns `true` if role exists; `false` otherwise.
     */
    hasRole(role: string): boolean;
    /**
     * Returns the type of `role`, if it exists.
     *
     * @param {string} role The name of the role.
     * @returns {string} One of the values in `RoleType`. Returns `null` if `role` is not present.
     */
    getRoleType(role: string): string;
    /**
     * Sets the type of a given role. If the role does not exist in this connector, then ignores.
     *
     * @param {string} role Name of the role.
     * @param {string} type One of the values in `RoleType`.
     *
     * @returns {voio}
     */
    setRoleType(role: string, type: string): voio;
    /**
     * Returns a Array of role names.
     *
     * @returns {Array<String>} an array of string with role names.
     */
    getRoles(): Array<string>;
    /**
     * Serializes this connector to a plain json object.
     *
     * @returns {Object.<String,Any>} a plain json object with recursively serialized fields.
     */
    serialize(): any;
}
declare namespace Connector {
    const type: string;
}
import HKEntity = require("./hkentity");
