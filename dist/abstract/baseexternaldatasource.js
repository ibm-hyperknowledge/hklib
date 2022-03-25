"use strict";
const tslib_1 = require("tslib");
const types_1 = tslib_1.__importDefault(require("../types"));
const virtualcontext_1 = tslib_1.__importDefault(require("../virtualcontext"));
const virtualnode_1 = tslib_1.__importDefault(require("../virtualnode"));
const virtuallink_1 = tslib_1.__importDefault(require("../virtuallink"));
class BaseExternalDatasource {
    constructor() { }
    transformToVirtualEntities(entities, contextId, endpoint) {
        for (let e in entities) {
            let entity = entities[e];
            switch (entity.type) {
                case types_1.default.CONTEXT:
                    {
                        endpoint = endpoint ? endpoint : "";
                        entity = new virtualcontext_1.default(entity, endpoint, contextId);
                        break;
                    }
                case types_1.default.NODE:
                    {
                        entity = new virtualnode_1.default(entity, contextId);
                        break;
                    }
                case types_1.default.LINK:
                    {
                        entity = new virtuallink_1.default(entity, contextId);
                        break;
                    }
            }
            if (entity.parent === null) {
                entity.parent = contextId;
            }
            entities[e] = entity;
        }
    }
}
module.exports = BaseExternalDatasource;
