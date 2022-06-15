/*
 * Copyright (c) 2016-present, IBM Research
 * Licensed under The MIT License [see LICENSE for details]
 */

"use strict";

const request = require("request");
const axios = require("axios").default;

const fs = require("fs");
const jwt = require("jsonwebtoken");

const HKEntity = require("../hkentity");
const deserialize = require("../deserialize");

const PARSE_FAILED_MESSAGE = "Failed to parse server response";
const UNEXPECTED_NULL_DATA = "Unexpected empty data on parsing";

const http = require("http");
const https = require("https");

const  FormData = require('form-data');

class HKDatasource
{
  /**
   * Creates a datasource connected to a hkbase
   *
   * @constructor
   * @param {string} url The base url of the hkbase. Example: `http://myserver:3000/`
   * @param {string} repository The repository to perform operations
   * @param {object} options Additional setup for the hkbase connection
   * @param {string} options.authToken JWT Token to authentication to the HKBase
   */
  constructor(url, repository, options = {})
  {
    if (!url)
    {
      let err = "Url can not be null";
      throw err;
    }
    this.url = url.endsWith("/") ? url : (url + "/");

    this.options = {};
    if (options.authToken)
    {
      this.options.auth = { bearer: options.authToken };
    }
    else if (options.authSecret)
    {
      this.options.auth = { bearer: HKDatasource.getAuthToken(options.authSecret, null) };
    }

    const _httpAgent = new http.Agent({keepAlive: true});
    const _httpsAgent = new https.Agent({keepAlive: true});

    this.graphName = repository;
    const instance = axios.create({
      httpAgent: _httpAgent,  // httpAgent: httpAgent -> for non es6 syntax
      httpsAgent: _httpsAgent,
      timeout: 20 * 60 * 1000, // 20 min
      timeoutErrorMessage: "Timeout while accessing Jena Fuseki"
    });
  }

  /**
   * @callback OperationCallback
   * @param {Error|null} err An error object that indicate if the operation was succesful or not
   * @param {Object} data 
   */
  /**
   * Get information about the current IDB
   *
   * @param {OperationCallback} callback Response callback
   */
  getInfo(callback = () => { })
  {
    request.get(`${this.url}info`, this.options, (err, res) =>
    {
      if (!err)
      {
        if (requestCompletedWithSuccess(res.statusCode))
        {
          try
          {
            let data = JSON.parse(res.body);
            callback(null, data);
          }
          catch (exp)
          {
            callback(exp);
          }
        }

        else
        {
          callback(stringifyResponseLog(res));
        }
      }

      else
      {
        callback(err);
      }
    });
  }

  /**
   * Get version of the current HKBase
   *
   * @param {OperationCallback} callback Response callback
   */
  getVersion(callback = () => { })
  {
    request.get(`${this.url}version`, this.options, (err, res) =>
    {
      if (!err)
      {
        if (requestCompletedWithSuccess(res.statusCode))
        {
          try
          {
            let data = JSON.parse(res.body);
            callback(null, data);
          }
          catch (exp)
          {
            callback(exp);
          }
        }

        else
        {
          callback(stringifyResponseLog(res));
        }
      }

      else
      {
        callback(err);
      }
    });
  }

  
  /**
   * Get a list of the current external parses that HKBase has implemented.
   *
   * @param {OperationCallback} callback Response callback
   */
  getExternalParsersInfo(callback = () => { })
  {
    request.get(`${this.url}external-parsers`, this.options, (err, res) =>
    {
      if (!err)
      {
        if (requestCompletedWithSuccess(res.statusCode))
        {
          try
          {
            let data = JSON.parse(res.body);
            callback(null, data);
          }
          catch (exp)
          {
            callback(exp);
          }
        }

        else
        {
          callback(stringifyResponseLog(res));
        }
      }

      else
      {
        callback(err);
      }
    });
  }

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
  getRepositories(callback = () => { })
  {
    let url = this.url + "repository/";

    request.get(url, this.options, (err, res) =>
    {
      if (!err)
      {
        if (requestCompletedWithSuccess(res.statusCode))
        {
          try
          {
            let data = JSON.parse(res.body);
            callback(null, data);
          }
          catch (exp)
          {
            callback(exp);
          }
        }

        else
        {
          callback(stringifyResponseLog(res));
        }
      }

      else
      {
        callback(err);
      }
    });
  }

  /**
   * Callback function for `createRepository`
   *
   * @callback AdminRepositoryCallback
   * @param {Error} err Error message/object (null in case of success)
   * @param {string} responseLog call's response log
   */
  /**
   * Create the current repository
   *
   * @param {AdminRepositoryCallback} callback Response callback
   */
  createRepository(callback = () => { })
  {
    let url = this.url + "repository/" + this.graphName;

    request.put(url, this.options, (err, res) =>
    {
      if (!err)
      {
        if (requestCompletedWithSuccess(res.statusCode))
        {
          callback(null);
        }

        else
        {
          callback(stringifyResponseLog(res));
        }
      }

      else
      {
        callback(err);
      }
    });
  }

  
  /**
   * Drop the current repository
   *
   * @param {AdminRepositoryCallback} callback Response callback
   */
  dropRepository(callback = () => { })
  {
    let url = this.url + "repository/" + this.graphName;

    request.delete(url, this.options, (err, res) =>
    {
      if (!err)
      {
        if (requestCompletedWithSuccess(res.statusCode))
        {
          callback(null);
        }

        else
        {
          callback(stringifyResponseLog(res));
        }
      }

      else
      {
        callback(err);
      }
    });

  }

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
  saveEntities(entities, callback)
  {
    let url = this.url + "repository/" + this.graphName + "/entity/";

    if (!Array.isArray(entities))
    {
      throw `Input entities must be an array. Received "${typeof entities}"`;
    }

    let inputEntities = [];

    for (let i = 0; i < entities.length; i++)
    {
      let e = entities[i];

      if (e && e.constructor === HKEntity)
      {
        inputEntities.push(e.serialize());
      }
      else if (e && typeof (e) === "object")
      {
        inputEntities.push(e);
      }
    }

    let params = {
      headers: { "content-type": "application/json" },
      body: JSON.stringify(inputEntities)
    };

    Object.assign(params, this.options);

    request.put(url, params, (err, res) =>
    {
      if (!err)
      {
        if (requestCompletedWithSuccess(res.statusCode))
        {
          let data = null;
          try
          {
            data = JSON.parse(res.body);
          }
          catch (err)
          {
            console.log("Warning: Failed to parse response");
          }
          callback(null, data);
        }

        else
        {
          callback(stringifyResponseLog(res));
        }
      }

      else
      {
        callback(err);
      }
    });
  }

  /**
   * Remove entities from a hkbase
   *
   * @param {Array | object} params Array of ids or filter to math entities to be removed @see filterEntities
   * @param {AddEntitiesCallback} callback Response callback
   */
  removeEntities(ids, callback)
  {
    let url = this.url + "repository/" + this.graphName + "/entity/";

    let params = {
      headers: { "content-type": "application/json" },
      body: JSON.stringify(ids)
    };

    Object.assign(params, this.options);

    request.delete(url, params, (err, res) =>
    {
      if (!err)
      {
        if (requestCompletedWithSuccess(res.statusCode))
        {
          let data = null;
          try
          {
            data = JSON.parse(res.body);
          }
          catch (err)
          {
            console.log("Warning: Failed to parse response");
          }
          callback(null, data);
        }

        else
        {
          callback(stringifyResponseLog(res));
        }
      }

      else
      {
        callback(err);
      }
    });

  }

  /**
   * @callback GetEntitiesCallback
   * @param {string} err An error object that indicate if the operation was succesful or not
   * @param {Object.<string, HKEntity>} entities A dictionary of entities indexed by id
   */
  /**
   * Get entities from a hkbase
   *
   * @param {Array} ids Array of ids to retrieve their respective entities
   * @param {GetEntitiesCallback} callback Callback with the entities
   */
  getEntities(ids, callback = () => { }) 
  {
    let url = this.url + "repository/" + this.graphName + "/entity/";

    let params = {
        headers: { "content-type": "application/json" },
        body: JSON.stringify(ids)
    };

    Object.assign(params, this.options);

    request.post(url, params, (err, res) =>
    {
      if (!err)
      {
        if (requestCompletedWithSuccess(res.statusCode))
        {
          try
          {
            let entities = convertEntities(res.body);
            callback(null, entities);
          }
          catch (exp)
          {
            callback(exp);
          }
        }

        else
        {
          callback(stringifyResponseLog(res));
        }
      }

      else
      {
        callback(err);
      }
    });
  }

  /**
   * Fetch entities from a context
   *
   * @param {string} context The context id to retrieve their nested entities. May be null to get the `body` context.
   * @param {GetEntitiesCallback} callback Callback with the entities
   */
  fetchContext(context, callback = () => { })
  {
    let url = this.url + "repository/" + this.graphName + "/context/";

    if (context)
    {
      url += encodeURIComponent(context);
    }

    request.get(url, this.options, (err, res) =>
    {
      // console.log(res.body);
      if (!err)
      {
        if (requestCompletedWithSuccess(res.statusCode))
        {
          try
          {
            let entities = convertEntities(res.body);
            callback(null, entities);
          }
          catch (exp)
          {
            console.log(exp);
            callback(exp);
          }
        }

        else
        {
          callback(stringifyResponseLog(res));
        }

      }

      else
      {
        callback(err);
      }
    });
  }
  
  /**
   * Get entities from a context
   *
   * @param {string | null} contextId The context id to retrieve their nested entities. May be null to get the `body` context.
   * @param {object} options Options to get context children
   * @param {boolean?} [options.lazy] If set true, will include only the main fields in the results
   * @param {boolean?} [options.nested] If set true, will walk through nested contexts
   * @param {boolean?} [options.includeContextOnResults] If set true, will include the context data in the results
   * @param {object} payload A dictionary containing options when returning the entities from the context.
   * @param {GetEntitiesCallback} callback Callback with the entities
   */
  getContextChildren(contextId, options, payload, callback)
  {
    let url = `${this.url}repository/${this.graphName}/context/${encodeURIComponent(contextId)}`;

    if (options)
    {
      url += toQueryString(options);
    }

    const config = {
      method: 'POST',
      url: url,
      headers: {
        'Content-Type': 'application/json',
      },
      body: payload,
      json: true
    };

    Object.assign(config, this.options);

    request(config, (err, res) =>
    {
      if (!err)
      {
        if (requestCompletedWithSuccess(res.statusCode))
        {
          try
          {
            callback(null, res.body);
          }
          catch (exp)
          {
            callback(exp);
          }
        }

        else
        {
          callback(`Server responded with ${res.statusCode}. ${res.body}`);
        }
      }

      else
      {
        callback(err);
      }
    });
  }

  /**
 * @callback GetTrailCallback
 * @param {string} err An error object that indicate if the operation was succesful or not
 * @param {object} trail 
 */
/**
 * Fetch trail
 *
 * @param {string} trailId The trail id to retrieve their nested entities.
 * @param {GetTrailCallback} callback Callback with the entities
 */

fetchTrail(trailId, callback = () => {})
 {
	 let url = this.url + "repository/" + this.graphName + "/trail/" + encodeURIComponent(trailId);
 
	 request.get(url, this.options, (err, res) =>
	 {
		 // console.log(res.body);
		 if (!err)
		 {
			 if (requestCompletedWithSuccess(res.statusCode))
			 {
				 try
				 {
					 let entities = convertEntities(res.body);
					 callback(null, entities[trailId]);
				 }
				 catch (exp)
				 {
					 callback(exp);
				 }
			 }

			 else
			 {
				 callback(`Server responded with ${res.statusCode}. ${res.body}`);
			 }
		 }
     
		 else
		 {
			 callback(err);
		 }
	 });
 }

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
   * @param {object | string} filter The CSS filter
   * @param {GetEntitiesCallback} callback Callback with the entities
   */
  filterEntities(filter, callback = () => { })
  {
    let url = this.url + "repository/" + this.graphName + "/entity/filter/";

    let params = {};
    // {
    //     // headers: {"content-type": "text/plain"},
    //     body: filter
    // }
    if (typeof filter === "object")
    {
      params.headers = { "content-type": "application/json" };
      params.body = JSON.stringify(filter);
    }
    else if (typeof filter === "string")
    {
      params.headers = { "content-type": "text/plain" };
      params.body = filter;
    }

    Object.assign(params, this.options);

    request.post(url, params, (err, res) =>
    {
      if (!err)
      {
        if (requestCompletedWithSuccess(res.statusCode))
        {
          try
          {
            let entities = convertEntities(res.body);
            callback(null, entities);
          }
          catch (exp)
          {
            callback(exp);
          }
        }

        else
        {
          callback(stringifyResponseLog(res));
        }

      }

      else
      {
        callback(err);
      }
    });


  }

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
  filterEntitiesLazy(filter, callback = () => { })
  {
    let url = this.url + "repository/" + this.graphName + "/entity/lazy";

    let params = {};

    if (typeof filter === "object")
    {
      params.headers = { "content-type": "application/json" };
      params.body = JSON.stringify(filter);
    }
    else if (typeof filter === "string")
    {
      params.headers = { "content-type": "text/plain" };
      params.body = filter;
    }

    Object.assign(params, this.options);

    request.post(url, params, (err, res) =>
    {
      if (!err)
      {
        if (requestCompletedWithSuccess(res.statusCode))
        {
          try
          {
            callback(null, JSON.parse(res.body));
          }
          catch (exp)
          {
            callback(exp);
          }
        }

        else
        {
          callback(stringifyResponseLog(res));
        }

      }

      else
      {
        callback(err);
      }
    });


  }

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
  query(query, options, callback = () => { })
  {
    let url = this.url + "repository/" + this.graphName + "/query/";

    if (typeof (options) === "function")
    {
      callback = options;
    }

    let params = {
      headers: { "content-type": "text/plain" },
      body: query
    };

    Object.assign(params, this.options);

    if (options)
    {
      url += toQueryString(options);
    }

    request.post(url, params, (err, res) =>
    {
      if (!err)
      {
        if (requestCompletedWithSuccess(res.statusCode))
        {
          try
          {
            let items = [];
            let data = JSON.parse(res.body);

            let results = data;

            if (!Array.isArray(data))
            {
              if (data.results)
              {
                results = data.results;
              }
              delete data.results;
            }
            for (let k in results)
            {
              let item = results[k];
              if (Array.isArray(item))
              {
                items.push(item);
                continue;
              }

              if (typeof item === "object")
              {
                let entity = deserialize(item);

                if (entity)
                {
                  items.push(entity);
                }

                else
                {
                  items.push(item);
                }
              }

              else
              {
                items.push(item);
              }
            }

            callback(null, items, data);

          }
          catch (exp)
          {
            console.log(exp);
            callback(exp);
          }
        }

        else
        {
          callback(stringifyResponseLog(res));
        }

      }

      else
      {
        callback(err);
      }
    });

  }

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
  sparqlQuery(query, options, callback = () => { })
  {
    let url = this.url + "repository/" + this.graphName + "/sparql/";

    if (typeof (options) === "function")
    {
      callback = options;
    }

    let params = {
      headers: { "content-type": "application/sparql-query" },
      body: query
    };

    if (options)
    {
      url += toQueryString(options);
    }

    request.post(url, params, (err, res) =>
    {
      if (!err)
      {
        if (requestCompletedWithSuccess(res.statusCode))
        {
          try
          {
            let items = [];
            let data = JSON.parse(res.body);

            callback(null, data);
          }
          catch (exp)
          {
            console.log(exp);
            callback(exp);
          }
        }

        else
        {
          callback(stringifyResponseLog(res));
        }

      }

      else
      {
        callback(err);
      }
    });

  }

  /**
   * Get links and connected related to a list entities. The ids can be the links or connector by themselves, or
   * entities that are connected to links.
   *
   * @param {[string]} ids An array of id of entities to get related links
   * @param {GetEntitiesCallback} callback Callback with the entities
   */
  getLinks(ids, callback = () => { })
  {
    let url = this.url + "repository/" + this.graphName + "/links/";

    let params = {
      headers: { "content-type": "application/json" },
      body: JSON.stringify(ids)
    };

    Object.assign(params, this.options);

    request.post(url, params, (err, res) =>
    {
      // console.log(res.body);
      if (!err)
      {
        if (requestCompletedWithSuccess(res.statusCode))
        {
          try
          {
            let entities = convertEntities(res.body);
            callback(null, entities);
          }
          catch (exp)
          {
            callback(exp);
          }
        }

        else
        {
          callback(stringifyResponseLog(res));
        }

      }

      else
      {
        callback(err);
      }
    });
  }

  /**
   * Get connectors.
   *
   * @param {[string]} contextIds An array of id of contexts to get related connectors
   * @param {GetEntitiesCallback} callback Callback with the entities
   */
  getConnectors(contextIds = null, callback = () => { })
  {
    let url = `${this.url}repository/${this.graphName}/connectors/`;

    let params = {
      headers: { "content-type": "application/json" },
      body: JSON.stringify(contextIds)
    };

    Object.assign(params, this.options);

    request.post(url, params, (err, res) =>
    {
      if (!err)
      {
        if (requestCompletedWithSuccess(res.statusCode))
        {
          try
          {
            let entities = convertEntities(res.body);
            callback(null, entities);
          }
          catch (exp)
          {
            callback(exp);
          }
        }
        else
        {
          callback(stringifyResponseLog(res));
        }
      }
      else
      {
        callback(err);
      }
    });
  }

  /**
   * Import a RDF file from the filesystem
   * @param {string} filePath The path to the file
   * @param {object} options a set of options to customize the importation
   * @param {string} [options.contentType] the mimeType of the serialization for the RDF data
   * @param {string} [options.context] the target context to import the entities
   * @param {OperationCallback} callback Response callback
   */
  importRDFFile(filePath, options, callback = () => { })
  {
    if (!options || typeof (options) === 'function')
    {
      callback = options;
      options = {};
    }

    Object.assign(options, this.options);

    fs.readFile(filePath, options.encoding || 'utf8', (err, data) =>
    {
      if (err)
      {
        callback(err);
      }

      else
      {
        this.import(data, options, (err, out) =>
        {
          if (err)
          {
            callback(err);
          }

          else
          {
            callback(null, out);
          }
        });
      }
    });
  }

  /**
   * Import a RDF file from the filesystem
   * @param {[File]} files files to be imported
   * @param {object} options a set of options to customize the importation
   * @param {string} [options.mimeType] the mimeType for the RDF data
   * @param {string} [options.context] the target context to import the entities
   * @param {OperationCallback} callback Response callback
   */
  async importRDFFileStream(files, options, callback = () => { })
  {
    const context = options.context || null;

    let url = `${this.url}repository/${this.graphName}/rdf/bulk`;

    const formData = new FormData();
    for (let i = 0; i < files.length; i++)
    {
      formData.append("file", files[i]);
      formData.append(files[i].name, options["mimeType"]);
    }

    try
    {
      const config = {
        headers: {
          "context-parent": context,
          "Content-Type": "multipart/form-data"
        },
        params: options,
        ...getDefaultAxiosConfig()
      }

      const response = await axios.post(url, formData, config);

      if (requestCompletedWithSuccess(response.status))
      {
        let out;
        try
        {
          out = JSON.parse(response.body);
        }
        catch (err)
        {
          out = null;
        }
        callback(null, out);
      }

      else
      {
        callback(stringifyResponseLog(response));
      }
    }
    catch (err)
    {
      callback(err);
    }
  }

  /**
   * Import a RDF data
   * @param {string} data the contents of the RDF
   * @param {object} options a set of options to customize the importation
   * @param {string} options.contentType the mimeType of the serialization for the RDF data
   * @param {string} options.context the target context to import the entities
   * @param {OperationCallback} callback Response callback
   */
  importRDF(data, options, callback = () => { })
  {
    let url = `${this.url}repository/${this.graphName}/rdf/`;

    if (!options || typeof (options) === 'function')
    {
      callback = options;
      options = {};
    }

    let params = {
      headers: {
        "Content-Type": options.contentType || 'application/rdf+xml',
        "Content-Length": Buffer.byteLength(data)
      },
      body: data,
      qs: options
    };


    if (options.context)
    {
      params.headers["context-parent"] = `${options.context}`;
    }

    Object.assign(params, this.options);

    request.put(url, params, (err, res) =>
    {
      if (!err)
      {
        if (requestCompletedWithSuccess(res.statusCode))
        {
          let out;
          try
          {
            out = JSON.parse(res.body);
          }
          catch (err)
          {
            out = null;
          }
          callback(null, out);
        }

        else
        {
          callback(stringifyResponseLog(res));
        }
      }

      else
      {
        callback(err);
      }
    });
  }

  /**
   * Import data from an external database, like Wordnet, DBpedia...
   * @param {object} data a set of needed information to be considered when importing
   * @param {object} options a set of options to customize the importation
   * @param {string} options.context the target context to import the entities
   * @param {string} options.base the identifier of the database where data will come from (e.g. "wordnet" indicate the WordNet dataset).
   * @param {OperationCallback} callback Response callback
   */
  importFrom(data, options, callback = () => { })
  {
    let url = `${this.url}repository/${this.graphName}/from/`;

    let params = {
      headers: { "content-type": "application/json" },
      body: JSON.stringify(data),
      qs: options
    };

    if (options.context)
    {
      params.headers["context-parent"] = `${options.context}`;
    }

    Object.assign(params, this.options);

    request.put(url, params, (err, res) =>
    {
      if (!err)
      {
        if (requestCompletedWithSuccess(res.statusCode))
        {
          let out;
          try
          {
            out = JSON.parse(res.body);
          }
          catch (err)
          {
            out = null;
          }
          callback(null, out);
        }

        else
        {
          callback(stringifyResponseLog(res));
        }
      }

      else
      {
        callback(err);
      }
    });
  }

  /**
   * Will return a list of entities similar to the given entity
   *
   * @param {string} entityId
   * @param {string} datasource
   * @param {*} options
   */
  getSimilarEntitiesFromExternalDataSource(entityId, datasource, options = {}, callback = () => { })
  {
    let url = `${this.url}repository/${this.graphName}/external-data/entity/similar`;

    if (!options || typeof (options) === 'function')
    {
      callback = options;
      options = {};
    }
    options.datasource = datasource;

    let data = {
      entityId: entityId
    };

    let params = {
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(data),
      qs: options
    };


    Object.assign(params, this.options);

    request.post(url, params, (err, res) =>
    {
      if (!err)
      {
        if (requestCompletedWithSuccess(res.statusCode))
        {
          let out;
          try
          {
            out = JSON.parse(res.body);
          }
          catch (err)
          {
            out = null;
          }
          callback(null, out);
        }

        else
        {
          callback(stringifyResponseLog(res));
        }
      }

      else
      {
        callback(err);
      }
    });
  }

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
  searchEntitiesFromExternalDataSource(searchCriteria, datasource, options = {}, callback = () => { })
  {
    let url = `${this.url}repository/${this.graphName}/external-data/entity/search`;

    if (!options || typeof (options) === 'function')
    {
      callback = options;
      options = {};
    }
    options.datasource = datasource;

    let data = {
      searchCriteria: searchCriteria
    };

    let params = {
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(data),
      qs: options
    };


    Object.assign(params, this.options);

    request.post(url, params, (err, res) =>
    {
      if (!err)
      {
        if (requestCompletedWithSuccess(res.statusCode))
        {
          let out;
          try
          {
            out = JSON.parse(res.body);
          }
          catch (err)
          {
            out = null;
          }
          callback(null, out);
        }

        else
        {
          callback(stringifyResponseLog(res));
        }
      }

      else
      {
        callback(err);
      }
    });

  }

  /**
   *
   * @param {string} externalDSEntityId
   * @param {string} datasource
   * @param {*} options
   * @param {ExternalDatasourceCallback} callback
   */
  getPropertiesFromExternalDataSource(externalDSEntityId, datasource, options = {}, callback = () => { })
  {
    // let url = `${this.url}repository/${this.graphName}/external-data/entity/${externalDSEntityId}/properties`;
    let url = `${this.url}repository/${this.graphName}/external-data/entity/properties`;

    if (!options || typeof (options) === 'function')
    {
      callback = options;
      options = {};
    }

    options.datasource = datasource;

    let params = {
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        externalDatasourceEntityId: externalDSEntityId
      }),
      qs: options
    };


    Object.assign(params, this.options);

    request.post(url, params, (err, res) =>
    {
      if (!err)
      {
        if (requestCompletedWithSuccess(res.statusCode))
        {
          let out;
          try
          {
            out = JSON.parse(res.body);
          }
          catch (err)
          {
            out = null;
          }
          callback(null, out);
        }

        else
        {
          callback(stringifyResponseLog(res));
        }
      }

      else
      {
        callback(err);
      }
    });
  }

  getEntityFromExternalDataSource(externalDSEntityId, datasource, options = {}, callback = () => { })
  {
    let url = `${this.url}repository/${this.graphName}/external-data/entity`;

    if (!options || typeof (options) === 'function')
    {
      callback = options;
      options = {};
    }

    options.datasource = datasource;

    let params = {
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        externalDatasourceEntityId: externalDSEntityId
      }),
      qs: options
    };


    Object.assign(params, this.options);

    request.post(url, params, (err, res) =>
    {
      if (!err)
      {
        if (requestCompletedWithSuccess(res.statusCode))
        {
          let out;
          try
          {
            out = JSON.parse(res.body);
          }
          catch (err)
          {
            out = null;
          }
          callback(null, out);
        }

        else
        {
          callback(stringifyResponseLog(res));
        }
      }

      else
      {
        callback(err);
      }
    });
  }

  /**
   *
   * @param {string} datasource
   * @param {ExternalDatasourceCallback} callback
   */
  getExternalDatasourceSettings(datasource, callback = () => { })
  {

    let url = `${this.url}repository/${this.graphName}/external-data/settings`;

    let options = { datasource };

    let params = {
      headers: {
        "content-type": "application/json",
      },
      qs: options
    };


    Object.assign(params, this.options);

    request.get(url, params, (err, res) =>
    {
      if (!err)
      {
        if (requestCompletedWithSuccess(res.statusCode))
        {
          let out;
          try
          {
            out = JSON.parse(res.body);
          }
          catch (err)
          {
            out = null;
          }
          callback(null, out);
        }

        else
        {
          callback(stringifyResponseLog(res));
        }
      }

      else
      {
        callback(err);
      }
    });
  }

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
  exportRDF(filter, options, callback = () => { })
  {
    let url = `${this.url}repository/${this.graphName}/rdf/`;

    filter = filter || [null, null, null, null];

    if (!options || typeof (options) === 'function')
    {
      callback = options;
      options = {};
    }

    let params = {
      headers: {
        Accept: options.mimeType || "application/n-quads",
        "content-type": "application/json"
      },
      body: JSON.stringify(filter)
    };

    if (options.context)
    {
      params.headers["context-parent"] = `${options.context}`;
    }

    Object.assign(params, this.options);

    request.post(url, params, (err, res) =>
    {
      if (!err)
      {
        if (requestCompletedWithSuccess(res.statusCode))
        {
          callback(null, res.body);
        }

        else
        {
          callback(stringifyResponseLog(res));
        }
      }

      else
      {
        callback(err);
      }
    });
  }

  // STORED QUERIES
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
  getAllStoredQueries(options, callback = () => { })
  {
    let url = `${this.url}repository/${this.graphName}/stored-query`;

    if (!options || typeof (options) === 'function')
    {
      callback = options;
      options = {};
    }

    let params = {
      headers: {
        "content-type": "application/json"
      }
    };

    if (options.transactionId)
    {
      params.headers['transactionId'] = transactionId;
    }

    request.get(url, params, (err, res) =>
    {
      if (err)
      {
        callback(err);
        return;
      }
      if (requestCompletedWithSuccess(res.statusCode))
      {
        callback(null, res.body);
      } else
      {
        callback(stringifyResponseLog(res));
      }
    });
  }

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
  getStoredQuery(queryId, options, callback = () => { })
  {
    let url = `${this.url}repository/${this.graphName}/stored-query/${queryId}`;

    if (!options || typeof (options) === 'function')
    {
      callback = options;
      options = {};
    }

    let params = {
      headers: {
        "content-type": "application/json"
      }
    };

    if (options.transactionId)
    {
      params.headers['transactionId'] = transactionId;
    }

    request.get(url, params, (err, res) =>
    {
      if (err)
      {
        callback(err);
        return;
      }
      if (requestCompletedWithSuccess(res.statusCode))
      {
        callback(null, res.body);
      } else
      {
        callback(stringifyResponseLog(res));
      }
    });
  }

  /**
   * Deletes a stored query
   * @param {string} queryId a stored query identifier
   * @param {object} options a set of options to constumise the request
   * @param {string} [options.transactionId] an optional transaction id
   * @param {StoredQueryGetCallback} [callback] Response callback's returns the deleted query
   */
  deleteStoredQuery(queryId, options, callback = () => { })
  {
    let url = `${this.url}repository/${this.graphName}/stored-query/${queryId}`;

    if (!options || typeof (options) === 'function')
    {
      callback = options;
      options = {};
    }

    let params = {
      headers: {
        "content-type": "application/json"
      }
    };

    if (options.transactionId)
    {
      params.headers['transactionId'] = transactionId;
    }

    request.delete(url, params, (err, res) =>
    {
      if (err)
      {
        callback(err);
        return;
      }

      if (requestCompletedWithSuccess(res.statusCode))
      {
        callback(null, res.body);
      } else
      {
        callback(stringifyResponseLog(res));
      }
    });
  }

  /**
   * Saves a stored query
   * @param {StoredQuery} storedQuery the stored query
   * @param {object} options a set of options to constumise the request
   * @param {string} [options.transactionId] an optional transaction id
   * @param {StoredQueryGetCallback} [callback] Response callback's returns the deleted query
   */
  storeQuery(storedQuery, options, callback = () => { })
  {
    let url = `${this.url}repository/${this.graphName}/stored-query`;

    if (!options || typeof (options) == 'function')
    {
      callback = options;
      options = {};
    }

    let params = {
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify(storedQuery)
    };

    if (options.transactionId)
    {
      params.headers['transactionId'] = options.transactionId;
    }

    request.post(url, params, (err, res) =>
    {
      if (err)
      {
        callback(err);
        return;
      }

      if (requestCompletedWithSuccess(res.statusCode))
      {
        callback(null, res.body);
        return;
      } else
      {
        callback(stringifyResponseLog(res));
      }
    });
  }


  /**
   * Asks HKBase to resolve an Fragment Identifier (FI) 
   *
   * @param {Array} fi FI string
   * @param {GetEntitiesCallback} callback Callback with the Fragment Data or JSON Description, and content type
   */
  resolveFI(fi, callback = () => { })
  {
    let url = this.url + "repository/" + this.graphName + "/fi/" + encodeURIComponent(fi);

    request.get(url, this.options, (err, res) =>
    {
      if (!err)
      {
        if (requestCompletedWithSuccess(res.statusCode))
        {
          try
          {
            callback(null, res.body, res.headers.contentType);
          }
          catch (exp)
          {
            callback(exp)
          }
        }
        else
        {
          callback(`Server responded with ${res.statusCode}. ${res.body}`);
        }
      }
      else
      {
        callback(err);
      }
    });
  }
 
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
  runStoredQuery(queryId, runConfiguration, options, callback = () => { })
  {
    let url = `${this.url}repository/${this.graphName}/stored-query/${queryId}/run`;

    if (!options || typeof (options) === 'function')
    {
      callback = options;
      options = {};
    }

    let params = {
      headers: {
        "content-type": options["content-type"] || "application/json"
      },
      body: JSON.stringify(runConfiguration)
    };

    if (options.mimeType)
    {
      params.headers['Accept'] = options.mimeType;
    }

    if (options.transactionId)
    {
      params.headers['transactionId'] = options.transactionId;
    }

    request.post(url, params, (err, res) =>
    {
      if (err)
      {
        callback(err);
        return;
      }

      if (requestCompletedWithSuccess(res.statusCode))
      {
        callback(null, res.body);
        return;
      } else
      {
        callback(stringifyResponseLog(res));
      }
    });
  }

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
  static getAuthToken(authSecret, expiresIn = 2 * 60)
  {
    if (authSecret)
    {
      if (!expiresIn)
      {
        return jwt.sign({}, authSecret, {});
      }
      return jwt.sign({}, authSecret, { expiresIn: expiresIn });
    }
    return '';
  }


  /**
   * Alias to `saveEntities`. Add entities may also update entities
   *
   * @param {Array} entities array of entities to be added or updated
   * @param {AddEntitiesCallback} callback Response callback
   */
  addEntities(entities, callback)
  {
    return this.saveEntities(entities, callback)
  }


  /**
   * Import a RDF data
   * @param {string} data the contents of the RDF
   * @param {object} options a set of options to customize the importation
   * @param {string} options.contentType the mimeType of the serialization for the RDF data
   * @param {string} options.context the target context to import the entities
   * @param {OperationCallback} callback Response callback
   */

  import(data, options, callback)
  {
    return this.importRDF(data, options, callback)
  }

  getAuthToken(authSecret, expiresIn = 2 * 60)
  {
    return HKDatasource.getAuthToken(authSecret, expiresIn)
  }

}

function getDefaultAxiosConfig()
{
  return {
    httpAgent: new http.Agent({keepAlive: true}),
    httpsAgent: new https.Agent({keepAlive: true}),
    maxContentLength: Infinity,
    maxBodyLength: Infinity,
    timeout: 20 * 60 * 1000, // 20 min
  };
}

function convertEntities(raw)
{
  let data = null;
  try
  {
    data = JSON.parse(raw);
  }
  catch (exp)
  {
    throw PARSE_FAILED_MESSAGE;
  }

  if (!data)
  {
    throw UNEXPECTED_NULL_DATA;
  }

  let entities = {};

  for (let k in data)
  {
    let entity = deserialize(data[k]);
    if (entity)
    {
      entities[entity.id] = entity;
    }
    else
    {
      console.warn(`Warning: Error deserializing entity ${JSON.stringify(data[k])}`)
    }
  }

  return entities;
}


// ---- 

function toQueryString(options)
{
  let optionsKeys = Object.keys(options);

  let queryString = "?";

  if (optionsKeys.length > 0)
  {
    for (let i = 0; i < optionsKeys.length; i++)
    {
      let k = optionsKeys[i]
      queryString += `${k}=${encodeURIComponent(options[k])}&`;
    }
  }
  return queryString;
}

function requestCompletedWithSuccess(code)
{
  return code >= 200 && code < 300;
}

function stringifyResponseLog(res)
{
  return `Server responded with ${res.statusCode}. ${res.body}`;
}

module.exports = HKDatasource;
