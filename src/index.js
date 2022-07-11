/*
 * Copyright (c) 2016-present, IBM Research
 * Licensed under The MIT License [see LICENSE for details]
 */
"use strict";

exports.Node = require("./node");
exports.HKNode = require("./node");
exports.Context = require("./context");
exports.HKContext = require("./context");
exports.Connector = require("./connector");
exports.HKConnector = require("./connector");
exports.Reference = require("./reference");
exports.HKReference = require("./reference");
exports.Link = require("./link");
exports.HKLink = require("./link");
exports.Trail = require("./trail");
exports.HKTrail = require("./trail");
exports.HKEntity = require("./hkentity");
exports.HKGraph = require("./hkgraph");

exports.VirtualNode = require("./virtualnode");
exports.HKVirtualNode = require("./virtualnode");
exports.VirtualContext = require("./virtualcontext");
exports.HKVirtualContext = require("./virtualcontext");
exports.VirtualLink = require("./virtuallink");
exports.HKVirtualLink = require("./virtuallink");

exports.Types = require("./types");
exports.HKTypes = require("./types");
exports.NODE_TYPE = require("./types").NODE;
exports.CONTEXT_TYPE = require("./types").CONTEXT;
exports.LINK_TYPE = require("./types").LINK;
exports.CONNECTOR_TYPE = require("./types").CONNECTOR;
exports.BIND_TYPE = require("./types").BIND;
exports.INTERFACE = require("./types").INTERFACE;
exports.TRAIL_TYPE = require("./types").TRAIL;
exports.ACTION_TYPE = require("./types").ACTION;
exports.VIRTUAL_NODE_TYPE = require("./types").VIRTUAL_NODE;
exports.VIRTUAL_CONTEXT_TYPE = require("./types").VIRTUAL_CONTEXT;
exports.VIRTUAL_LINK_TYPE = require("./types").VIRTUAL_LINK;

exports.VIRTUAL_SOURCE_PROPERTY = "virtualsrc";

exports.RoleTypes = require("./roletypes");
exports.HKRoleTypes = require("./roletypes");
exports.SUBJECT = require("./roletypes").SUBJECT;
exports.OBJECT = require("./roletypes").OBJECT;
exports.PARENT = require("./roletypes").PARENT;
exports.CHILD = require("./roletypes").CHILD;

exports.ConnectorClass = require("./connectorclass");
exports.HKConnectorClass = require("./connectorclass");
exports.HIERARCHY = require("./connectorclass").HIERARCHY;
exports.FACTS = require("./connectorclass").FACTS;
exports.REASONING = require("./connectorclass").REASONING;
exports.CONSTRAINT = require("./connectorclass").CONSTRAINT;
exports.CAUSAL = require("./connectorclass").CAUSAL;
exports.POSSIBILITY = require("./connectorclass").POSSIBILITY;
exports.POSSIBILITYRESOLVER = require("./connectorclass").POSSIBILITYRESOLVER;


exports.hyperify = require("./hyperify");
exports.deserialize = require("./deserialize");
exports.Constants = require("./constants");
exports.HKDatasource = require("./datasource/hkdatasource");
exports.HKRepository = require("./datasource/hkrepository");

exports.GraphBuilder = require("./graphbuilder");

exports.FI          = require("./fi/fi");
exports.FIOperator  = require("./fi/fioperator");
exports.FIAnchor    = require("./fi/fianchor");

