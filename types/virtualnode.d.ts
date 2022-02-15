/**
* Copyright (c) 2016-present, IBM Research
* Licensed under The MIT License [see LICENSE for details]
*/
import Node from "./node";
export declare class VirtualNode extends Node {
    type: string;
    constructor(id: any, parent?: string);
    static isValid(entity: VirtualNode): boolean;
}