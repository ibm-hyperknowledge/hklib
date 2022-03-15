import HKEntity  from "../hkentity";

export interface IExternalDatasource {
  endpoint: string;
  executeQuery(query: string, parent: any, options: any): Promise<any>;
  transform(data: any, context: any): any;
  getProperties(property?: string[]): any;
  getEntity(key: string, parentId: string, endpoint: string | undefined, options: any): Promise<any>;
}