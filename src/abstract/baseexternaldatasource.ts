import HKTypes from "../types";
import VirtualContext from "../virtualcontext";
import VirtualNode from "../virtualnode";
import VirtualLink from "../virtuallink";

export = BaseExternalDatasource;
class BaseExternalDatasource {
  constructor() { }

  transformToVirtualEntities(entities: any, contextId: string, endpoint?: string): void {
    for (let e in entities) {
      let entity = entities[e];

      switch (entity.type) {
        case HKTypes.CONTEXT:
          {
            endpoint = endpoint ? endpoint : "";
            entity = new VirtualContext(entity, endpoint, contextId);
            break;
          }
        case HKTypes.NODE:
          {
            entity = new VirtualNode(entity, contextId);
            break;
          }
        case HKTypes.LINK:
          {
            entity = new VirtualLink(entity, contextId);
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