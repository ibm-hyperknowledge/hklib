/**
* Copyright (c) 2016-present, IBM Research
* Licensed under The MIT License [see LICENSE for details]
*/
export = GraphBuilder;
declare class GraphBuilder {
    graph: Graph;
    linkMap: {};
    preservedEntities: any[];
    checkRedundancy: boolean;
    groupLinks: boolean;
    subjectLabel: string;
    objectLabel: string;
    addNode(id: any, parent?: null): any;
    addReference(id: any, parent?: null): any;
    addPreservedEntities(ids: any): void;
    addContext(id: any, parent?: null): any;
    addEntity(entity: any): any;
    getEntity(entityId: any): any;
    addFact(subj: any, pred: any, obj: any, parent: any): any;
    addInheritance(child: any, inheritance: any, className: any, parent: any): any;
    addLink(connectorId: any, linkObj: any, parent?: null): any;
    getGraph(): Graph;
    removeEntity(id: any): void;
    addFactRelation(relatioName: any, roles: any): any;
    addInheritanceRelation(inheritance: any, roles: any): any;
    getEntities(serialized: any): any[];
}
import Graph = require("./hkgraph");
