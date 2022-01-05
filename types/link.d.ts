/**
* Copyright (c) 2016-present, IBM Research
* Licensed under The MIT License [see LICENSE for details]
*/
export = Link;
declare class Link extends HKEntity {
    static isValid(entity: any): boolean;
    constructor(id: any, connector: any, parent: any, ...args: any[]);
    id: any;
    connector: any;
    parent: any;
    binds: any;
    type: string;
    addBind(role: any, componentId: any, anchor?: string): void;
    forEachBind(callback?: () => void): void;
    forEachCrossBind(roles: any, callback?: () => void): void;
    hasBinds(bindObject: any): boolean;
    getRoles(): string[];
    removeBind(component: any, anchor?: null): void;
    serialize(): {
        id: any;
        type: string;
        parent: any;
        connector: any;
        binds: any;
    };
}
declare namespace Link {
    const type: string;
}
import HKEntity = require("./hkentity");
