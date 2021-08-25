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

// aliases `in` and `out` represent the entrypoint and
// output TrailNodes for this trail, which conceptually is
// done through the use of Port elements in Hyperknowledge
Trail.prototype.in = function(from) {
  if (from)
  {
    this.head.from = from;
  }
    
  return this.head.from;
}
Trail.prototype.out = function(to) {
  if (to)
  {
    this.tail.to = to;
  }
    
  return this.tail.to;
}

Trail.prototype.join = function(delimiter) {
    return this.toArray().join(delimiter)
}

// Update a given action in the trail
Trail.prototype.update = function(action, newAction){
    action.prepend(newAction)
    action.detach()
}

// Remove an action from the trail using its reference
Trail.prototype.remove = function(action) {
    var action
    if(typeof(action) === 'string') {
        this.action = this.search(action)
        
        //action not found
        if(!this.action){
            return
        }
    }
    else { 
        this.action = action 
    }

    this.action.detach()
}

// Get `num` actions (or the available ones) before `position`
Trail.prototype.getPrev = function(position, num=1){
    //check if it is a valid position
    if (position >= this.size || position <= 1 || this.size <= 1){
        return;
    }

    // get actions
    var action = this.toArray()[position]
    var resultSet = []
    while(action && action.prev){
        if (resultSet.length >= num) {
            if(resultSet.length == 1 && num == 1){
                return resultSet[0]
            }
            return resultSet
        }
        else {
            resultSet.push(action.prev)
        }
        
        action = action.prev
    }

    return resultSet
}

// Get `num` actions (or a n<num available ones) after `position`
// if a number is not given, 1 is assumed
Trail.prototype.getNext = function(position, num=1){
    // check if it is a valid position
    if (position >= this.size || position <= 1 || this.size <= 1){
        return;
    }

    // get actions
    var action = this.toArray()[position]
    var resultSet = []
    while(action && action.next){
        if (resultSet.length >= num) {
            if(resultSet.length == 1 && num == 1){
                return resultSet[0]
            }            
        }
        else {
            resultSet.push(action.next)
        }
        
        action = action.next
    }

    return resultSet
}

// Get the position of an action in the list,
// it might be useful for pagination. Returns 
// -1 in case action is not found in the list
Trail.prototype.getPositionOf = function(action){
    //search action by eventId
    var array = this.toArray()
    for (var i = 0; i < this.size; i++) {
        if(array[i].event["eventId"] == action.event["eventId"]){
            return i
        }
    }
    return -1
}

// Get an action at specified position
// a position = 0 is equivalent to trail.head
Trail.prototype.getActionAt = function(position) {
    //check if it is a valid position
    if (position < 0 || position >= this.size ){
        return;
    }

    //return action by position in array
    return this.toArray()[position]
}

// Search for action(s) either by an event identifier or by filters
Trail.prototype.search = function(eventId = null, filters){        
    if (!filters && eventId instanceof String) {
        filters = {'from': null, 'fromAnchor': 'lambda', 'to': null, 'toAnchor': 'lambda'}
    }
    else if (!filters && eventId instanceof Object){
        filters = eventId
        eventId = null
    }
    
    // nothing to be found
    if (!eventId && !filters['from'] && !filters['to']){
        return
    }

    // search actions by eventId
    var array = this.toArray()
    if (eventId){
        for (var i = 0; i < this.size; i++) {
            if(array[i].event["eventId"] == eventId){
                return array[i]
            }
        }
        return
    }

    // search actions by filters
    var resultSet = []
    for (var i = 0; i < this.size; i++) {
        if((filters['from'] && filters['to']) && array[i].from == filters['from'] && array[i].to == filters['to']){
            resultSet.push(array[i])
        }
        else if(array[i].from == filters['from'] || array[i].to == filters['to']){
            resultSet.push(array[i])
        }
    }
    return resultSet
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
      let from = new TrailNode(JSON.parse(this.actions[i].from).nodeId, JSON.parse(this.actions[i].from).nodeType, JSON.parse(this.actions[i].from).targetAnchor);
      let to = new TrailNode(JSON.parse(this.actions[i].to).nodeId, JSON.parse(this.actions[i].to).nodeType, JSON.parse(this.actions[i].to).targetAnchor);
      let event = { "id": i, "type": this.actions[i].eventType, "properties": JSON.parse(this.actions[i].eventProperties), "timestamp": new Date(this.actions[i].hasTimestamp)}
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


// TrailNode is basically an envelope for a hknode and a target anchor
class TrailNode {
  constructor(nodeId, nodeType, targetAnchor) {
    this.nodeId = nodeId;
    this.nodeType = nodeType;
    this.targetAnchor = targetAnchor;
  }

  toString() {
      return this.nodeId + "#" + this.targetAnchor;
  }

  // toJSON() {
  //   return this.nodeId + "#" + this.targetAnchor;
  // }
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
// Trail.Action = Action;
// Trail.TrailNode = TrailNode;

module.exports = Trail;

