/**
* Copyright (c) 2016-present, IBM Research
* Licensed under The MIT License [see LICENSE for details]
*/
export = Reference;
declare class Reference extends Node {
    constructor(id: any, refId: any, parent: any, ...args: any[]);
    ref: any;
}
declare namespace Reference {
    const type: string;
}
import Node = require("./node");
