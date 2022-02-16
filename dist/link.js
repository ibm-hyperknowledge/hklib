/*
 * Copyright (c) 2016-present, IBM Research
 * Licensed under The MIT License [see LICENSE for details]
 */
"use strict";
const Types = require("./types");
const HKEntity = require("./hkentity");
const Constants = require("./constants");
class Link extends HKEntity {
    /** Constructs a new link object.
     *
     * @param {string | null} [id] Some id string for this link. Deprecated: json object, which will deserialized as a Link.
     * @param {string | null} [connector] Connector id string for this link.
     * @param {string | null} [parent] Parent id.
     */
    constructor(id = null, connector = null, parent = null) {
        super();
        /**
          * Id of this link. Might be null.
          *
          * @public
          * @type {string | null}
          *
          */
        this.id = id;
        /**
          * Connector id for this link. Might be null.
          *
          * @public
          * @type {string | null}
          *
          */
        this.connector = connector;
        /**
         * Parent id. Might be null.
         *
         * @public
         * @type {string | null}
         *
         */
        this.parent = parent;
        /**
         *  Type of this link.
         *
         * @public
         * @type {string | null}
        */
        this.type = Types.LINK;
        /**
         * Interface attributed to this node.
         *
         * @public
         * @type {Object.<string, Object.<string, Object>>}
         */
        this.binds = {};
        //TODO: check argument on why remove this on node.js
        if (arguments[0] && typeof arguments[0] === "object") {
            let link = arguments[0];
            this.id = link.id || null;
            this.connector = link.connector || null;
            this.parent = link.parent || null;
            if (link.binds) {
                this.binds = link.binds;
            }
            if (link.properties) {
                this.properties = link.properties;
            }
            if (link.metaProperties) {
                this.metaProperties = link.metaProperties;
            }
        }
    }
    /**
     * Adds a new bind to this role;
     *
     * @param {string} role Role o be used to this bind.
     * @param {string} componentId Id of the object being linked.
     * @param {string} [anchor] Anchors name, or Constants.LAMBDA.
     *
     * @returns {void}
     */
    addBind(role, componentId, anchor = Constants.LAMBDA) {
        if (!this.binds.hasOwnProperty(role)) {
            this.binds[role] = {};
        }
        if (!this.binds[role].hasOwnProperty(componentId)) {
            this.binds[role][componentId] = [];
        }
        this.binds[role][componentId].push(anchor);
    }
    forEachBind(callback = () => { }) {
        for (let role in this.binds) {
            let boundComponents = this.binds[role];
            for (let component in boundComponents) {
                let anchors = boundComponents[component];
                for (let i = 0; i < anchors.length; i++) {
                    callback(role, component, anchors[i]);
                }
            }
        }
    }
    forEachCrossBind(roles, callback = () => { }) {
        if (!(roles && Array.isArray(roles))) {
            callback([]);
            return;
        }
        if (roles.length === 0) {
            callback([]);
            return;
        }
        let array = new Array(roles.length);
        // console.log(array);
        _crossBind(this, roles, 0, array, false, callback);
    }
    hasBinds(bindObject) {
        let hasAllBinds = true;
        for (let role in bindObject) {
            if (bindObject.hasOwnProperty(role)) {
                let component = bindObject[role];
                if (this.binds.hasOwnProperty(role)) {
                    let boundsComponents = this.binds[role];
                    if (boundsComponents.hasOwnProperty(component)) {
                        continue;
                    }
                }
                hasAllBinds = false;
                break;
            }
        }
        return hasAllBinds;
    }
    /**
     * Returns a Array of roles present in this link.
     *
     * @returns {Array<string>} an array of string with role names.
     */
    getRoles() {
        if (this.binds) {
            return Object.keys(this.binds);
        }
        return [];
    }
    /** Removes a bind to a component + anchor.
     *
     * @param {string} component Component id.
     * @param {string} [anchor] Anchor name.
     *
     * @returns {void}
     */
    removeBind(component, anchor = null) {
        let dirtyRoles = new Set();
        for (let role in this.binds) {
            let boundComponents = this.binds[role];
            if (boundComponents.hasOwnProperty(component)) {
                if (!anchor) {
                    dirtyRoles.add(role);
                    delete boundComponents[component];
                }
                else {
                    let bounds = boundComponents[component];
                    let idx = bounds.indexOf(anchor);
                    if (idx >= 0) {
                        dirtyRoles.add(role);
                        bounds.splice(idx, 1);
                        if (Object.keys(boundComponents[component]).length === 0) {
                            delete boundComponents[component];
                        }
                    }
                }
            }
        }
        for (let k of dirtyRoles) {
            if (Object.keys(this.binds[k]).length === 0) {
                delete this.binds[k];
            }
        }
    }
    /**
     * Serializes this link to a plain json object.
     *
     * @returns {Object.<string,any>} a plain json object with recursively serialized fields.
     */
    serialize() {
        let link = {
            id: this.id,
            type: Types.LINK,
            parent: this.parent || null,
            connector: this.connector,
            binds: this.binds
        };
        if (this.properties) {
            link.properties = this.serializeProperties();
        }
        if (this.metaProperties) {
            link.metaProperties = this.serializeMetaProperties();
        }
        return link;
    }
    /**
     * Tests whether `entity` is a link structurally.
     *
     * @param {Object} entity The entity to be tested.
     * @returns {boolean} Returns `true` if valid; `false` otherwise.
     *
     */
    static isValid(entity) {
        if (entity && typeof (entity) === 'object' && !Array.isArray(entity)) {
            if (entity.hasOwnProperty('type') &&
                entity.type === Types.LINK &&
                entity.hasOwnProperty('id') &&
                entity.hasOwnProperty('parent') &&
                entity.hasOwnProperty('connector') &&
                entity.hasOwnProperty('binds') &&
                typeof (entity.binds) === 'object') {
                return true;
            }
        }
        return false;
    }
}
function _crossBind(self, roles, idx, vetor, withAnchors, callback) {
    if (idx < roles.length) {
        let binds = self.binds[roles[idx]];
        for (let k in binds) {
            vetor[idx] = k;
            _crossBind(self, roles, idx + 1, vetor, withAnchors, callback);
        }
    }
    else {
        callback.apply(this, vetor);
    }
}
Link.type = Types.LINK;
const isValid = Link.isValid;
module.exports = Link;
