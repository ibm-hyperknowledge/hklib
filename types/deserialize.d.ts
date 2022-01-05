/**
* Copyright (c) 2016-present, IBM Research
* Licensed under The MIT License [see LICENSE for details]
*/
export = deserialize;
/**
 * Deserialize objects to create instances of HKEntity
 *
 * @param {object} serialized an object or an array of objects to create Hyperknowledge entities
 * @returns {HKEntity | HKEntity[] | null} An entity or an array of entities that are instance of HKEntity. Or returns null if the input is not valid
 */
declare function deserialize(serialized: object): HKEntity | HKEntity[] | null;
import HKEntity = require("./hkentity");
