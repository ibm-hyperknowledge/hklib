/**
* Copyright (c) 2016-present, IBM Research
* Licensed under The MIT License [see LICENSE for details]
*/
export interface IExternalDatasource {
    endpoint: string;
    executeQuery(query: string, parent: any, options: any): Promise<any>;
    transform(data: any, context: any): any;
    getProperties(property?: string[]): any;
    getEntity(key: string, parentId: string, ...args: any): Promise<any>;
    getLinks(key: string, ...args: any): Promise<any>;
}
