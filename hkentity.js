/*
 * Copyright (c) 2016-present, IBM Research
 * Licensed under The MIT License [see LICENSE for details]
 */

"use strict";

/**
 * Creates a new Hyperknowledge entity
 * 
 * @constructor 
 */
function HKEntity()
{

}


/**
 * Callback function for `addEntities`
 * 
 * @callback PropertyCallback
 * @param {Property} property Property key
 * @param {Value} value Property value
 */

/**
 * Iterate throuch each valid property of the entity
 * 
 * @param {PropertyCallback} callback
 */
HKEntity.prototype.foreachProperty = function(callback = ()=>{})
{
	let properties = this.properties || {};
	let metaProperties = this.metaProperties || {};

	let allProperties = Object.keys(properties);
	allProperties = allProperties.concat(Object.keys(metaProperties));

	allProperties = new Set(allProperties);

    for(let k of allProperties)
    {
		callback(k, properties[k] !== undefined ? properties[k] : null, metaProperties[k] !== undefined ? metaProperties[k] : null);
    }
}

/**
 * Set a property to entity, overwrite if already exists
 * 
 * @param {string} property Property key
 * @param {object} value Property value, can be number, string or an array of strings or numbers
 * @param {string} metaProperty Metaproperty, a string that annotates the property (e. g. A type)
 */
HKEntity.prototype.setProperty = function(property, value, metaProperty = null)
{
    if(property)
    {
        if(value !== undefined && value !== null)
        {
            if(!this.properties)
            {
                this.properties = {};
            }
    
            this.properties[property] = value;
        }

        if(metaProperty)
        {
            this.setMetaProperty(property, metaProperty);
        }
    }
}

/**
 * Append a value to a property, create it if it does not exist, if the property exists and it is not an array convert to an array
 * 
 * @param {string} property Property key
 * @param {object} value Property value, can be number, string or an array of strings or numbers (in the latter append to the previous values).
 * @param {string} metaProperty Metaproperty, a string that annotates the property (e. g. A type)
 */
HKEntity.prototype.appendToProperty = function(property, value, metaProperty)
{
    if(property)
    {
        if(value !== undefined && value !== null)
        {
            if(!this.properties)
            {
                this.properties = {};
            }
    
            if(this.properties.hasOwnProperty(property))
            {
                if(!Array.isArray(this.properties[property]))
                {
                    this.properties[property] = [this.properties[property]];
                }

                if(Array.isArray(value))
                {
                    this.properties[property] = this.properties[property].concat(value)
                }
                else
                {
                    this.properties[property].push(value);
                }
            }
            else
            {
                if(!Array.isArray(value))
                {
                    value = [value];
                }
                this.properties[property] = value;
            }
        }
        if(metaProperty)
        {
            this.setMetaProperty(metaProperty);
        }
    }
}



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
HKEntity.prototype.removePropertyValue = function(property, value)
{
    let changed = false;
    if(property)
    {
        let deleteProperty = false;
        if(value !== undefined && value !== null)
        {
            if(this.properties)
            {
    
                if(this.properties.hasOwnProperty(property))
                {
                    if(!Array.isArray(this.properties[property]))
                    {
                        if(this.properties[property] === value){
                            deleteProperty = true;
                        } 
                    } else {

                        if(Array.isArray(value))
                        {
                            Console.log("Operation not supported!");
                        }
                        else
                        {
                            let vindex = this.properties[property].indexOf(value);
                            if (vindex >=0 ){
                                delete this.properties[property][vindex];
                                changed = true;
                                if (this.properties[property].length == 0){
                                    deleteProperty = true;
                                }
                            }
                        }
                    }
                }
            }
        }
        if(deleteProperty)
        {
            this.removeMetaProperty(property);
            this.properties[property] = null;

            changed = true;
        }
    }
    return changed;
}


/**
 * Append or create a property with value, create it if it does not exist as single value, if the property exists and it is not an array convert to an array
 * 
 * @param {string} property Property key
 * @param {object} value Property value, can be number, string or an array of strings or numbers (in the latter append to the previous values).
 * @param {string} metaProperty Metaproperty, a string that annotates the property (e. g. A type)
 */
HKEntity.prototype.setOrAppendToProperty = function(property, value, metaProperty = null)
{
    if(this.hasProperty(property))
    {
        this.appendToProperty(property, value, metaProperty)
    }
    else
    {
        this.setProperty(property, value, metaProperty);
    }
}

/**
 * Get a property value for a given key
 * 
 * @param {string} property Property key
 * @return {Object} The object value associated to the input property
 */
HKEntity.prototype.getProperty = function(property)
{
    if(this.properties)
    {
        if(this.properties.hasOwnProperty(property))
        {
            return this.properties[property];
        }
    }
    return null;
}

/**
 * Set a metaproperty value for a given key
 * 
 * @param {string} metaProperty Metaproperty key
 * @param {string} value Metaproperty, a string that annotates the property (e. g. A type)
 */
HKEntity.prototype.setMetaProperty = function(metaProperty, value)
{
    if(metaProperty)
    {
        if(value !== undefined && value !== null)
        {
            if(!this.metaProperties)
            {
                this.metaProperties = {};
            }
    
            this.metaProperties[metaProperty] = value;
        }
    }
}

/**
 * Get a metaproperty value for a given key
 * 
 * @param {string} metaProperty Metaproperty key
 * @returns {string} the metaproperty value
 */
HKEntity.prototype.getMetaProperty = function(metaProperty)
{
    if(this.metaProperties)
    {
        if(this.metaProperties.hasOwnProperty(metaProperty))
        {
            return this.metaProperties[metaProperty];
        }
    }
    return null;
}


/**
 * Remove a metaproperty 
 * 
 * @param {string} metaProperty Metaproperty to delete
 */
HKEntity.prototype.removeMetaProperty = function(metaProperty)
{
    let change = false;
    if(metaProperty)
    {
        if(this.metaProperties) {
            this.metaProperties[metaProperty] = null;
            change = true;
        }

    }
    return change;
}


/**
 * Check if the entity has the property
 * 
 * @param {string} property Property key
 * @returns {boolean} A boolean indicating that the entity contains the specified property
 */
HKEntity.prototype.hasProperty = function(property)
{
    if(this.properties)
    {
        return this.properties.hasOwnProperty(property);
    }
    return false;
}

/**
 * (Internal) Serialize the properties
 * 
 */
HKEntity.prototype.serializeProperties = function()
{
    if(this.properties)
    {
        let properties = {};
        for(let k in this.properties)
        {
            if(this.properties.hasOwnProperty(k))
            {
                if(Array.isArray(this.properties[k]))
                {
                    properties[k] = this.properties[k].slice(0);
                }
                else
                {
                    properties[k] = this.properties[k];
                }
            }
        }
        return properties;
    }
    else
    {
        return null;
    }
}

/**
 * (Internal) Serialize the metaproperties
 * 
 */
HKEntity.prototype.serializeMetaProperties = function()
{
    if(this.metaProperties)
    {
        let metaProperties = {};
        for(let k in this.metaProperties)
        {
            if(this.metaProperties.hasOwnProperty(k))
            {
                metaProperties[k] = this.metaProperties[k];
            }
        }
        return metaProperties;
    }
    else
    {
        return null;
    }
}

/**
 * Append a dictionary of properties, merging both data, overwrites the previous properties
 * 
 * @param {string} properties A dictionary of new properties
 */
HKEntity.prototype.appendProperties = function(properties)
{
    if(!this.properties)
    {
        this.properties = {};
    }
    
    for(let k in properties)
    {
        if(properties.hasOwnProperty(k))
        {
            if(properties[k] != null && properties[k] != undefined)
            {
                this.properties[k] = properties[k];
            }
        }
    }
}

module.exports = HKEntity;