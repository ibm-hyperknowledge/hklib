/*
 * Copyright (c) 2016-present, IBM Research
 * Licensed under The MIT License [see LICENSE for details]
 */

import mocha from "mocha";
import { expect as expect$0 } from "chai";
import * as util from "../common.js";
import Context from "../../dist/mjs/context.js";
import Node from "../../dist/mjs/node.js";
import VContext from "../../dist/mjs/virtualcontext.js";
import HKEntity from "../../dist/mjs/hkentity.js";

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
