/**
* Copyright (c) 2016-present, IBM Research
* Licensed under The MIT License [see LICENSE for details]
*/
export = HKGraph;
declare class HKGraph {
    nodes: {};
    contexts: {};
    links: {};
    connectors: {};
    refs: {};
    trails: {};
    bindsMap: {};
    linkMap: {};
    refMap: {};
    orphans: {};
    contextMap: {};
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
     * @param {string} id the id of entity to be removed
     * @returns {object} the removed entity
     */
    removeEntity(id: string): object;
    hasBind(connectorId: any, bind: any): boolean;
    getReferences(id: any): any[];
    hasReference(id: any, parent: any): boolean;
    getReference(id: any, parent: any): any;
    getChildren(contextId: any): any;
    getNeighbors(entityId: any): any[];
    getEntity(id: any): any;
    getEntities(): {};
    serialize(): string;
    deserialize(str: any): HKGraph;
}
declare namespace HKGraph {
    const NODE_TYPE: string;
    const CONTEXT_TYPE: string;
    const LINK_TYPE: string;
    const CONNECTOR_TYPE: string;
    const INTERFACE: string;
}
declare function generateId(model: any, length: any): any;