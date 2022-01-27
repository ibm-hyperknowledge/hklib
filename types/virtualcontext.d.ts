/**
* Copyright (c) 2016-present, IBM Research
* Licensed under The MIT License [see LICENSE for details]
*/
export = VirtualContext;
declare class VirtualContext extends Context {
    static isValid(entity: any): boolean;
    constructor(id: any, virtualSrc?: null, parent?: null, ...args: any[]);
}
import Context = require("./context");
