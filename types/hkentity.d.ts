/**
* Copyright (c) 2016-present, IBM Research
* Licensed under The MIT License [see LICENSE for details]
*/
export = HKEntity;
declare class HKEntity {
    /**
     * @public
     * @type {Object.<string, Object>}
     * */
    public properties: {
        [x: string]: Object;
    };
    /**
     *  Type of this entity.
     *
     * @public
     * @type {string | null}
    */
    public type: string | null;
    /**
     * Callback function for `foreachProperty`
     *
     * @callback PropertyCallback
     * @param {string} property Property key
     * @param {Object} value Property value
     * @param {string | null} metaProperty Metaproperty value, if any
     */
    /**
     * Iterate through each valid property of the entity
     *
     * @param {PropertyCallback} callback
     */
    foreachProperty(callback?: (property: string, value: Object, metaProperty: string | null) => any): void;
    /**
     * Set a property to entity, overwrite if already exists
     *
     * @param {string} property Property key
     * @param {Object} value Property value, can be number, string or an array of strings or numbers
     * @param {string} [metaProperty] Metaproperty, a string that annotates the property (e. g. A type)
     */
    setProperty(property: string, value: Object, metaProperty?: string | undefined): void;
    /**
     * Append a value to a property, create it if it does not exist, if the property exists and it is not an array convert to an array
     *
     * @param {string} property Property key
     * @param {Object} value Property value, can be number, string or an array of strings or numbers (in the latter append to the previous values).
     * @param {string} [metaProperty] Optioanl metaproperty, a string that annotates the property (e.g., a XSD type)
     *
     * @returns {void}
     */
    appendToProperty(property: string, value: Object, metaProperty?: string | undefined): void;
    /**
     *  Removes property value. If property or value does not exist, does nothing. If the property
     * becomes empty, remove the property altogether.
     *
     * @param {string} property Property key to remove
     * @param {Object} value Property value, can be number, string or an array of strings or numbers (in the latter append to the previous values).
     *
     * @returns {boolean} True if properties changed; false if not.
     */
    removePropertyValue(property: string, value: Object): boolean;
    /**
     * Append or create a property with value, create it if it does not exist as single value, if the property exists and it is not an array convert to an array.
     *
     * @param {string} property Property key.
     * @param {Object} value Property value, can be number, string or an array of strings or numbers (in the latter append to the previous values).
     * @param {string} [metaProperty] Metaproperty, a string that annotates the property (e. g. A type).
     */
    setOrAppendToProperty(property: string, value: Object, metaProperty?: string | undefined): void;
    /**
     * Get a property value for a given key.
     *
     * @param {string} property Property key
     * @return {Object} The object value associated to the input property
     */
    getProperty(property: string): Object;
    /**
     * Set a metaproperty value for a given key.
     *
     * @param {string} metaProperty Metaproperty key
     * @param {string} value Metaproperty, a string that annotates the property (e. g. A type)
     *
     * @returns {void}
     */
    setMetaProperty(metaProperty: string, value: string): void;
    metaProperties: {} | undefined;
    /**
     * Get a metaproperty value for a given key.
     *
     * @param {string} metaProperty Metaproperty key.
     * @returns {string | null} the metaproperty value.
     *
     */
    getMetaProperty(metaProperty: string): string | null;
    /**
     * Remove a metaproperty
     *
     * @param {string} metaProperty Metaproperty to delete.
     *
     * @returns {boolean} Returns true if the property has been deleted; false if not or metaProperty does not exist.
     */
    removeMetaProperty(metaProperty: string): boolean;
    /**
     * Check if the entity has the property.
     *
     * @param {string} property Property key.
     * @returns {boolean} A boolean indicating that the entity contains the specified property.
     */
    hasProperty(property: string): boolean;
    /**
     * (Internal) Serialize the properties. Used by serialize() functions of extending classes.
     *
     */
    serializeProperties(): {} | null;
    /**
     * (Internal) Serialize the metaproperties.
     *
     */
    serializeMetaProperties(): {} | null;
    /**
     * Append a dictionary of properties, merging both data, overwrites the previous properties.
     *
     * @param {string} properties A dictionary of new properties.
     *
     * @returns {void}
     */
    appendProperties(properties: string): void;
}
