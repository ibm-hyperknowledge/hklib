/**
* Copyright (c) 2016-present, IBM Research
* Licensed under The MIT License [see LICENSE for details]
*/
import Context from "./context";
export declare class VirtualContext extends Context {
    type: string;
    constructor(id: any, virtualSrc: string, parent?: string);
    static isValid(entity: VirtualContext): boolean;
}
