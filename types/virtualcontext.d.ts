/**
* Copyright (c) 2016-present, IBM Research
* Licensed under The MIT License [see LICENSE for details]
*/
import Context from "./context";
export declare class VirtualContext extends Context {
    type: string;
    constructor(id: string | object, virtualSrc: string, parent?: string, ...args: any[]);
    static isValid(entity: VirtualContext): boolean;
}
