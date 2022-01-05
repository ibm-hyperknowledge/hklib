/*
 * Copyright (c) 2016-present, IBM Research
 * Licensed under The MIT License [see LICENSE for details]
 */

"use strict";

const Connector = require("./connector");
const Context = require("./context");
const Link = require("./link");
const Node = require("./node");
const Reference = require("./reference");
const Trail = require("./trail");
const Types = require("./types");
const shortid = require('shortid');
const VirtualContext = require("./virtualcontext");

class HKGraph
{
constructor()
{
	this.nodes = {};
	this.contexts = {};
	this.links = {};
	this.connectors = {};
	this.refs = {};
	this.trails = {};

	// Auxiliar maps
	this.bindsMap = {};
	this.linkMap = {};
	this.refMap = {};
	this.orphans = {};
	this.contextMap = {};
	this.relationless = {};

	this.contextMap[null] = {};

	this.generateId = generateId;
}
hasId(id)
{
	return this.nodes.hasOwnProperty(id) ||
		this.contexts.hasOwnProperty(id) ||
		this.links.hasOwnProperty(id) ||
		this.connectors.hasOwnProperty(id) ||
		this.refs.hasOwnProperty(id) ||
		this.trails.hasOwnProperty(id);
}
/**
 * Update an entity
 * @param {object} entity an entity with an id and ALL updated properties (including intrinsecs properties)
 * @returns {object} the new entity
 */
setEntity(entity)
{
	let oldEntity = this.getEntity(entity.id);

	if (!oldEntity)
	{
		return null;
	}

	if (entity.type === Types.LINK)
	{
		oldEntity.binds = entity.binds;
	}

	if (entity.type === Types.CONNECTOR)
	{
		oldEntity.roles = entity.roles;
		oldEntity.className = entity.className;
	}

	if (entity.type === Types.NODE || entity.type === Types.REFERENCE || entity.type === Types.CONTEXT)
	{

		oldEntity.interfaces = entity.interfaces;

	}

	// Update parent
	// Clean old entity
	if (oldEntity.hasOwnProperty('parent'))
	{
		let oldParent = this.getEntity(oldEntity.parent);
		if (oldParent)
		{
			delete this.contextMap[oldEntity.parent][oldEntity.id];
		}
		else if (oldEntity.parent)
		{
			delete this.orphans[oldEntity.parent][oldEntity.id];
		}
	}

	// Set new parent
	if (entity.hasOwnProperty('parent'))
	{
		let parent = this.getEntity(entity.parent);
		if (parent || entity.parent === null)
		{
			this.contextMap[entity.parent][entity.id] = entity;
		}
		else if (entity.parent)
		{
			if (!this.orphans.hasOwnProperty(entity.parent))
			{
				this.orphans[entity.parent] = {};
			}
			this.orphans[entity.parent][entity.id] = entity;
		}
	}

	oldEntity.parent = entity.parent;

	// Update properties
	oldEntity.properties = entity.properties;

	return oldEntity;
}
/**
 * Add a new entity to the graph
 * @param {object} entity The entity object to be added.
 * @returns {object} The entity added, if the input object does not have an id, the returned will have.
 */
addEntity(entity)
{
	let newEntity = null;

	if (entity && entity.hasOwnProperty('type'))
	{
		let id;

		if (this.hasId(entity.id))
		{
			return this.setEntity(entity);
		}
		else if (!entity.id)
		{
			id = this.generateId(this);
			entity.id = id;
		}

		else
		{
			id = entity.id;
		}

		switch (entity.type)
		{
			case Types.NODE:
				{
					if (Node.isValid(entity))
					{
						newEntity = new Node(entity);
						this.nodes[entity.id] = newEntity;
					}
					break;
				}
			case Types.CONTEXT:
				{
					const validVirtualContext = VirtualContext.isValid(entity);
					const validContext = Context.isValid(entity);

					if (validVirtualContext || validContext)
					{
						if (validVirtualContext)
						{
							newEntity = new VirtualContext(entity);
						}

						else
						{
							newEntity = new Context(entity);
						}

						this.contexts[entity.id] = newEntity;
						this.contextMap[entity.id] = {};

						if (this.orphans.hasOwnProperty(entity.id))
						{
							this.contextMap[entity.id] = this.orphans[entity.id];
							delete this.orphans[entity.id];
						}
					}
					break;
				}
			case Types.TRAIL:
				{
					if (Trail.isValid(entity))
					{
						newEntity = new Trail(entity);
						this.trails[entity.id] = newEntity;
					}
					break;
				}
			case Types.LINK:
				{
					if (Link.isValid(entity))
					{
						newEntity = new Link(entity);
						newEntity.id = id;
						this.links[id] = newEntity;

						if (!this.linkMap.hasOwnProperty(newEntity.connector))
						{
							this.linkMap[newEntity.connector] = {};
						}
						this.linkMap[newEntity.connector][newEntity.id] = newEntity;

						this.bindsMap[newEntity.id] = new Set();
						newEntity.forEachBind((__, comp) =>
						{
							this.bindsMap[newEntity.id].add(comp);

							if (!this.bindsMap.hasOwnProperty(comp))
							{
								this.bindsMap[comp] = new Set();
							}
							this.bindsMap[comp].add(newEntity.id);
						});
					}
					break;
				}
			case Types.CONNECTOR:
				{
					if (Connector.isValid(entity))
					{
						newEntity = new Connector(entity);
						this.connectors[entity.id] = newEntity;
					}
					break;
				}
			case Types.REFERENCE:
				{
					if (Reference.isValid(entity))
					{
						newEntity = new Reference(entity);
						newEntity.id = id;
						this.refs[newEntity.id] = newEntity;

						if (!this.refMap.hasOwnProperty(newEntity.ref))
						{
							this.refMap[newEntity.ref] = {};
						}
						this.refMap[newEntity.ref][newEntity.id] = newEntity;
					}
					break;

				}
		}

		if (!newEntity)
		{
			console.log(entity);
		}

		// Set parent
		if (entity.type !== Types.CONNECTOR)
		{
			if (this.contextMap.hasOwnProperty(newEntity.parent))
			{
				this.contextMap[newEntity.parent][newEntity.id] = newEntity;
			}

			else
			{
				if (!this.orphans.hasOwnProperty(newEntity.parent))
				{
					this.orphans[newEntity.parent] = {};
				}
				this.orphans[newEntity.parent][newEntity.id] = newEntity;
			}
		}

		// Set binds
		if (this.relationless.hasOwnProperty(id))
		{
			newEntity.binds = this.relationless[id];
			delete this.relationless[id];
		}

	}
	return newEntity;
}
/**
 * @param {string} id the id of entity to be removed
 * @returns {object} the removed entity
 */
removeEntity(id)
{
	let entity = this.getEntity(id);
	if (entity)
	{
		switch (entity.type)
		{
			case Node.type:
				{
					delete this.nodes[id];
					break;
				}
			case Context.type:
				{
					delete this.contexts[id];
					delete this.contextMap[entity.id];
					break;
				}
			case Reference.type:
				{
					if (this.refMap.hasOwnProperty(entity.ref))
					{
						if (this.refMap[entity.ref].hasOwnProperty(entity.id))
						{
							delete this.refMap[entity.ref][entity.id];
						}
					}
					delete this.refs[id];
					break;
				}
			case Connector.type:
				{
					for (let link_id in this.links)
					{
						let link = this.links[link_id];
						if (link.connector === entity)
						{
							link.connector = null;
						}
					}
					delete this.connectors[id];
					break;
				}
			case Link.type:
				{
					if (this.linkMap.hasOwnProperty(entity.connector))
					{
						let links = this.linkMap[entity.connector];
						for (let j = 0; j < links.length; j++)
						{
							if (links[j].id === entity.id)
							{
								links.splice(j, 1);
								break;
							}
						}
					}
					delete this.links[id];
					break;
				}
			case Trail.type:
				{
					/* delete children trails? */
					delete this.trails[id];
					break;
				}
		}

		if (this.orphans.hasOwnProperty(entity.parent))
		{
			delete this.orphans[entity.parent][id];
		}

		if (this.contextMap.hasOwnProperty(entity.parent))
		{
			delete this.contextMap[entity.parent][entity.id];
		}

		if (this.bindsMap.hasOwnProperty(entity.id))
		{
			let connections = this.bindsMap[entity.id];

			for (let k in connections)
			{
				let binds = connections[k];
				binds.delete(entity.id);
			}
			delete this.bindsMap[entity.id];
		}
	}

	else
	{
		return null;
	}
	return entity;
}
hasBind(connectorId, bind)
{
	if (this.linkMap.hasOwnProperty(connectorId))
	{
		let links = this.linkMap[connectorId];
		for (let k in links)
		{
			let l = links[k];
			if (l.hasBinds(bind))
			{
				return true;
			}
		}
	}
	return false;
}
getReferences(id)
{
	if (this.refMap.hasOwnProperty(id))
	{
		return Object.values(this.refMap[id]);
	}
	return [];
}
hasReference(id, parent)
{
	if (this.refMap.hasOwnProperty(id))
	{
		let refs = this.refMap[id];
		for (let k in refs)
		{
			let ref = refs[k];
			if (ref.parent === parent)
			{
				return true;
			}
		}
	}
	return false;
}
getReference(id, parent)
{
	if (this.refMap.hasOwnProperty(id))
	{
		let refs = this.refMap[id];
		for (let k in refs)
		{
			let ref = refs[k];
			if (ref.parent === parent)
			{
				return ref;
			}
		}
	}
	return null;
}
getChildren(contextId)
{
	if (this.contextMap.hasOwnProperty(contextId))
	{
		return this.contextMap[contextId];
	}

	else
	{
		return {};
	}
}
getNeighbors(entityId)
{
	let out = [];
	if (this.bindsMap.hasOwnProperty(entityId))
	{
		let binds = this.bindsMap[entityId];

		for (let k of binds)
		{
			let entity = this.getEntity(k);
			if (entity)
			{
				out.push(entity);
			}
		}
	}
	return out;
}
getEntity(id)
{
	if (id === null)
	{
		let c = new Context();
		c.id = null;
		return c;
	}
	return this.nodes[id] || this.contexts[id] || this.links[id] || this.connectors[id] || this.refs[id] || this.trails[id] || null;
}
getEntities()
{
	let out = {};

	Object.assign(out, this.links);
	Object.assign(out, this.connectors);
	Object.assign(out, this.contexts);
	Object.assign(out, this.nodes);
	Object.assign(out, this.refs);
	Object.assign(out, this.trails);

	return out;
}
serialize()
{
	let out = {
		nodes: this.nodes,
		links: this.links,
		contexts: this.contexts,
		connectors: this.connectors,
		refs: this.refs,
		trails: this.trails
	};
	return JSON.stringify(out);
}

deserialize(str)
{
	let model = new HKGraph();
	let serialized = str ? JSON.parse(str) : {};

	if (serialized.hasOwnProperty('nodes')) model.nodes = serialized.nodes;
	if (serialized.hasOwnProperty('contexts')) model.contexts = serialized.contexts;
	if (serialized.hasOwnProperty('connectors')) model.connectors = serialized.connectors;
	if (serialized.hasOwnProperty('links')) model.links = serialized.links;
	if (serialized.hasOwnProperty('binds')) model.binds = serialized.binds;
	if (serialized.hasOwnProperty('refs')) model.refs = serialized.refs;
	if (serialized.hasOwnProperty('trails')) model.trails = serialized.trails;
	return model;
}
}
/* private functions */
function generateId(model, length)
{
	let id;
	do
	{
		id = shortid();
	}
	while (model.hasId(id));
	return id;
}

module.exports = HKGraph;
HKGraph.NODE_TYPE = Types.NODE;
HKGraph.CONTEXT_TYPE = Types.CONTEXT;
HKGraph.LINK_TYPE = Types.LINK;
HKGraph.CONNECTOR_TYPE = Types.CONNECTOR;
HKGraph.INTERFACE = Types.INTERFACE;
