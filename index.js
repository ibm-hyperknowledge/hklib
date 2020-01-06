/*
 * Copyright (c) 2016-present, IBM Research
 * Licensed under The MIT License [see LICENSE for details]
 */

"use strict";

exports.HKGraph        = require("./hkgraph");
exports.Node           = require("./node");
exports.Context        = require("./context");
exports.Connector      = require("./connector");
exports.Reference      = require("./reference");
exports.Link           = require("./link");
exports.Trail          = require("./trail");
exports.HKEntity       = require("./hkentity");

const Types            = require("./types");
exports.Types          = Types;
exports.NODE_TYPE      = Types.NODE;
exports.CONTEXT_TYPE   = Types.CONTEXT;
exports.LINK_TYPE      = Types.LINK;
exports.CONNECTOR_TYPE = Types.CONNECTOR;
exports.BIND_TYPE      = Types.BIND;
exports.INTERFACE      = Types.INTERFACE;
exports.TRAIL_TYPE     = Types.TRAIL;

const RolesTypes       = require("./roletypes");

exports.RolesTypes     = RolesTypes;
exports.SUBJECT        = RolesTypes.SUBJECT;
exports.OBJECT         = RolesTypes.OBJECT;
exports.PARENT         = RolesTypes.PARENT;
exports.CHILD          = RolesTypes.CHILD;

const ConnectorClass   = require("./connectorclass");
exports.ConnectorClass = ConnectorClass;
exports.HIERARCHY      = ConnectorClass.HIERARCHY;
exports.FACTS          = ConnectorClass.FACTS;
exports.REASONING      = ConnectorClass.REASONING;
exports.CONSTRAINT     = ConnectorClass.CONSTRAINT;
exports.CAUSAL         = ConnectorClass.CAUSAL;


exports.hyperify       = require("./hyperify");
exports.deserialize    = require("./deserialize");
exports.Constants      = require("./constants");
exports.HKDatasource   = require("./datasource/hkdatasource");
exports.GraphBuilder   = require("./graphbuilder");
