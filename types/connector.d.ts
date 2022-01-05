/**
* Copyright (c) 2016-present, IBM Research
* Licensed under The MIT License [see LICENSE for details]
*/
export = Connector;
declare class Connector extends HKEntity {
    static isValid(entity: any): boolean;
    constructor(id: any, className: any, roles: any, ...args: any[]);
    id: any;
    className: any;
    roles: any;
    type: string;
    addRole(role: any, type?: string): void;
    hasRole(role: any): any;
    getRoleType(role: any): any;
    setRoleType(role: any, type: any): void;
    getRoles(): string[];
    serialize(): {
        id: any;
        type: string;
        className: any;
        roles: any;
    };
}
declare namespace Connector {
    const type: string;
}
import HKEntity = require("./hkentity");
