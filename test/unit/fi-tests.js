import { expect as expect$0 } from "chai";
import FI from "../../src/fi/fi.js";
const expect = { expect: expect$0 }.expect;
describe("Testing FI api:", () => {
    describe("Testing parsing and toString back:", () => {
        //Testing parsing and toString is a good sanity check for the parsing and serialization structure.
        //It is sensitive to separators though, such as spaces between arguments.
        let fiToTest = [
            'estImage.``rect``({x: 20,y: 20,w: 800,h: "20"})',
            '``picture1.jpg``',
            '``picture1.jpg``.func',
            '``picture1.jpg``.func({p1: "v1",p2: 43.23})',
            '``picture1.jpg``.``fmask``({m: 3})',
            '<http://example.org/document.txt>.subtext({istart: 2,iend: 5})',
            '<http://example.org/document.txt>.subtext({istart: 2,iend: 5}).subtext({istart: 0,iend: 2})',
            '<http://example.org/document.txt>.subtext*({istart: 2,iend: 5})',
            '``picture1.jpg``.<http://exemple.org/fmask>(``themask.bmp``)',
            '``picture1.jpg``.<http://exemple.org/fmask>({m: ``themask.bmp``,p: 56})',
            '``http://www.co-ode.org/ontologies/pizza/pizza.owl#VegetarianPizza``',
        ];
        for (let strFI of fiToTest) {
            //strFI = strFI.replace(/\s+/g, ''); //remove spaces
            it("Parsing and toString of " + strFI, done => {
                let fi = new FI(strFI);
                let restringified = fi.toString();
                expect(strFI).to.equal(restringified);
                done();
            });
        }
    });
});
