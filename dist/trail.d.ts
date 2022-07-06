/**
* Copyright (c) 2016-present, IBM Research
* Licensed under The MIT License [see LICENSE for details]
*/
export = Trail;
declare function Trail(id: any, actions: any, parent: any, ...args: any[]): void;
declare class Trail {
    constructor(id: any, actions: any, parent: any, ...args: any[]);
    id: any;
    parent: any;
    properties: any;
    metaproperties: any;
    interfaces: any;
    actions: any;
    type: "trail";
    updateAction(oldAction: any, newAction: any): void;
    addAction(action: any): any;
    removeAction(action: any): void;
    action: any;
    append(action: any): any;
    prepend(action: any): any;
    in(from?: null): any;
    out(to?: null): any;
    size(): number | undefined;
    join(delimiter: any): any;
    update(action: any, newAction: any): void;
    remove(action: any): void;
    getPrev(position: any, num?: number): any;
    getNext(position: any, num?: number): any;
    getPositionOf(action: any): number;
    getActionAt(position: any): any;
    search(eventId: null | undefined, filters: any): any;
    loadActions(actions?: null): any;
    toJSON(): {
        id: any;
        parent: any;
        properties: any;
        metaproperties: any;
        interfaces: any;
        actions: any[];
        type: "trail";
    };
    serialize(): {
        id: any;
        parent: any;
        properties: any;
        metaproperties: any;
        interfaces: any;
        actions: any;
        type: "trail";
    };
}
declare namespace Trail {
    export const type: "trail";
    export { isValid };
    export { sort };
    export { Action };
    export { TrailNode };
}
declare function isValid(entity: any): boolean;
declare function sort(actions?: null): any;
declare class Action {
    constructor({ from, to, event, agent }?: {
        from?: null | undefined;
        to?: null | undefined;
        event?: {} | undefined;
        agent?: null | undefined;
    });
    from: any;
    to: any;
    agent: any;
    event: {};
    type: "action";
    id: any;
    getTime(): number;
    toString(): any;
    toJSON(): any;
}
declare class TrailNode {
    constructor(nodeId: any, nodeType: any, targetAnchor: any);
    nodeId: any;
    nodeType: any;
    targetAnchor: any;
    toString(): string;
}
