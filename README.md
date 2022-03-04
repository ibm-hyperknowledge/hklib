# HKLib Tutorial

In this tutorial you are going to learn the basics about how to approach Hyperknowledge with our NodeJS library, HKLib. The topics that are going to be covered here are: how to add HKLib to your project, how to connect to a knowledge base, create your own repository, add Hyperknowledge entities to it, and retrieve information with queries. 

# Install

To use HKLib in your NodeJS project, you can install using:
```
npm install hklib
```

# Usage 
To include HKLib on your js file and use its features, you can do as follows:
```js 
const HKLib = require("hklib")
```
# Connecting to HKBase

To have access to HKBase, you will have to create a datasource object. First, you have to include the HKLib class for datasources, HKDatasource. After including the HKDatasource class to your file, you can use the following method to create a datasource connected to a HKBase in a specific repository (you may need an authentication token):

```js
const HKDatasource = HKLib.HKDatasource;
let datasource = new HKDatasource("<HKBase's URL, repository's name>", token);
```
 For example:
```js
let datasource = new HKDatasource("https://hkbase-dev.mybluemix.net/", "testRepository", "exampleToken");
```
It receives as parameters the base URL of the HKBase, the name of a repository and an authentication token. The repository may or may not exist - in case it does, the datasource will be connected to the informed repository and every operation will be performed on this repository. In case the repository does not exist, the datasource object can be used to create the informed repository, as the next topic will show.

## Create new repository

Once the name of a repository is defined in the datasource object, you can call the following method to create this repository:
```js
let datasource = new HKDatasource("https://hkbase-dev.mybluemix.net/", "testRepository", token);
datasource.createRepository((err,  data)=>
{
	if(!err){
		callback(datasource.graphName);
	}
    else
    {
        callback(err);
    }
});
``` 
Once the operation is concluded, whether it was successful or not, a callback function will be invoked with the informed parameter. 

## Get all repositories

If you have a datasource object connected to a HKBase, you can get a list with all the repositories on that base with the following method:
```js
datasource.getRepositories((err, data) =>
{
    if(!err)
    {
	    //data is a list with all repositories currently on HKBase
        callback(data)
    }
    else
    {
        callback(err)
    }
});
```
If the operation is successful, a callback function will be invoked with the list of repositories as a parameter.


## Delete repository
To delete a repository, the datasource object has to be connected to the repository that you want to drop. For example:
```js
let datasource = new HKDatasource("https://hkbase-dev.mybluemix.net/", "testRepository", token);
datasource.dropRepository((err,  data)=>
{
	if(!err){
		callback(datasource.graphName);
	}
	else{
		callback(err)
	}
});
```

# Managing entities

HKLib supports several operations with entities, such as creating entities (contexts, nodes, links), adding them to a repository, retrieving entities, and removing them. The following sections will explain each of these functionalities.

## Create a Context
To create a new context, you have to include the HKLib class for Contexts to your file. After that, you can use the following method to create a context:
```js
const  Context  =  HKLib.Context;
let context = new Context("Name of Context")
```
The example above creates a context in the root of your repository. If you want to insert a context inside of an existing context, you have to put the name of the existing context besides the name of the new context. For example, let's create the context Geological Structures, and them create a new context Salt Diapir, inserting it inside of the "Geological Structures" context.
```js
let context1 = new Context("GeologicalStructures")
let context2 = new Context("SaltDiapir",context1.id)
```
The name of an entity is called its **id**. Id's should not contain spaces, and should be unique.

## Create a Node


**HKLib**

To create a node using HKLib, you have to include the HKLib class for Nodes to your file.
```js
const  Node  =  HKLib.Node;
```
Then, before creating any entity or adding it to HKBase, it is important to create an array to store these entities.  
```js
let  entities  = [];
```
After that, you can use the following method to create a
 node:
```js
let n1 = new Node("Name of node", "Context in which the node will be inserted");
```
For example, let's create a simple node:
```js
let n1 = new Node("SaltDiapir", null);
```
Before assigning a node to a context, the context has to already exist.  For example, we created the context *GeographicPatterns*, now I am going to add the node *SaltDiapir* to this context.

```js
let n1 = new Node("SaltDiapir", "GeographicPatterns");
//you can either write the name of the context or use the context.id
let n = new Node("SaltDiapir", context.id);
entities.push(n1.serialize());
```
For example, let's create a simple node:
```js
let n1 = new Node("SaltDiapir", null);
entities.push(n1.serialize());
```
After creating a node, you have to add this node to the entities array, and serialize the entity you just created - this will convert it from object to Hyperknowledge format, which will be ready to be added to HKBase. To add any type of entity on Hyperknowledge to HKBase, you will have to use the datasource object. 

```js
datasource.addEntities(entities,  (err,  data)=>{
	if(!err){
		//Include your code here
	}
	else{
		console.log(err)
	}
});
```

# Build

From version 4.x.x onwards, HKLib has started to accept Typescript code. Therefore, if you want to use and collaborate with the source code, you will need to compile the project to generate the javascript files that will be added to the `dist` folder:

```
npm run build
```