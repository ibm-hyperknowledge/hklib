/**
* Copyright (c) 2016-present, IBM Research
* Licensed under The MIT License [see LICENSE for details]
*/
export = HKGraph;
declare class HKGraph {
    nodes: {};
    virtualNodes: {};
    contexts: {};
    virtualContexts: {};
    links: {};
    virtualLinks: {};
    connectors: {};
    refs: {};
    trails: {};
    bindsMap: {};
    linkMap: {};
    virtualLinkMap: {};
    refMap: {};
    orphans: {};
    contextMap: {};
    virtualContextMap: {};
    relationless: {};
    generateId: typeof generateId;
    hasId(id: any): boolean;
    /**
     * Update an entity
     * @param {object} entity an entity with an id and ALL updated properties (including intrinsecs properties)
     * @returns {object} the new entity
     */
    setEntity(entity: object): object;
    /**
     * Add a new entity to the graph
     * @param {object} entity The entity object to be added.
     * @returns {object} The entity added, if the input object does not have an id, the returned will have.
     */
    addEntity(entity: object): object;
    /**
     * Add a new entities to the graph
     * @param {object} entities The entities object to be added.
     */
    addEntities(entities: object): void;
    /**
     * @param {string} id the id of entity to be removed
     * @returns {object} the removed entity
     */
    removeEntity(id: string): object;
    hasBind(connectorId: any, bind: any): boolean;
    getReferences(id: any): any[];
    hasReference(id: any, parent: any): boolean;
    getReference(id: any, parent: any): any;
    getChildren(contextId: any): any;
    getNeighbors(entityId: any): HKEntity[];
    /**
     * Returns an entity in this graph having `id`.
     *
     * @param {string} id ID of requested entity. Null if requested entity is the null context.
     *
     * @returns {HKEntity | null} Returns the entity of `id`, or `null` if `id` not found in this graph object.
     *
     */
    getEntity(id: string): HKEntity | null;
    /**
     * Returns HK entities in this graph indexed by id.
     *
     * @returns {Object.<string,HKEntity>}
     *
     */
    getEntities(): {
        [x: string]: HKEntity;
    };
    serialize(): string;
    deserialize(str: any): HKGraph;
}
declare namespace HKGraph {
    const NODE_TYPE: string;
    const VIRTUAL_NODE_TYPE: string;
    const CONTEXT_TYPE: string;
    const VIRTUAL_CONTEXT_TYPE: string;
    const LINK_TYPE: string;
    const VIRTUAL_LINK_TYPE: string;
    const CONNECTOR_TYPE: string;
    const INTERFACE: string;
}
declare function generateId(model: any, length: any): any;
import HKEntity = require("./hkentity");
