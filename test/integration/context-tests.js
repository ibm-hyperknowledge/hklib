/*
 * Copyright (c) 2016-present, IBM Research
 * Licensed under The MIT License [see LICENSE for details]
 */

import mocha from "mocha";
import { expect } from "chai";
import * as util from "../common.js";
import Context from "../../dist/mjs/context.js";
import Node from "../../dist/mjs/node.js";
import VContext from "../../dist/mjs/virtualcontext.js";

const HKDatasource = await util.preamble();
describe("Contexts integration tests:", () => {
    beforeEach(done => {
        HKDatasource.createRepository((err, data) => {
            if (err)
                throw err;
            done();
        });
    });
    afterEach(done => {
        HKDatasource.dropRepository((err, data) => {
            if (err)
                throw err;
            done();
        });
    });
    it("Add Virtual Context", done => {
        const vContext = new VContext("VContext", "http://dbpedia.org/sparql", "rdf");
        HKDatasource.saveEntities([vContext], (err, data) => {
            if (err)
                throw err;
            done();
        });
    });
    it("Test fetch context children including context", done => {
        const context = new Context("Parent");
        const node = new Node("Son", context.id);
        HKDatasource.saveEntities([context, node], (err, data) => {
            if (err)
                throw err;
            const payload = {
                "hkTypes": [],
                "nested": false,
                "includeContextOnResults": true
            };
            HKDatasource.getContextChildren(context.id, payload, payload, (err, data) => {
                if (err)
                    throw err;
                expect([context.id, node.id].sort()).to.be.deep.equal(Object.keys(data).sort());
                done();
            });
        });
    });
    it("Test fetch context children not including context", done => {
        const context = new Context("Parent");
        const node = new Node("Son", context.id);
        HKDatasource.saveEntities([context, node], (err, data) => {
            if (err)
                throw err;
            const payload = {
                "hkTypes": [],
                "nested": false,
                "includeContextOnResults": false
            };
            HKDatasource.getContextChildren(context.id, payload, payload, (err, data) => {
                if (err)
                    throw err;
                expect([node.id]).to.be.deep.equal(Object.keys(data));
                done();
            });
        });
    });
    it("Test fetch context nodes children", done => {
        const context = new Context("Parent");
        const node = new Node("Son", context.id);
        const nested = new Context("Nested", context.id);
        HKDatasource.saveEntities([context, node, nested], (err, data) => {
            if (err)
                throw err;
            const payload = {
                "hkTypes": ["node"]
            };
            const options = {
                "nested": false,
                "includeContextOnResults": false
            };
            HKDatasource.getContextChildren(context.id, options, payload, (err, data) => {
                if (err)
                    throw err;
                expect([node.id]).to.be.deep.equal(Object.keys(data));
                done();
            });
        });
    });
    it("Test fetch context nodes children", done => {
        const context = new Context("Parent");
        const vContext = new VContext("VContext", "http://dbpedia.org/sparql", "rdf", "Parent");
        HKDatasource.saveEntities([context, vContext], (err, data) => {
            if (err)
                throw err;
            const payload = {
                "hkTypes": ["virtualcontext"],
                "fieldsToInclude": { "fields": ["id", "parent", "type"], "properties": ["virtualsrc"] }
            };
            const options = {
                "includeContextOnResults": false,
                "nested": false,
                "lazy": false,
            };
            HKDatasource.getContextChildren(context.id, options, payload, (err, data) => {
                if (err)
                    throw err;
                expect(vContext.id).to.be.deep.equal(Object.values(data)[0].id);
                expect(vContext.parent).to.be.deep.equal(Object.values(data)[0].parent);
                expect(vContext.properties["virtualsrc"]).to.be.equal(Object.values(data)[0].properties["virtualsrc"]);
                done();
            });
        });
    });
});
