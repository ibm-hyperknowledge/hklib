/*
 * Copyright (c) 2016-present, IBM Research
 * Licensed under The MIT License [see LICENSE for details]
 */
"use strict";
const Types = require("./types");
const Node = require("./node");
const Context = require("./context");
const Connector = require("./connector");
const Link = require("./link");
const Constants = require("./constants");
const ConnectorClass = require("./connectorclass");
const RoleTypes = require("./roletypes");
function createRelation(key, subj, obj, options, connectors, entities) {
    let relationId = key;
    if (options.aliasMap.hasOwnProperty(key)) {
        relationId = options.aliasMap[key];
    }
    if (!connectors.hasOwnProperty(relationId)) {
        // if(entities.hasOwnProperty(relationId))
        // {
        //     let err = "Error creating connector, id already exist " + relationId;
        //     throw err;
        // }
        let newConnector = new Connector();
        newConnector.id = relationId;
        newConnector.className = ConnectorClass.FACTS;
        newConnector.addRole(options.subjectRole, RoleTypes.SUBJECT);
        newConnector.addRole(options.objectRole, RoleTypes.OBJECT);
        connectors[newConnector.id] = newConnector;
        entities.push(options.serialize ? newConnector.serialize() : newConnector);
    }
    let link = new Link();
    link.connector = relationId;
    link.addBind(options.subjectRole, subj);
    if (obj) {
        link.addBind(options.objectRole, obj);
    }
    link.id = options.createIdFunction(link);
    entities.push(options.serialize ? link.serialize() : link);
    return link;
}
function convertEntity(data, parent, options, connectors, entitiesSet, entities) {
    let node = new Node();
    let idAlias = options.idAlias || "id";
    // Search for id
    if (options.useObjectId) {
        node.id = data[idAlias] || null;
    }
    if (!node.id) {
        node.id = options.createIdFunction();
    }
    node.parent = parent;
    for (let k in data) {
        if (!data.hasOwnProperty(k)) {
            continue;
        }
        let type = typeof data[k];
        if (options.useObjectId && k === idAlias) {
            continue;
        }
        else if (options.onCustomProperty && options.onCustomProperty(node, k, data[k])) {
            continue;
        }
        else if (type === "string" || type === "number") {
            node.setProperty(k, data[k]);
        }
        else if (Array.isArray(data[k])) {
            let arr = data[k];
            let createContext = options.createContext(node, k);
            let contextId = null;
            if (createContext) {
                let context = new Context();
                context.id = options.createIdFunction(context);
                contextId = context.id;
                entities.push(options.serialize ? context.serialize() : context);
            }
            let isLiteral = true;
            for (let i = 0; i < arr.length; i++) {
                let t = typeof arr[i];
                if (t !== "number" && t !== "string") {
                    isLiteral = false;
                    break;
                }
            }
            if (isLiteral) {
                node.setProperty(k, JSON.stringify(arr));
            }
            else {
                if (createContext && contextId) {
                    for (let i = 0; i < arr.length; i++) {
                        if (t !== "number" && t !== "string") {
                            convertEntity(arr[i], node.id, options, connectors, entitiesSet, entities);
                        }
                    }
                }
                else if (node.id) {
                    let children = [];
                    for (let i = 0; i < arr.length; i++) {
                        let t = typeof arr[i];
                        if (t !== "number" && t !== "string") {
                            let child = convertEntity(arr[i], parent, options, connectors, entitiesSet, entities);
                            children.push(child);
                        }
                    }
                    let l = createRelation(k, node.id, null, options, connectors, entities);
                    for (let i = 0; i < children.length; i++) {
                        let n = children[i];
                        if (n.id) {
                            l.addBind(options.objectRole, n.id);
                        }
                    }
                }
            }
        }
        else if (type === "object") {
            let otherNode = convertEntity(data[k], parent, options, connectors, entitiesSet, entities);
            if (node.id && otherNode.id) {
                createRelation(k, node.id, otherNode.id, options, connectors, entities);
            }
        }
    }
    // console.log(entities);
    if (node.id) {
        if (!entitiesSet.has(node.id)) {
            entities.push(options.serialize ? node.serialize() : node);
            entitiesSet.add(node.id);
        }
    }
    else {
        entities.push(options.serialize ? node.serialize() : node);
    }
    return node;
}
function hyperify(data, options = {}) {
    if (!data) {
        return [];
    }
    options.aliasMap = options.aliasMap || {};
    options.idAlias = options.idAlias || null;
    options.useObjectId = options.useObjectId === undefined ? true : options.useObjectId;
    options.serialize = options.serialize || false;
    options.createIdFunction = options.createIdFunction || (() => null);
    options.createContext = options.createContext || (() => false);
    options.parent = options.parent || null;
    options.subjectRole = options.subjectRole || "subject";
    options.objectRole = options.objectRole || "object";
    options.onCustomProperty = options.onCustomProperty || null;
    let entities = [];
    let entitiesSet = new Set();
    let connectors = {};
    if (!Array.isArray(data)) {
        data = [data];
    }
    for (let i = 0; i < data.length; i++) {
        convertEntity(data[i], options.parent, options, connectors, entitiesSet, entities);
    }
    return entities;
}
module.exports = hyperify;
