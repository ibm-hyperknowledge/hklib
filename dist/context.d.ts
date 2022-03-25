/**
* Copyright (c) 2016-present, IBM Research
* Licensed under The MIT License [see LICENSE for details]
*/
export = Context;
declare class Context extends Node {
    /** Constructs a new context object.
     *
     * @param {string | null} [id] Some id string for this context. Deprecated: json object, which will deserialized as a Context; use `nodify()` instead.
     * @param {string | null} [parent] Parent id.
     */
    constructor(id?: string | null | undefined, parent?: string | null | undefined);
    type: string;
}
declare namespace Context {
    const type: string;
}
import Node = require("./node");
