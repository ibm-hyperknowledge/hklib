/*
 * Copyright (c) 2016-present, IBM Research
 * Licensed under The MIT License [see LICENSE for details]
 */

'use strict'

const shortid   = require('shortid');
const Types     = require('./types');
const HKEntity  = require('./hkentity');
const Connector = require('./connector');
const Link      = require('./link');
const RoleTypes = require('./roletypes');

const CONNECTOR_NAME = 'occurs';

const vConnector = new Connector (CONNECTOR_NAME, 'f');
vConnector.addRole ('sub', RoleTypes.SUBJECT);
vConnector.addRole ('obj', RoleTypes.OBJECT);

function Trail (id, parent)
{
  if(arguments[0] && typeof arguments[0] === 'object' && isValid(arguments[0]))
  {
    let trail = arguments[0];

    this.id = trail.id || null;
    this.parent = trail.parent || null;
    this.properties = trail.properties || {};
    this.metaproperties = trail.metaproperties || {};
    this.interfaces = trail.interfaces || {};
    this.children = trail.children || [];
    _loadSteps.call (this);
  }
  else
  {
    this.id = id || null;
    this.parent = parent || null;
    this.interfaces = {};
    this.properties = {};
    this.metaproperties = {};
    this.children = [];
    this.steps = [];
  }

  this.type = Types.TRAIL;
}

Trail.prototype = Object.create (HKEntity.prototype);
Trail.prototype.constructor = Trail;

Trail.prototype.addStep = function (key, properties)
{
  let ts = properties.begin || new Date().toISOString();
  properties.begin = ts;

  if (this.steps.length > 0)
  {
    let lastStep = this.steps[this.steps.length - 1].key;
    if (! this.interfaces[lastStep].properties.end )
    {
      this.interfaces[lastStep].properties.end = ts;
    }
  }

  this.steps.push ({key: key, begin: ts});
  this.addInterface (key, 'temporal', properties);
}

Trail.prototype.addInterface  = function (key, type, properties)
{
  this.interfaces[key] = {type: type, properties: properties}
}

Trail.prototype.createLinksFromSteps = function ()
{
	let vEntities = [vConnector];

	for (let key in this.interfaces)
	{
		let interProp = this.interfaces[key].properties;
		if (!interProp) continue;

		if (interProp.obj)
		{
			let l = new Link (shortid(), vConnector.id, this.parent);
			l.addBind ('sub', interProp.obj, interProp.objInterface);
			l.addBind ('obj', this.id);
			vEntities.push (l);
		}
	}
	return vEntities;
}

Trail.prototype.serialize = function ()
{
  return {
      id: this.id,
      parent: this.parent,
      properties: this.properties,
      metaproperties: this.metaproperties,
      interfaces: this.interfaces,
      type: this.type
  };
}

function _loadSteps ()
{
  let steps = [];
  for (let key in this.interfaces)
  {
    let begin = new Date (Date.parse(this.interfaces[key].properties.begin));
    let end = new Date (Date.parse(this.interfaces[key].properties.end));

    this.interfaces[key].properties.begin = begin;
    this.interfaces[key].properties.end = end;

    steps.push ( { key: key, begin: begin } );
  }

  steps.sort (
    (a,b) =>
    {
      if (a.begin < b.begin )
      {
        return -1;
      }
      if (a.begin > b.begin )
      {
        return 1;
      }

      return 0;
    });

  this.steps = steps;
}

function isValid(entity)
{
  let isValid = false;
  if (entity && typeof (entity) === 'object' && !Array.isArray(entity))
  {
    if (entity.hasOwnProperty('type') && entity.type === Types.TRAIL &&
        entity.hasOwnProperty('id') && entity.hasOwnProperty('parent'))
    {
      isValid = true;
    }
  }

  return isValid;
}

Trail.type = Types.TRAIL;
Trail.isValid = isValid;

module.exports = Trail;
