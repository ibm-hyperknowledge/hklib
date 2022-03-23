import HKEntity  from "../hkentity";

export interface IExternalDatasource {
  endpoint: string;
  executeQuery(query: string, parent: any, options: any): Promise<any>;
  transform(data: any, ...args: any): any;
  getProperties(property?: string[]): any;
  getEntity(key: string, parentId: string, ...args: any): Promise<any>;
  getLinks(key: string, ...args: any): Promise<any>;
}