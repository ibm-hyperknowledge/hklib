/**
* Copyright (c) 2016-present, IBM Research
* Licensed under The MIT License [see LICENSE for details]
*/
import Context from "./context.js";
declare class VirtualContext extends Context {
    /** Constructs a new virtual context object.
     *
     * @param {any} [id] Some id string for this entity.
     * @param {string | null} [virtualSrc] Virtual endpoint to acceess information
     * @param {string | null} [datasourceType] Type of the external datasource to be fetched. E.g., rdf, hyperknowledge etc.
     * @param {string | null} [parent] Parent id.
     */
    constructor(id: any, virtualSrc: string, datasourceType: string, parent?: string);
    static isValid(entity: VirtualContext): boolean;
    setOrAppendToProperty(property: string, value: Object, metaProperty?: string | undefined): void;
}
export default VirtualContext;
