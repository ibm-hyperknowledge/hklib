/*
 * Copyright (c) 2016-present, IBM Research
 * Licensed under The MIT License [see LICENSE for details]
 */
"use strict";
const Types = require("./types");
const HKEntity = require("./hkentity");
const RoleType = require("./roletypes");
class Connector extends HKEntity {
    /**
     * Creates a new instance of Connector.
     *
     * @param {string | null} id Id of the connector that will be used as the predicate in links (e.g. frinendOf, instanceOf, etc). Deprecated: can be a json object that will be deserialized as a connector.
     * @param {string | null} className One of the contants in `connectorclass.js`.
     * @param {Object.<string,string>} roles A map from role names to values in `RoleType`.
     *
     */
    constructor(id = null, className = null, roles = null) {
        super();
        /**
         *
         * Id of this connector. Might be null.
         *
         * @public
         * @type {string | null}
         *
         */
        this.id = id;
        /**
         *  Class Name of this connector.
         *
         * @public
         * @type {string | null}
        */
        this.className = className || null;
        /**
         * Roles of this connector.
         *
         * @public
         * @type {Object.<string, string>}
         */
        this.roles = roles || {};
        /**
         *  Type of this entity.
         *
         * @public
         * @type {string | null}
        */
        this.type = Types.CONNECTOR;
        if (arguments[0] && typeof arguments[0] === "object") {
            let connector = arguments[0];
            this.id = connector.id || null;
            this.className = connector.className || null;
            this.roles = connector.roles || {};
            if (connector.properties) {
                this.properties = connector.properties;
            }
            if (connector.metaProperties) {
                this.metaProperties = connector.metaProperties;
            }
        }
    }
    /**
     * Adds a new role to this connector.
     *
     * @param {string} role Name of the role.
     * @param {string} type Values in `RoleType`.
     *
     * @returns {void}
     */
    addRole(role, type = RoleType.NONE) {
        if (!role.hasOwnProperty(role)) {
            this.roles[role] = type;
        }
    }
    /**
     * Tests whether `role` is a role in this connector.
     *
     * @param {string} role Name of the role to be tested.
     * @returns {boolean} Returns `true` if role exists; `false` otherwise.
     */
    hasRole(role) {
        return this.roles.hasOwnProperty(role);
    }
    /**
     * Returns the type of `role`, if it exists.
     *
     * @param {string} role The name of the role.
     * @returns {string} One of the values in `RoleType`. Returns `null` if `role` is not present.
     */
    getRoleType(role) {
        return this.roles[role] || null;
    }
    /**
     * Sets the type of a given role. If the role does not exist in this connector, then ignores.
     *
     * @param {string} role Name of the role.
     * @param {string} type One of the values in `RoleType`.
     *
     * @returns {void}
     */
    setRoleType(role, type) {
        if (this.roles.hasOwnProperty(role)) {
            this.roles[role] = type;
        }
    }
    /**
     * Returns a Array of role names.
     *
     * @returns {Array<string>} an array of string with role names.
     */
    getRoles() {
        return Object.keys(this.roles);
    }
    /**
     * Serializes this connector to a plain json object.
     *
     * @returns {Object.<string,any>} a plain json object with recursively serialized fields.
     */
    serialize() {
        let connector = {
            id: this.id,
            type: Types.CONNECTOR,
            className: this.className,
            roles: this.roles
        };
        if (this.properties) {
            connector.properties = this.serializeProperties();
        }
        if (this.metaProperties) {
            connector.metaProperties = this.serializeMetaProperties();
        }
        return connector;
    }
    /**
     * Tests whether `entity` is a connector structurally.
     *
     * @param {Object} node The entity to be tested.
     * @returns {boolean} Returns `true` if valid; `false` otherwise.
     *
     */
    static isValid(entity) {
        let isValid = false;
        if (entity && typeof (entity) === 'object' && !Array.isArray(entity)) {
            if (entity.hasOwnProperty('type') &&
                entity.type === Types.CONNECTOR &&
                entity.hasOwnProperty('id') &&
                entity.hasOwnProperty('className') &&
                entity.hasOwnProperty('roles')) {
                isValid = true;
            }
        }
        return isValid;
    }
}
Connector.type = Types.CONNECTOR;
const isValid = Connector.isValid;
module.exports = Connector;
