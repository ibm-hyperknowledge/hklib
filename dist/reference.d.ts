/**
* Copyright (c) 2016-present, IBM Research
* Licensed under The MIT License [see LICENSE for details]
*/
export default Reference;
declare class Reference extends Node {
    /** Constructs a new reference node object.
     *
     * @param {string | null} [id] Some if string for this node. Deprecated: json object, which will deserialized as a Reference;
     * @param {string | null} [refId] Id of the referenced entity.
     * @param {string | null} [parent] optional parent id.
     */
    constructor(id?: string | null | undefined, refId?: string | null | undefined, parent?: string | null | undefined, ...args: any[]);
    /**
     *
     * Id of referenced entity. Might be null.
     *
     * @public
     * @type {string | null}
     *
     */
    public ref: string | null;
}
declare namespace Reference {
    const type: string;
}
import Node from "./node.js";
