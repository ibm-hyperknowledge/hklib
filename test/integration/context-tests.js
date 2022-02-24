"use strict";

const mocha = require("mocha");
const expect = require("chai").expect;

const util = require("../common");

const Context = require("../../dist/context");
const Node = require("../../dist/node");
const VContext = require("../../dist/virtualcontext");
const HKEntity = require("../../dist/hkentity");

const HKDatasource = util.preamble();


describe("Contexts integration tests:", () => {

	beforeEach(done => {
		HKDatasource.createRepository((err,  data)=>
		{
			if (err) throw err;
			done();
			
		});
	}); 

	afterEach(done => {
		HKDatasource.dropRepository((err,  data)=> {
			if (err) throw err;
			done();		
		});		
	})

	
	it("Add Virtual Context", done => {
		const vContext = new VContext("VContext", "http://dbpedia.org/sparql");

		HKDatasource.saveEntities([vContext], (err, data)=> {
			if (err) throw err;
			done();

		});
			
	});

  it("Test fetch context children including context", done => {
		const context = new Context("Parent");
    const node = new Node("Son", context.id);

		HKDatasource.saveEntities([context, node], (err, data)=> {
			if (err) throw err;

      const payload = {
        "hkTypes": [],
        "nested": false,
        "includeContextOnResults": true
      }
      
      HKDatasource.getContextChildren(context.id, payload, payload, (err, data)=>{
        if (err) throw err;
        
        expect([context.id, node.id].sort()).to.be.deep.equal(Object.keys(data).sort());
        done();
      })
			
		});
			
	});

  it("Test fetch context children not including context", done => {
    const context = new Context("Parent");
    const node = new Node("Son", context.id);

    HKDatasource.saveEntities([context, node], (err, data)=> {
      if (err) throw err;

      const payload = {
        "hkTypes": [],
        "nested": false,
        "includeContextOnResults": false
      }
      
      HKDatasource.getContextChildren(context.id, payload, payload, (err, data)=>{
        if (err) throw err;
        
        expect([node.id]).to.be.deep.equal(Object.keys(data));
        done();
      })
      
    });
  });

  it("Test fetch context nodes children", done => {
    const context = new Context("Parent");
    const node = new Node("Son", context.id);
    const nested = new Context("Nested", context.id);

    HKDatasource.saveEntities([context, node, nested], (err, data)=> {
      if (err) throw err;

      const payload = {
        "hkTypes": ["node"],
        "nested": false,
        "includeContextOnResults": false
      }
      
      HKDatasource.getContextChildren(context.id, payload, payload, (err, data)=>{
        if (err) throw err;
        
        expect([node.id]).to.be.deep.equal(Object.keys(data));
        done();
      })
      
    });
  });

  it("Test fetch context nodes children", done => {
    const context = new Context("Parent");
    const vContext = new VContext("VContext", "http://dbpedia.org/sparql", "Parent")

    HKDatasource.saveEntities([context, vContext], (err, data)=> {
      if (err) throw err;

      const payload = {
        "hkTypes": ["context"],
        "nested": false,
        "lazy": false,
        "includeContextOnResults": false,
        "fieldsToInclude": { "fields": ["id", "parent", "type"], "properties": ["virtualsrc"]} 
      }
      
      HKDatasource.getContextChildren(context.id, payload, payload, (err, data)=>{
        if (err) throw err;
        expect(vContext.id).to.be.deep.equal(Object.values(data)[0].id);
        expect(vContext.parent).to.be.deep.equal(Object.values(data)[0].parent);
        expect(vContext.properties["virtualsrc"]).to.be.equal(Object.values(data)[0].properties["virtualsrc"]);
        done();
      })
      
    });
  });
})
