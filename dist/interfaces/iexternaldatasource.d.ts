/**
* Copyright (c) 2016-present, IBM Research
* Licensed under The MIT License [see LICENSE for details]
*/
import HKEntity from "../hkentity";
export interface IExternalDatasource {
    endpoint: string;
    executeQuery(query: string, parent: any, options: any): Promise<any>;
    transform(data?: any): Promise<Map<string, HKEntity>>;
    getProperties(property?: string[]): any;
    getEntity(key: string, options: any): Promise<any>;
}
