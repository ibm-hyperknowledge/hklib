/**
* Copyright (c) 2016-present, IBM Research
* Licensed under The MIT License [see LICENSE for details]
*/
export = FI;
/**
 * Fragment Identifier (FI.js)
 */
declare class FI {
    /**
     * Create an FI object from an string containing an FI.
     *
     * @param {string} strFI string object containing an FI to be parsed.
     *
     */
    static parseFI(strFI: string): FI;
    /**
     * Create a new FI object.
     *
     * @param {string|FI} artifact string with atomic FIjs or Fijs
     * @param {string|FIAnchor} anchor string or FIAnchor representing anchor
     */
    constructor(artifact: string | FI, anchor?: string | FIAnchor);
    _artifact: any;
    anchor: string | FIAnchor;
    get artifact(): any;
    hasAnchor(): boolean;
    /**
     * Get base artifact of this FI, walking FI.artifact recursively to the base.
     */
    getBaseArtifact(): any;
    /**
     * Returns string representation of all anchors from getBaseArtifact()
     */
    toStringTail(): string;
    toString(): any;
}
import FIAnchor = require("./fianchor");
