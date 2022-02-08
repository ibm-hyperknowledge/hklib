


export interface IExternalDatasource {

  endpoint: String;
  executeQuery(query: String, options: Any): Promise<any>;
  _transform(): Promise<Map<string, HKEntity>>
  
}