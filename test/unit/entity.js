"use strict";

const mocha = require("mocha");
const expect = require("chai").expect;

const util = require("../common");

const Context = require("../../context");
const Node = require("../../node");
const VContext = require("../../virtualcontext");
const HKEntity = require("../../hkentity");

const HKDatasource = util.preamble();


describe("Contexts unit tests:", () => {

	before(done => {
		HKDatasource.createRepository((err,  data)=>
		{
			if (err) throw err;
			done();
			
		});
	}); 

	after(done => {
		HKDatasource.dropRepository((err,  data)=> {
			if (err) throw err;
			done();
				
		});		
	})

	it('Inheritance Tests', done => {
		expect(Context.prototype).to.be.instanceOf(HKEntity);
		expect(VContext.prototype).to.be.instanceOf(Context);
		expect(VContext.prototype).to.be.instanceOf(HKEntity);
		done();
		
	});

	
	it("Add Virtual Context", done => {
		const vContext = new VContext("VContext", "http://dbpedia.org/sparql");

		console.log(vContext);
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
        "specificTypes": [],
        "nested": false,
        "includeContextOnResults": true
      }
      
      HKDatasource.getContextChildrenLazy(context.id, payload, (err, data)=>{
        if (err) throw err;
        
        expect([context.id, node.id].sort()).to.be.deep.equal(data.sort());
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
        "specificTypes": [],
        "nested": false,
        "includeContextOnResults": false
      }
      
      HKDatasource.getContextChildrenLazy(context.id, payload, (err, data)=>{
        if (err) throw err;
        
        expect([node.id]).to.be.deep.equal(data);
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
        "specificTypes": ["node"],
        "nested": false,
        "includeContextOnResults": false
      }
      
      HKDatasource.getContextChildrenLazy(context.id, payload, (err, data)=>{
        if (err) throw err;
        
        expect([node.id]).to.be.deep.equal(data);
        done();
      })
      
    });
  });
})
