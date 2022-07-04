/**
* Copyright (c) 2016-present, IBM Research
* Licensed under The MIT License [see LICENSE for details]
*/
export = Trail;
declare class Trail extends HKEntity {
    static isValid(entity: any): boolean;
    constructor(id: any, parent: any, ...args: any[]);
    id: any;
    parent: any;
    properties: any;
    metaproperties: any;
    interfaces: any;
    children: any;
    steps: any[] | undefined;
    type: "trail";
    addStep(key: any, properties: any): void;
    addInterface(key: any, type: any, properties: any): void;
    createLinksFromSteps(): Connector[];
    serialize(): {
        id: any;
        parent: any;
        properties: any;
        metaproperties: any;
        interfaces: any;
        type: "trail";
    };
}
declare namespace Trail {
    const type: "trail";
}
import HKEntity = require("./hkentity");
import Connector = require("./connector");
