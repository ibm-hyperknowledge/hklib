

import HKEntity  from "../hkentity";

export interface IExternalDatasource {
  endpoint: string;
  executeQuery(query: string, options: any): Promise<any>;
  transform(data?: any): Promise<Map<string, HKEntity>>;
  getProperties(property?: string[]): any;
  getEntity(key: string, options: any): Promise<any>;
}