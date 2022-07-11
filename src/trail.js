/*
 * Copyright (c) 2016-present, IBM Research
 * Licensed under The MIT License [see LICENSE for details]
 */

'use strict'

const {List, Item}    = require('linked-list');
const Types     = require('./types');
const HKEntity  = require('./hkentity');

class Trail extends HKEntity
{
  /**
   * Constructs a new trail object.
   *
   * @param {string | null} [id] Some id string for this trail. Deprecated: json object, which will deserialized as a Trail.
   * @param {List<Trail.Action> | Array<string> | null} [actions] Trail actions. 
   * @param {string | null} [parent] Parent id.
   */

  constructor(id = null, actions = null, parent = null)
  {
    super();

    /**
     *
     * Id of this node. Might be null.
     *
     * @public
     * @type {string | null}
     *
     */
    this.id = id;

    /**
     * Trail actions. Might be null.
     *
     * @public
     * @type {List<Trail.Action> | Array<string> | null}
     *
     */
    this.actions = actions || new List();

    /**
     * Parent id. Might be null.
     *
     * @public
     * @type {string | null}
     *
     */
    this.parent = parent;

    /**
     *  Type of this node.
     *
     * @public
     * @type {string | null}
     */
    this.type = Types.TRAIL;

    /**
     * Interface attributed to this node.
     *
     * @public
     * @type {Object.<string,{type : string, properties : Object.<string, Object>}>}
     */
    this.interfaces = {};

    /**
     * @public
     * @type {Object.<string, string | number | Object>
     */
    this.properties = {};

    /**
     * @public
     * @type {Object.<string, string | number | Object>
     */
    this.metaproperties = {};

    // TODO: this code seems to copy a trail passed as an id. Create a separate clone/json-deserialize function for that.
    if(arguments[0] && typeof arguments[0] === 'object' && isValid(arguments[0]))
    {
      let trail = arguments[0];

      this.id = trail.id || null;
      this.parent = trail.parent || null;
      this.properties = trail.properties || {};
      this.metaproperties = trail.metaproperties || {};
      this.interfaces = trail.interfaces || {};
      this.actions = trail.actions || new List();

      if (this.actions && Object.keys(this.actions).length > 0) {
        this.loadActions();
      }
    }
  }
  
  /**
   * Update a given action in trail.
   * 
   * @param {Trail.Action} oldAction 
   * @param {Trail.Action} newAction 
   */
  updateAction(oldAction, newAction)
  {
    oldAction.prepend(newAction);
    oldAction.detach();
  }

  /**
   * Add an action to a trail respecting timestamp ordering.
   * 
   * @param {Trail.Action} action 
   * @returns {Trail.Action}
   */ 
  addAction(action) 
  {
    var current = this.actions.head;

    while (current)
    {
      if (new Date(current.event['timestamp']) - new Date(action.event['timestamp']))
      {
        return current.prepend(action);
      }
      current = current.next;
    }

    return this.actions.append(action);
  }

  /**
   * Remove an action from trail using its reference.
   * 
   * @param {Trail.Action} action 
   * @returns {Trail.Action}
   */ 
  removeAction(action) 
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

  /**
   * `append` and `prepend` operations are 
   * handled by our linked list structure.
   * 
   * @param {Trail.Action} action 
   * @returns {Trail.Action}
   */ 
  append(action)
  {
    return this.actions.append(action);
  }

  /**
   * 
   * @param {Trail.Action} action 
   * @returns {Trail.Action}
   */ 
  prepend(action)
  {
    return this.actions.prepend(action);
  }

  /**
   * Aliases `in` and `out` represent the input and 
   * output TrailNodes for a trail, which conceptually is
   * done through the use of Port elements in Hyperknowledge.
   * 
   * @param {Trail.Action | null} from
   * @returns {Trail.Action}
   */ 
  in(from = null)
  {
    if (from)
    {
      this.actions.head.from = from;
    }
      
    return this.actions.head.from;
  }

  /**
   * 
   * @param {Trail.Action | null} to 
   * @returns {Trail.Action}
   */ 
  out(to = null) 
  {
    if(this.actions.tail)
    {
      if (to)
      {
        this.actions.tail.to = to;
      }
        
      return this.actions.tail.to;
    }

    if (to)
    {
      this.actions.head.to = to;
    }
      
    return this.actions.head.to;
  }

  /**
   * 
   * @returns {number}
   */ 
  size()
  {
    if (this.actions.constructor === List)
    {
      return this.actions.size;
    }
    else if (Array.isArray(this.actions))
    {
      return this.actions.length;
    }
  }

  /**
   * 
   * @param {string} delimiter 
   * @returns {string}
   */ 
  join(delimiter)
  {
      return this.actions.toArray().join(delimiter)
  }

  /**
   *  Update a given action in the trail.
   * 
   * @param {Trail.Action} action
   * @param {Trail.Action} newAction  
   */ 
  //
  update(action, newAction)
  {
      action.prepend(newAction)
      action.detach()
  }

  /**
   * Remove an action from the trail using its reference.
   * 
   * @param {Trail.Action | string} action 
   * @returns {Trail.Action | null}
   */ 
  // 
  remove(action)
  {
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

  /**
   * Get `num` actions (or the available ones) before `position`.
   * 
   * If a number is not given, 1 is assumed.
   * 
   * @param {number} position
   * @param {number | null} num 
   * @returns {Array<Trail.Action> | null}
   */ 
    getPrev = function(position, num=1)
    {
      //check if it is a valid position
      if (position >= this.actions.size || position <= 1 || this.actions.size <= 1){
          return;
      }

      // get actions
      var action = this.actions.toArray()[position]
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

  /**
   * Get `num` actions (or a n<num available ones) after `position`.
   * 
   * If a number is not given, 1 is assumed.
   * 
   * @param {number} position
   * @param {number | null} num 
   * @returns {Array<Trail.Action> | null}
   */
  getNext(position, num=1)
  {
      // check if it is a valid position
      if (position >= this.actions.size || position <= 1 || this.actions.size <= 1){
          return;
      }

      // get actions
      var action = this.actions.toArray()[position]
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

  /**
   * Get the position of an action in the list,
   * it might be useful for pagination. 
   * 
   * Returns -1 in case action is not found in the list.
   * 
   * @param {Trail.Action} action 
   * @returns {number}
   */ 

  getPositionOf(action)
  {
      //search action by eventId
      var array = this.actions.toArray();
      for (var i = 0; i < this.actions.size; i++) {
          if(array[i].event["id"] == action.event["id"]){
              return i;
          }
      }
      return -1;
  }

  /**
   * Get an action at specified position.
   * 
   * Position = 0 is equivalent to trail.head.
   * 
   * @param {number} position
   * @returns {Trail.Action}
   */ 
  getActionAt(position) 
  {
      //check if it is a valid position
      if (position < 0 || position >= this.actions.size ){
          return;
      }

      //return action by position in array
      return this.actions.toArray()[position]
  }

  /**
   * Search for action(s) either by an event identifier or by filters.
   * 
   * @param {Object | string | null} eventId
   * @param {Object} filters
   * @return {Array<Trail.Action> | null}
   */ 
  search(eventId = null, filters)
  {        
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
      var array = this.actions.toArray();
      if (eventId){
          for (var i = 0; i < this.actions.size; i++) {
              if(array[i].event["id"] == eventId){
                  return array[i];
              }
          }
          return;
      }

      // search actions by filters
      var resultSet = []
      for (var i = 0; i < this.actions.size; i++) {
          if((filters['from'] && filters['to']) && array[i].from == filters['from'] && array[i].to == filters['to']){
              resultSet.push(array[i])
          }
          else if(array[i].from == filters['from'] || array[i].to == filters['to']){
              resultSet.push(array[i])
          }
      }
      return resultSet
  }

  /**
   * 
   * @param {Array<Trail.Action> | null} actions 
   * @return {List<Trail.Action> | null}
   */ 
  loadActions(actions = null)
  {

    // use array of actions if passed
    if(actions && Array.isArray(actions))
    {
      if(actions[0].event.timestamp)
      {
        this.actions = new List(...sort(actions));
      }
      else {
        this.actions = new List(...actions);
      }
      return this.actions;
    }

    let actionArray = []
    let actionIds = []
    for (let i in this.actions) 
    {
      // create Action object from json object
      if (this.actions[i] && this.actions[i].hasOwnProperty("from") && 
      this.actions[i].hasOwnProperty("to") && 
      this.actions[i].hasOwnProperty("agent") &&
      this.actions[i].hasOwnProperty("event"))
      {
        let from = new TrailNode(this.actions[i].from.nodeId, this.actions[i].from.nodeType, this.actions[i].from.targetAnchor);
        let to = new TrailNode(this.actions[i].to.nodeId, this.actions[i].to.nodeType, this.actions[i].to.targetAnchor);
        let event = { "id": this.actions[i].event.id, "type": this.actions[i].event.type, "properties": this.actions[i].event.properties, "timestamp": new Date(this.actions[i].event.timestamp)};
        let agent = this.actions[i].agent;

        actionArray.push(new Action({from, to, event, agent}));
      }
      else if(this.actions[i] && this.actions[i].hasOwnProperty("event") && this.actions[i].event.hasOwnProperty("timestamp"))
      {
        // we got event's id and timestamp
        actionArray.push(new Action({event: {"id": i, "timestamp": new Date(this.actions[i].event.timestamp)}}));
      }
      else if(Array.isArray(this.actions))
      {
        // all we got is an Array with the event's id
        actionIds.push(this.actions[i]);
      }
      else 
      {
        // all we got is event's id
        actionIds.push(i);
      }
    }
    
    // sort action items before creating list
    if (actionArray.length > 0)
    {
      this.actions = new List(...sort(actionArray));
    }
    else if (actionIds.length > 0)
    {
      this.actions = actionIds;
    }
  }

  /**
   * 
   * @param {Object} entity 
   * @returns {boolean}
   */ 
  static isValid(entity)
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

  /**
   * 
   * @param {Array<Object> | null} actions 
   * @returns {Array<Object>} 
   */ 
  static sort(actions = null)
  {
    if (actions && Array.isArray(actions) && actions[0].event.timestamp.constructor === Date)
    {
      // sort and return object array based on timestamp
      return actions.sort(function(action1, action2)
      {
        return action1.event['timestamp'] - action2.event['timestamp'];
      });
    }
    else if (actions && Array.isArray(actions) && (actions[0].event.timestamp.constructor === String || actions[0].event.timestamp.constructor === Number))
    {
      // sort Action array based on timestamp
      return actions.sort(function(action1, action2)
      {
        return new Date(action1.event['timestamp']) - new Date(action2.event['timestamp']);
      });
    }
  }

  /**
   * 
   * @returns {Object.<string,any>}
   * 
   */ 
  toJSON()
  {
    let actionArray = [];

    if (this.actions.constructor === List)
    {
      //in case we have only action ids and timestamps
      if(this.actions.head && (!this.actions.head.from && !this.actions.head.to && !this.actions.head.agent))
      {
        let action = this.actions.head;

        while(action)
        {
          actionArray.push(action.id);
          action = action.next;
        }
      }
      else {
        actionArray = this.actions.toArray();
      }
    }
    else if (Array.isArray(this.actions))
    {
      actionArray = this.actions;
    }

    return {
      id: this.id,
      parent: this.parent,
      properties: this.properties,
      metaproperties: this.metaproperties,
      interfaces: this.interfaces,
      actions: actionArray,
      type: this.type
    }; 
  }

  /**
   * 
   * @returns {Object.<string,any>} 
   */ 
  serialize()
  {
    let actions;
    if(this.actions instanceof Array)
    {
      actions = this.actions;
    }
    else
    {
      actions = this.actions.toArray();
    }

    return {
        id: this.id,
        parent: this.parent,
        properties: this.properties,
        metaproperties: this.metaproperties,
        interfaces: this.interfaces,
        actions: actions,
        type: this.type
    };
  }
}

/**
 * TrailNode is basically an envelope for a hknode and a target anchor.
 */
Trail.TrailNode = class TrailNode
 {
  /**
   *  Constructs a new Trail object.
   *
   * @param {string} [nodeId] Some id string for this TrailNode. 
   * @param {string} [nodeType] Type of the TrailNode.
   * @param {string} [targetAnchor]
   */
  constructor(nodeId, nodeType, targetAnchor) 
  {
    /**
     *
     * Id of this TrailNode.
     *
     * @public
     * @type {string}
     *
     */
    this.nodeId = nodeId;

    /**
     *
     * Type of this TrailNode.
     *
     * @public
     * @type {string}
     *
     */
    this.nodeType = nodeType;

    /**
     * @public
     * @type {string}
     */
    this.targetAnchor = targetAnchor;
  }

  /**
   *
   * @return {string}
   */
  toString()
  {
      return this.nodeId + "#" + this.targetAnchor;
  }

  // toJSON() {
  //   return this.nodeId + "#" + this.targetAnchor;
  // }
}

/**
 * actions hold references to source and destination trail
 * nodes (along with their respective target anchors), 
 * the related event and an agent (user, system or content).
 */
Trail.Action = class Action extends Item
 {
  /** Constructs a new Action object.
   *
   * @param {Object<{from: Trail.Action | null, to: Trail.Action | null, event: Object | null, agent: string | null}>}
   * 
   */
  constructor({from = null, to = null, event = {}, agent = null} = {}) 
  {
      super();
      this.from = from;
      this.to = to;
      this.agent = agent;
      this.event = event;
      this.type = Types.ACTION;

      // create timestamp if needed
      // if(!this.event['timestamp'])
      // {
      //     this.event['timestamp'] = new Date().getTime();
      // }

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

  /**
   * 
   * @returns {number} 
   */
  getTime()
  {
      return new Date(this.event['timestamp']).getTime();
  }

  /**
   * 
   * @returns {string} 
   */
  toString() 
  {
    if(this.from && this.to && this.agent && this.event && this.event.id )
    {
      return JSON.stringify({ from: this.from, to: this.to, agent: this.agent, event: this.event, id: this.event.id });
    }
    else 
    {
      return this.event.id;
    }
  }

  /**
   * 
   * @returns {Object.<string,any>} 
   */
  toJSON() 
  {
    if(this.from && this.to && this.agent && this.event && this.event.id )
    {
      return { from: this.from, to: this.to, agent: this.agent, event: this.event, id: this.event.id };
    }
    else 
    {
      return this.event.id;
    }
  }
}

Trail.type = Types.TRAIL;
const isValid = Trail.isValid;
const sort = Trail.sort;
const Action = Trail.Action;
const TrailNode = Trail.TrailNode;
module.exports = Trail;
