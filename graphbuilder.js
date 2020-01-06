/*
 * Copyright (c) 2016-present, IBM Research
 * Licensed under The MIT License [see LICENSE for details]
 */

"use strict";

let Node = require("./node");
let Reference = require("./reference");
let Connector = require("./connector");
let ConnectorClass = require("./connectorclass");
let Link = require("./link");
let Context = require("./context");
let Graph = require("./hkgraph");
let RoleTypes = require("./roletypes");

const DEFAULT_SUBJECT_LABEL = "subject";
const DEFAULT_OBJECT_LABEL = "object";


function GraphBuilder()
{
    this.graph = new Graph();
    this.linkMap = {};
    this.preservedEntities = [];
    this.checkRedundancy = true;
    this.groupLinks = true;
    this.subjectLabel = DEFAULT_SUBJECT_LABEL;
    this.objectLabel = DEFAULT_OBJECT_LABEL;
}

function _collectEntities(map, serialized, array = [])
{
    for(let k in map)
    {
        if(map.hasOwnProperty(k))
        {
            if(serialized)
            {
                array.push(map[k].serialize());
            }
            else
            {
                array.push(map[k]);
            }
        }
    }
}

GraphBuilder.prototype.addNode = function(id, parent = null)
{
    if(this.graph.hasId(id))
    {
        let entity = this.graph.getEntity(id);
        if(entity.type === Node.type)
        {
            return entity;
        }
        else
        {
            return null;
        }
    }
    else if (this.preservedEntities.includes(id))
    {
        return null;
    }
    else
    {
        let n = new Node();
        n.id = id;
        n.parent = parent;

        if(parent)
        {
            this.addContext(parent);
        }

        return this.graph.addEntity(n);
    }
}

GraphBuilder.prototype.addReference = function(id, parent = null)
{
    if(this.graph.hasId(id))
    {
        let entity = this.graph.getEntity(id);
        if(entity.type === Node.type && entity.parent === parent)
        {
            return entity;
        }
    }

    {
        let ref = this.graph.getReference(id, parent);

        if(ref)
        {
            return ref
        }
    }

    let ref = new Reference();
    ref.ref = id;
    ref.parent = parent;

    if(parent)
    {
        this.addContext(parent);
    }
    let newRef = this.graph.addEntity(ref);
    return newRef;
}

GraphBuilder.prototype.addPreservedEntities = function (ids)
{
    if(ids)
    {
        if(Array.isArray(ids))
        {
            ids.forEach( id => {
                if (!this.preservedEntities.includes(id))
                {
                    this.preservedEntities.push(id);
                }
            });
        }
        else{
            if (!this.preservedEntities.includes(ids))
            {
                this.preservedEntities.push(ids);
            }
        }
    }

}

GraphBuilder.prototype.addContext = function(id, parent = null)
{
    if(this.graph.hasId(id))
    {
        let entity = this.graph.getEntity(id);

        if(entity.type === Context.type)
        {
            return entity;
        }
        else
        {
            return null;
        }
    }
    else if (this.preservedEntities.includes(id))
    {
        return null;
    }
    else
    {
        let context = new Context();
        context.id = id;
        context.parent = parent;

        if(parent)
        {
            this.addContext(parent);
        }
        return this.graph.addEntity(context);
    }
}

GraphBuilder.prototype.addEntity = function(entity)
{
	if(this.graph.hasId(entity.id))
	{
		this.graph.setEntity(entity);
		return this.graph.getEntity(entity.id);
	}
	else
	{
    	return this.graph.addEntity(entity)
	}
}

GraphBuilder.prototype.getEntity = function(entityId)
{
    return this.graph.getEntity(entityId)
}

GraphBuilder.prototype.addFact = function(subj, pred, obj, parent)
{
    let linkObj = {};
    linkObj[this.subjectLabel] = subj;
    linkObj[this.objectLabel] = obj;
    return this.addLink(pred, linkObj, parent);
}

GraphBuilder.prototype.addInheritance = function(child, inheritance, className, parent)
{
    let linkObj = {};
    linkObj[this.subjectLabel] = child;
    linkObj[this.objectLabel] = className;

    if(!this.graph.hasId(inheritance))
    {
        let c = new Connector();
        c.id = inheritance;
        c.className = ConnectorClass.HIERARCHY;
        c.addRole(this.subjectLabel, RoleTypes.CHILD);
        c.addRole(this.objectLabel, RoleTypes.PARENT);
        this.graph.addEntity(c);
    }

    return this.addLink(inheritance, linkObj, parent);
}



function _addLink (connector, linkObj, parent)
{
    let link = new Link();
    link.connector = connector.id;
    link.parent = parent;

    if(parent)
    {
        this.addContext(parent);
    }

    for(let k in linkObj)
    {
        if(linkObj.hasOwnProperty(k))
        {
            if(connector.hasRole(k))
            {
                this.addNode(linkObj[k], parent);
                link.addBind(k, linkObj[k]);
            }
        }
    }

    let newLink = this.graph.addEntity(link);

    if(!this.linkMap.hasOwnProperty(connector.id))
    {
        this.linkMap[connector.id] = [];
    }

    this.linkMap[connector.id].push(newLink);


    return newLink;
}

GraphBuilder.prototype.addLink = function(connectorId, linkObj, parent = null)
{
    let connector = null;
    if(this.graph.connectors.hasOwnProperty(connectorId))
    {
        connector = this.graph.connectors[connectorId];
    }
    else
    {
        connector = new Connector();
        connector.id = connectorId;
        connector.className = ConnectorClass.FACTS;

        for(let k in linkObj)
        {
            if(linkObj.hasOwnProperty(k))
            {
                if(k === this.subjectLabel)
                {
                    connector.addRole(k, RoleTypes.SUBJECT);
                }
                else if(k === this.objectLabel)
                {
                    connector.addRole(k, RoleTypes.OBJECT);
                }
                else
                {
                    connector.addRole(k, RoleTypes.NONE);
                }
            }
        }

        this.graph.addEntity(connector);
    }

    if(this.checkRedundancy && this.linkMap.hasOwnProperty(connectorId))
    {
        let previousLink = this.linkMap[connectorId];

        for(let k in previousLink)
        {
            let l = previousLink[k];

            if(l.hasBinds(linkObj))
            {
                return null;
            }
        }
    }

    return _addLink.call(this, connector, linkObj, parent);
}

GraphBuilder.prototype.getGraph = function()
{
    return this.graph;
}

GraphBuilder.prototype.removeEntity = function(id)
{
    this.graph.removeEntity(id);
}

function _addConnector(connectorId, className, roles = [])
{
    if(this.graph.connectors.hasOwnProperty(connectorId))
    {
        return this.graph.connectors[connectorId];
    }
    else
    {
        let connector = new Connector();
        connector.id = connectorId;
        connector.className = className;

        if(roles.length === 2)
        {
            connector.addRole(roles[0], RoleTypes.SUBJECT);
            connector.addRole(roles[1], RoleTypes.OBJECT);
        }
        else
        {
            connector.addRole(this.subjectLabel, RoleTypes.SUBJECT);
            connector.addRole(this.objectLabel, RoleTypes.OBJECT);
        }

        return this.graph.addEntity(connector);
    }
}

GraphBuilder.prototype.addFactRelation = function(relatioName, roles)
{
    return _addConnector.call(this, relatioName, ConnectorClass.FACTS, roles);
}

GraphBuilder.prototype.addInheritanceRelation = function(inheritance, roles)
{
    return _addConnector.call(this, inheritance, ConnectorClass.HIERARCHY, roles);
}

GraphBuilder.prototype.getEntities = function(serialized)
{
    let out = [];

    _collectEntities(this.graph.nodes, serialized, out);
    _collectEntities(this.graph.connectors, serialized, out);
    _collectEntities(this.graph.links, serialized, out);
    _collectEntities(this.graph.contexts, serialized, out);
    _collectEntities(this.graph.refs, serialized, out);

    return out;
}

module.exports = GraphBuilder;
