/**
* Copyright (c) 2016-present, IBM Research
* Licensed under The MIT License [see LICENSE for details]
*/
export default FIAnchor;
declare class FIAnchor {
    /**
     * Create a new Anchor instance based on an FI (or string representing an FI) and a
     * ordered collection of arguments.
     *
     * @param {string|FI} FI or string representing fi.
     * @param {any|object} token Anything parseable as an fi or tuple token map. If argument list, use Map ordered  by key.
     * @param {string} operator set operator (i.e. descriptor). Default is null.
     */
    constructor(indexer: any, token: any | object, operator?: string);
    indexer: any;
    token: any;
    operator: string;
    toString(): string;
}
