/**
* Copyright (c) 2016-present, IBM Research
* Licensed under The MIT License [see LICENSE for details]
*/
export = Node;
declare class Node extends HKEntity {
    static isValid(node: any): boolean;
    static entitify(data: any, setId?: boolean): {}[];
    static nodefy(data: any, serialize: any): any;
    constructor(id: any, parent: any, ...args: any[]);
    id: any;
    parent: any;
    interfaces: any;
    type: string;
    addInterface(key: any, type: any, properties: any): void;
    serialize(): {
        id: any;
        type: string;
        parent: any;
    };
}
declare namespace Node {
    const type: string;
}
import HKEntity = require("./hkentity");
