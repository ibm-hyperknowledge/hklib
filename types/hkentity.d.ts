/**
* Copyright (c) 2016-present, IBM Research
* Licensed under The MIT License [see LICENSE for details]
*/
export = HKEntity;
declare class HKEntity {
    /**
     * Callback function for `addEntities`
     *
     * @callback PropertyCallback
     * @param {Property} property Property key
     * @param {Value} value Property value
     */
    /**
     * Iterate through each valid property of the entity
     *
     * @param {PropertyCallback} callback
     */
    foreachProperty(callback?: (property: Property, value: Value) => any): void;
    /**
     * Set a property to entity, overwrite if already exists
     *
     * @param {string} property Property key
     * @param {object} value Property value, can be number, string or an array of strings or numbers
     * @param {string} metaProperty Metaproperty, a string that annotates the property (e. g. A type)
     */
    setProperty(property: string, value: object, metaProperty?: string): void;
    properties: {} | undefined;
    /**
     * Append a value to a property, create it if it does not exist, if the property exists and it is not an array convert to an array
     *
     * @param {string} property Property key
     * @param {object} value Property value, can be number, string or an array of strings or numbers (in the latter append to the previous values).
     * @param {string} metaProperty Metaproperty, a string that annotates the property (e. g. A type)
     */
    appendToProperty(property: string, value: object, metaProperty: string): void;
    /**
     *  Remove property value. If property or value does not exist, does nothing. If the property
     * becomes empty, remove the property altogether.
     *
     *
     * @param {string} property Property key to remove
     * @param {object} value Property value, can be number, string or an array of strings or numbers (in the latter append to the previous values).
     *
     * @returns {boolean} T
     */
    removePropertyValue(property: string, value: object): boolean;
    /**
     * Append or create a property with value, create it if it does not exist as single value, if the property exists and it is not an array convert to an array
     *
     * @param {string} property Property key
     * @param {object} value Property value, can be number, string or an array of strings or numbers (in the latter append to the previous values).
     * @param {string} metaProperty Metaproperty, a string that annotates the property (e. g. A type)
     */
    setOrAppendToProperty(property: string, value: object, metaProperty?: string): void;
    /**
     * Get a property value for a given key
     *
     * @param {string} property Property key
     * @return {Object} The object value associated to the input property
     */
    getProperty(property: string): Object;
    /**
     * Set a metaproperty value for a given key
     *
     * @param {string} metaProperty Metaproperty key
     * @param {string} value Metaproperty, a string that annotates the property (e. g. A type)
     */
    setMetaProperty(metaProperty: string, value: string): void;
    metaProperties: {} | undefined;
    /**
     * Get a metaproperty value for a given key
     *
     * @param {string} metaProperty Metaproperty key
     * @returns {string} the metaproperty value
     */
    getMetaProperty(metaProperty: string): string;
    /**
     * Remove a metaproperty
     *
     * @param {string} metaProperty Metaproperty to delete
     */
    removeMetaProperty(metaProperty: string): boolean;
    /**
     * Check if the entity has the property
     *
     * @param {string} property Property key
     * @returns {boolean} A boolean indicating that the entity contains the specified property
     */
    hasProperty(property: string): boolean;
    /**
     * (Internal) Serialize the properties
     *
     */
    serializeProperties(): {} | null;
    /**
     * (Internal) Serialize the metaproperties
     *
     */
    serializeMetaProperties(): {} | null;
    /**
     * Append a dictionary of properties, merging both data, overwrites the previous properties
     *
     * @param {string} properties A dictionary of new properties
     */
    appendProperties(properties: string): void;
}
