"use strict";

import mocha from "mocha";
import { expect as expect$0 } from "chai";
import * as util from "../common.js";
import Context from "../../dist/context.js";
import Node from "../../dist/node.js";
import VContext from "../../dist/virtualcontext.js";
import HKEntity from "../../dist/hkentity.js";

const expect = { expect: expect$0 }.expect;
const HKDatasource = util.preamble();
describe("Contexts unit tests:", () => {
    it('Inheritance Tests', done => {
        expect(Context.prototype).to.be.instanceOf(HKEntity);
        expect(VContext.prototype).to.be.instanceOf(Context);
        expect(VContext.prototype).to.be.instanceOf(HKEntity);
        done();
    });
});
