"use strict";

const mocha = require("mocha");
const expect = require("chai").expect;

const util = require("../common");

const Context = require("../../context");
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

	
	it("Add Virtual Context'", done => {
		const vContext = new VContext("VContext", "http://dbpedia.org/sparql");

		console.log(vContext);
		HKDatasource.saveEntities([vContext], (err, data)=> {
			console.log(data);
			if (err) throw err;
			done();

		});
			
	});
})
