/**
* Copyright (c) 2016-present, IBM Research
* Licensed under The MIT License [see LICENSE for details]
*/
export = BaseExternalDatasource;
declare class BaseExternalDatasource {
    constructor();
    transformToVirtualEntities(entities: any, contextId: string, endpoint?: string): void;
}
