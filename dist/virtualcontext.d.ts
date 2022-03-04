/**
* Copyright (c) 2016-present, IBM Research
* Licensed under The MIT License [see LICENSE for details]
*/
import Context from "./context";
export = VirtualContext;
declare class VirtualContext extends Context {
    constructor(id: any, virtualSrc: string, parent?: string);
    static isValid(entity: VirtualContext): boolean;
    setOrAppendToProperty(property: string, value: Object, metaProperty?: string | undefined): void;
}
