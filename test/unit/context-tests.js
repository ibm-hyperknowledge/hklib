/*
 * Copyright (c) 2016-present, IBM Research
 * Licensed under The MIT License [see LICENSE for details]
 */

import mocha from "mocha";
import { expect } from "chai";
import Context from "../../dist/mjs/context.js";
import VContext from "../../dist/mjs/virtualcontext.js";
import HKEntity from "../../dist/mjs/hkentity.js";

describe("Contexts unit tests:", () => {
    it('Inheritance Tests', done => {
        expect(Context.prototype).to.be.instanceOf(HKEntity);
        expect(VContext.prototype).to.be.instanceOf(Context);
        expect(VContext.prototype).to.be.instanceOf(HKEntity);
        done();
    });
});
