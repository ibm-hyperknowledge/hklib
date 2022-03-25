/**
* Copyright (c) 2016-present, IBM Research
* Licensed under The MIT License [see LICENSE for details]
*/
export = HKDatasource;
declare class HKDatasource {
    /**
     * If the authSecret is passed, this method generates a signed jwt token for acessing the datasource
     * Otherwise, it retrieves an empty token
     * @param authSecret secret used to sign the jwt token (must be the same as the one used in the server)
     * @param expiresIn token expiration expressed in seconds or a string describing a time span zeit/m
     * Eg: 60, "2 days", "10h", "7d". A numeric value is interpreted as a seconds count.
     * If you use a string be sure you provide the time units (days, hours, etc),
     * otherwise milliseconds unit is used by default ("120" is equal to "120ms").
     * If !expiresIn, the generated token never expires.
     */
    static getAuthToken(authSecret: any, expiresIn?: number): any;
    /**
     * Creates a datasource connected to a hkbase
     *
     * @constructor
     * @param {string} url The base url of the hkbase. Example: `http://myserver:3000/`
     * @param {string} repository The repository to perform operations
     * @param {object} options Additional setup for the hkbase connection
     * @param {string} options.authToken JWT Token to authentication to the HKBase
     */
    constructor(url: string, repository: string, options?: {
        authToken: string;
    });
    url: string;
    options: {};
    graphName: string;
    /**
     * @callback OperationCallback
     * @param err An error object that indicate if the operation was succesful or not
     */
    /**
     * Get information about the current IDB
     *
     * @param {OperationCallback} callback Response callback
     */
    getInfo(callback?: (err: any) => any): void;
    /**
     * @callback OperationCallback
     * @param err An error object that indicate if the operation was succesful or not
     */
    /**
     * Get version of the current HKBase
     *
     * @param {OperationCallback} callback Response callback
     */
    getVersion(callback?: (err: any) => any): void;
    /**
     * Callback function for `addEntities`
     *
     * @callback ListRepositoriesCallback
     * @param {Error} err Error message/object (null in case of success)
     * @param {Array} repositories List of repositories
     */
    /**
     * List the repositories of the current hkbase
     *
     * @param {ListRepositoriesCallback} callback Callback function with the list of repositories
     */
    getRepositories(callback?: (err: Error, repositories: any[]) => any): void;
    /**
     * @callback OperationCallback
     * @param err An error object that indicate if the operation was succesful or not
     */
    /**
     * Create the current repository
     *
     * @param {OperationCallback} callback Response callback
     */
    createRepository(callback?: (err: any) => any): void;
    /**
     * @callback OperationCallback
     * @param err An error object that indicate if the operation was succesful or not
     */
    /**
     * Drop the current repository
     *
     * @param {OperationCallback} callback Response callback
     */
    dropRepository(callback?: (err: any) => any): void;
    /**
     * Callback function for `addEntities`
     *
     * @callback AddEntitiesCallback
     * @param {Error} err Error message/object (null in case of success)
     * @param {Array} entities repository metadata
     */
    /**
     * Save hyperknowledge entities to a hkbase
     *
     * @param {Array} entities array of entities to be added or updated
     * @param {AddEntitiesCallback} callback Response callback
     */
    saveEntities(entities: any[], callback: (err: Error, entities: any[]) => any): void;
    /**
     * Remove entities from a hkbase
     *
     * @param {Array | object} params Array of ids or filter to math entities to be removed @see filterEntities
     * @param {OperationCallback} callback Response callback
     */
    removeEntities(ids: any, callback: (err: any) => any): void;
    /**
     * @callback GetEntitiesCallback
     * @param {string} err An error object that indicate if the operation was succesful or not
     * @param {object} entities A dictionary of entities indexed by id
     */
    /**
     * Get entities from a hkbase
     *
     * @param {Array} ids Array of ids to retrieve their respective entities
     * @param {GetEntitiesCallback} callback Callback with the entities
     */
    getEntities(ids: any[], callback?: (err: string, entities: object) => any): void;
    /**
     * Fetch entities from a context
     *
     * @param {string} context The context id to retrieve their nested entities. May be null to get the `body` context.
     * @param {GetEntitiesCallback} callback Callback with the entities
     */
    fetchContext(context: string, callback?: (err: string, entities: object) => any): void;
    /**
     * Get entities from a context
     *
     * @param {string} contextId The context id to retrieve their nested entities. May be null to get the `body` context.
     * @param {object?} [options] Options to get context children
     * @param {boolean?} [options.lazy] If set true, will include only the main fields in the results
     * @param {boolean?} [options.nested] If set true, will walk through nested contexts
     * @param {boolean?} [options.includeContextOnResults] If set true, will include the context data in the results
     * @param {object} payload A dictionary containing options when returning the entities from the context.
     * @param {GetEntitiesCallback} callback Callback with the entities
     */
    getContextChildren(contextId: string, options?: object | null | undefined, payload?: object, callback?: (err: string, entities: object) => any): void;
    /**
     * Get an entity from its identifier
     *
     * @param {string} entityId The identifier of the entity to be fetched
     * @param {object?} [options] Options to get entity
     * @param {boolean?} [options.parent] The entity parent
     * @param {object} payload A dictionary containing options when returning the entities.
     * @param {GetEntitiesCallback} callback Callback with the entities
     */
    getEntityById(entityId: string, options?: object | null | undefined, payload?: object, callback?: (err: string, entities: object) => any): Promise<void>;
    /**
     * Filter entities using CSS pattern `(TODO: document it better)`
     *
     * Examples:
     *
     * `{"parent" :  "bar"}` - filter entities from a context bar
     *
     * `{"type" : "node"}` - filter entities of type node
     *
     * `{"properties" : {"name" : "bar"}` - filter entities with property name which it is bar
     *
     * `{"parent":"parent_context", {"properties" : {"name" : "bar"}` - Combined filter
     *
     * @param {object} filter The CSS filter
     * @param {GetEntitiesCallback} callback Callback with the entities
     */
    filterEntities(filter: object, callback?: (err: string, entities: object) => any): void;
    /**
     * Filter entities Ids using CSS pattern `(TODO: document it better)`
     *
     * Examples:
     *
     * `{"parent" :  "bar"}` - filter entities ids from a context bar
     *
     * `{"type" : "node"}` - filter entities ids of type node
     *
     * `{"properties" : {"name" : "bar"}` - filter entities ids with property name which it is bar
     *
     * `{"parent":"parent_context", {"properties" : {"name" : "bar"}` - Combined filter
     *
     * @param {object} filter The CSS filter
     * @param {GetEntitiesCallback} callback Callback with the entities ids
     */
    filterEntitiesLazy(filter: object, callback?: (err: string, entities: object) => any): void;
    /**
     * @callback QueryResultsCallback
     * @param err An error object that indicate if the operation was succesful or not
     * @param data The result set from the execution of the input query
     * @param stats If sendStats is set as true, this object will contain the statistics from the query
     */
    /**
     * Execute query in HyQL
     *
     * @param {string} query The query
     * @param {object?} [options] Options to be sent the query
     * @param {boolean?} [options.stats] If set true, will send the statistics from the query
     * @param {boolean?} [options.header] If set true, will send the header from the query
     * @param {QueryResultsCallback} callback Callback with the entities
     */
    query(query: string, options?: object | null | undefined, callback?: (err: any, data: any, stats: any) => any): void;
    /**
     * @callback SparqlQueryResultsCallback
     * @param err An error object that indicate if the operation was succesful or not
     * @param data The result set from the execution of the sparql query
     */
    /**
     * Execute query in HyQL
     *
     * @param {string} query The query
     * @param {object?} [options] Options to be sent the query
     * @param {SparqlQueryResultsCallback} callback Callback with the entities
     */
    sparqlQuery(query: string, options?: object | null | undefined, callback?: (err: any, data: any) => any): void;
    /**
     * Get links and connected related to a list entities. The ids can be the links or connector by themselves, or
     * entities that are connected to links.
     *
     * @param {[string]} ids An array of id of entities to get related links
     * @param {GetEntitiesCallback} callback Callback with the entities
     */
    getLinks(ids: [string], callback?: (err: string, entities: object) => any): void;
    /**
   * Get connectors.
   *
   * @param {[string]} contextIds An array of id of contexts to get related connectors
   * @param {GetEntitiesCallback} callback Callback with the entities
   */
    getConnectors(contextIds?: [string], callback?: (err: string, entities: object) => any): void;
    /**
     * Import a RDF file from the filesystem
     * @param {string} filePath The path to the file
     * @param {object} options a set of options to customize the importation
     * @param {string} options.contentType the mimeType of the serialization for the RDF data
     * @param {string} options.context the target context to import the entities
     * @param {OperationCallback} callback Response callback
     */
    importRDFFile(filePath: string, options: {
        contentType: string;
        context: string;
    }, callback?: (err: any) => any): void;
    /**
     * Import a RDF data
     * @param {string} data the contents of the RDF
     * @param {object} options a set of options to customize the importation
     * @param {string} options.contentType the mimeType of the serialization for the RDF data
     * @param {string} options.context the target context to import the entities
     * @param {OperationCallback} callback Response callback
     */
    importRDF(data: string, options: {
        contentType: string;
        context: string;
    }, callback?: (err: any) => any): void;
    /**
     * Import data from an external database, like Wordnet, DBpedia...
     * @param {object} data a set of needed information to be considered when importing
     * @param {object} options a set of options to customize the importation
     * @param {string} options.context the target context to import the entities
     * @param {string} options.base the identifier of the database where data will come from (e.g. "wordnet" indicate the WordNet dataset).
     * @param {OperationCallback} callback Response callback
     */
    importFrom(data: object, options: {
        context: string;
        base: string;
    }, callback?: (err: any) => any): void;
    /**
     * Will return a list of entities similar to the given entity
     *
     * @param {string} entityId
     * @param {string} datasource
     * @param {*} options
     */
    getSimilarEntitiesFromExternalDataSource(entityId: string, datasource: string, options?: any, callback?: () => void): void;
    /**
     * @callback ExternalDatasourceCallback
     * @param err An error object that indicate if the operation was succesful or not
     * @param {*} data
     */
    /**
     * Will return a list of entities that match the search criteria.
     *
     * @param {string} searchCriteria
     * @param {string} datasource
     * @param {*} options
     * @param {ExternalDatasourceCallback} callback Response callback
     */
    searchEntitiesFromExternalDataSource(searchCriteria: string, datasource: string, options?: any, callback?: (err: any, data: any) => any): void;
    /**
     *
     * @param {string} externalDSEntityId
     * @param {string} datasource
     * @param {*} options
     * @param {ExternalDatasourceCallback} callback
     */
    getPropertiesFromExternalDataSource(externalDSEntityId: string, datasource: string, options?: any, callback?: (err: any, data: any) => any): void;
    getEntityFromExternalDataSource(externalDSEntityId: any, datasource: any, options?: {}, callback?: () => void): void;
    /**
     *
     * @param {string} datasource
     * @param {ExternalDatasourceCallback} callback
     */
    getExternalDatasourceSettings(datasource: string, callback?: (err: any, data: any) => any): void;
    /**
     * @callback ExportRdfCallback
     * @param err An error object that indicate if the operation was succesful or not
     * @param data The exported RDF data
     */
    /**
     * Import a RDF data
     * @param {object | Array} filter the contents of the RDF
     * @param {object} options a set of options to customize the importation
     * @param {string} options.mimeType the mimeType of the serialization for the RDF data
     * @param {ExportRdfCallback} callback Response callback
     */
    exportRDF(filter: object | any[], options: {
        mimeType: string;
    }, callback?: (err: any, data: any) => any): void;
    /**
     *  @typedef {Object} StoredQuery
     *  @property {string} [id] the stored query's identifier
     *  @property {string} queryText the query
     *  @property {Array}  colums the set of variables in the projection
     *  @property {string} queryLanguage queryText's query language
     *  @property {Array}  [parameters] an array of parameters of the query
     */
    /**
     * @callback StoredQueryGetAllCallback
     * @param err An error object that indicates if the operation was successful or not
     * @param {StoredQuery[]} [data] The array of stored queries
     */
    /**
     * Returns all stored queries
     * @param {object} options a set of options to constumise the request
     * @param {string} [options.transactionId] an optional transaction id
     * @param {StoredQueryGetAllCallback} [callback] Response callback
     */
    getAllStoredQueries(options: {
        transactionId?: string | undefined;
    }, callback?: ((err: any, data?: {
        /**
         * the stored query's identifier
         */
        id?: string | undefined;
        /**
         * the query
         */
        queryText: string;
        /**
         * the set of variables in the projection
         */
        colums: any[];
        /**
         * queryText's query language
         */
        queryLanguage: string;
        /**
         * an array of parameters of the query
         */
        parameters?: any[] | undefined;
    }[] | undefined) => any) | undefined): void;
    /**
     * @callback StoredQueryGetCallback
     * @param err An error object that indicates if the operation was successful or not
     * @param {StoredQuery} [data] The array of stored queries
     */
    /**
     * Returns a stored query
     * @param {string} queryId the stored query's id
     * @param {object} options a set of options to constumise the request
     * @param {string} [options.transactionId] an optional transaction id
     * @param {StoredQueryGetCallback} [callback] Response callback
     */
    getStoredQuery(queryId: string, options: {
        transactionId?: string | undefined;
    }, callback?: ((err: any, data?: {
        /**
         * the stored query's identifier
         */
        id?: string | undefined;
        /**
         * the query
         */
        queryText: string;
        /**
         * the set of variables in the projection
         */
        colums: any[];
        /**
         * queryText's query language
         */
        queryLanguage: string;
        /**
         * an array of parameters of the query
         */
        parameters?: any[] | undefined;
    } | undefined) => any) | undefined): void;
    /**
     * Deletes a stored query
     * @param {string} queryId a stored query identifier
     * @param {object} options a set of options to constumise the request
     * @param {string} [options.transactionId] an optional transaction id
     * @param {StoredQueryGetCallback} [callback] Response callback's returns the deleted query
     */
    deleteStoredQuery(queryId: string, options: {
        transactionId?: string | undefined;
    }, callback?: ((err: any, data?: {
        /**
         * the stored query's identifier
         */
        id?: string | undefined;
        /**
         * the query
         */
        queryText: string;
        /**
         * the set of variables in the projection
         */
        colums: any[];
        /**
         * queryText's query language
         */
        queryLanguage: string;
        /**
         * an array of parameters of the query
         */
        parameters?: any[] | undefined;
    } | undefined) => any) | undefined): void;
    /**
     * Saves a stored query
     * @param {StoredQuery} storedQuery the stored query
     * @param {object} options a set of options to constumise the request
     * @param {string} [options.transactionId] an optional transaction id
     * @param {StoredQueryGetCallback} [callback] Response callback's returns the deleted query
     */
    storeQuery(storedQuery: {
        /**
         * the stored query's identifier
         */
        id?: string | undefined;
        /**
         * the query
         */
        queryText: string;
        /**
         * the set of variables in the projection
         */
        colums: any[];
        /**
         * queryText's query language
         */
        queryLanguage: string;
        /**
         * an array of parameters of the query
         */
        parameters?: any[] | undefined;
    }, options: {
        transactionId?: string | undefined;
    }, callback?: ((err: any, data?: {
        /**
         * the stored query's identifier
         */
        id?: string | undefined;
        /**
         * the query
         */
        queryText: string;
        /**
         * the set of variables in the projection
         */
        colums: any[];
        /**
         * queryText's query language
         */
        queryLanguage: string;
        /**
         * an array of parameters of the query
         */
        parameters?: any[] | undefined;
    } | undefined) => any) | undefined): void;
    /**
     * @typedef {object} StoredQueryRunConfiguration
     * @property {object} [parameters] a key value bind of stored query parameters to values
     * @property {object} [options] run options
     */
    /**
     * @typedef {object} StoredQueryRunOptions
     * @property {string} [content-type] a key value bind of stored query parameters to values
     * @property {string} [mimeType] run options
     * @property {string} [transactionId] run options
     */
    /**
     * Run a stored query using a configuration
     * @param {string} queryId
     * @param {StoredQueryRunConfiguration} runConfiguration
     * @param {StoredQueryRunOptions} options
     * @param {QueryResultsCallback} [callback] response callback
     */
    runStoredQuery(queryId: string, runConfiguration: {
        /**
         * a key value bind of stored query parameters to values
         */
        parameters?: object | undefined;
        /**
         * run options
         */
        options?: object | undefined;
    }, options: {
        /**
         * a key value bind of stored query parameters to values
         */
        "content-type"?: string | undefined;
        /**
         * run options
         */
        mimeType?: string | undefined;
        /**
         * run options
         */
        transactionId?: string | undefined;
    }, callback?: ((err: any, data: any, stats: any) => any) | undefined): void;
    /**
     * Alias to `saveEntities`. Add entities may also update entities
     *
     * @param {Array} entities array of entities to be added or updated
     * @param {AddEntitiesCallback} callback Response callback
     */
    addEntities(entities: any[], callback: (err: Error, entities: any[]) => any): void;
    /**
     * Import a RDF data
     * @param {string} data the contents of the RDF
     * @param {object} options a set of options to customize the importation
     * @param {string} options.contentType the mimeType of the serialization for the RDF data
     * @param {string} options.context the target context to import the entities
     * @param {OperationCallback} callback Response callback
     */
    import(data: string, options: {
        contentType: string;
        context: string;
    }, callback: (err: any) => any): void;
    getAuthToken(authSecret: any, expiresIn?: number): any;
}
