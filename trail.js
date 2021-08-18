/*
 * Copyright (c) 2016-present, IBM Research
 * Licensed under The MIT License [see LICENSE for details]
 */

'use strict'

const {List, Item} = require('linked-list');

const shortid   = require('shortid');
const Types     = require('./types');
const HKEntity  = require('./hkentity');
const Connector = require('./connector');
const Link      = require('./link');
const RoleTypes = require('./roletypes');


function Trail (id, actions, parent)
{

  if(arguments[0] && typeof arguments[0] === 'object' && isValid(arguments[0]))
  {
    let trail = arguments[0];

    this.id = trail.id || null;
    this.parent = trail.parent || null;
    this.properties = trail.properties || {};
    this.metaproperties = trail.metaproperties || {};
    this.interfaces = trail.interfaces || {};
    this.actions = trail.actions || [];

    if (this.actions && Object.keys(this.actions).length > 0) {
      loadActions.call (this); 
    }
  }
  else
  {
    this.id = id || null;
    this.parent = parent || null;
    this.interfaces = {};
    this.properties = {};
    this.metaproperties = {};
    this.actions = actions || [];
  }

  this.type = Types.TRAIL;
}

Trail.prototype = Object.create (HKEntity.prototype);

Object.assign(Trail.prototype, List.prototype); // Multiple inheritance with assign

Trail.prototype.constructor = Trail;


// Update a given action in trail
Trail.prototype.updateAction = function (oldAction, newAction)
{
  oldAction.prepend(newAction);
  oldAction.detach();
}

// Remove an action from trail using its reference
Trail.prototype.removeAction = function (action) 
{
    var action;
    if(typeof(action) === 'string') {
        this.action = this.search(action)
        
        //action not found
        if(!this.action){
            return
        }
    }
    else { 
        this.action = action;
    }

    this.action.detach();
}

Trail.prototype.serialize = function ()
{
  return {
      id: this.id,
      parent: this.parent,
      properties: this.properties,
      metaproperties: this.metaproperties,
      interfaces: this.interfaces,
      actions: this.actions,
      type: this.type
  };
}

function loadActions(actions = null)
{
  if(actions)
  {
    this.actions = actions;
    return;
  }

  let actionArray = []
  for (let i in this.actions) 
  {
    // create Action objects from parsed data
    if (this.actions[i].hasOwnProperty("from") && 
    this.actions[i].hasOwnProperty("to") && 
    this.actions[i].hasOwnProperty("agent") &&
    this.actions[i].hasOwnProperty("eventType"))
    {
      let from = new TrailNode(this.actions[i].from.split('#')[0], this.actions[i].from.split('#').length > 1 ? this.actions[i].from.split('#')[1] : "lambda")
      let to = new TrailNode(this.actions[i].to.split('#')[0], this.actions[i].to.split('#').length > 1 ? this.actions[i].to.split('#')[1] : "lambda")
      let event = { "id": i, "type": this.actions[i].eventType, "properties": this.actions[i].eventProperties, "timestamp": new Date(parseInt(this.actions[i].hasTimestamp))}
      let agent = this.actions[i].agent

      actionArray.push(new Action(from, to, event, agent));
    }
  }
  if (actionArray.length>0)
  {
    this.actions = actionArray; 
  }
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

// TrailNode is basically an envelope for a hknode and a target anchor
class TrailNode {
  constructor(nodeId, targetAnchor) {
    this.nodeId = nodeId;
    this.targetAnchor = targetAnchor;
  }

  toString() {
      return this.nodeId + "#" + this.targetAnchor;
  }

  toJSON() {
    return this.nodeId + "#" + this.targetAnchor;
  }
}

// actions hold references to source and destination trail 
// nodes (along with their respective target anchors), 
// the related event and an agent (user, system or content).
class Action extends Item {
  constructor(from, to, event, agent) 
  {
      super()
      this.from = from;
      this.to = to;
      this.agent = agent;
      this.event = event;

      if(!this.event)
      {
        return
      }

      // create timestamp if needed
      if(!this.event['timestamp'])
      {
          this.event['timestamp'] = new Date().getTime();
      }

      // get event id or create a new one
      if(!this.event['id'] || this.event['id'] == '') 
      {
          this.event['id'] = this.event.type + '_' + this.event.timestamp;
          this.id = this.event['id'];
      }
      else 
      {
          this.id = this.event['id'];
      }
  }

  getTime()
  {
      return new Date(this.event['timestamp']).getTime();
  }

  toString() 
  {
      return "[" + new Date(this.event['timestamp']).toISOString() + "] " + this.from + " -- " + this.event['eventId'] + " (by " + this.agent + ") --> " + this.to;
  }
}

Trail.type = Types.TRAIL;
Trail.isValid = isValid;


module.exports = Trail;

