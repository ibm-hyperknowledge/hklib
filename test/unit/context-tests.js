"use strict";

const mocha = require("mocha");
const expect = require("chai").expect;

const util = require("../common");

const Context = require("../../dist/context");
const Node = require("../../dist/node");
const VContext = require("../../dist/virtualcontext");
const HKEntity = require("../../dist/hkentity");

const HKDatasource = util.preamble();


describe("Contexts unit tests:", () => {

	it('Inheritance Tests', done => {
		expect(Context.prototype).to.be.instanceOf(HKEntity);
		expect(VContext.prototype).to.be.instanceOf(Context);
		expect(VContext.prototype).to.be.instanceOf(HKEntity);
		done();
		
	});

})
