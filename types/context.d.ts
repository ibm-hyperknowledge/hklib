/**
* Copyright (c) 2016-present, IBM Research
* Licensed under The MIT License [see LICENSE for details]
*/
export = Context;
declare class Context extends Node {
    /**
     * Tests whether `entity` is a context structurally.
     *
     * @param {Object} entity The entity to be tested.
     * @returns {booelan} Returns `true` if valid; `false` otherwise.
     *
     */
    static isValid(entity: Object): booelan;
    /** Constructs a new context object.
     *
     * @param {String | null} [id] Some id string for this context. Deprecated: json object, which will deserialized as a Context; use `nodify()` instead.
     * @param {String | null} [parent] Parent id.
     */
    constructor(id?: string | null | undefined, parent?: string | null | undefined);
}
declare namespace Context {
    const type: string;
}
import Node = require("./node");
