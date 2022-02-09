

import HKEntity = require("../hkentity");

export interface IExternalDatasource {

  endpoint: String;
  executeQuery(query: string, options: any): Promise<any>;
  transform(data?: any): Promise<Map<string, HKEntity>>;
  getProperties(property?: string[]): any;
  
}