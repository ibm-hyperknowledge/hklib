
const nearley = require("nearley");
const moo = require("moo");

const grammar = require("./ifi-grammar.js");
const { IFI } = require("./ifi.js");

const compGrammar = nearley.Grammar.fromCompiled(grammar);

let l;
let parser;

// parser = new nearley.Parser(compGrammar);
// l = parser.feed('picture1.jpg#func');
// console.log(l.results.toString());

// parser = new nearley.Parser(compGrammar);
// l = parser.feed('picture1.jpg#func?p1="v1"&p2=23');
// console.log(l.results.toString());

// parser = new nearley.Parser(compGrammar);
// l = parser.feed('picture1.jpg#func?p1="v1"&p2=43.23');
// console.log(l.results.toString());

// parser = new nearley.Parser(compGrammar);
// l = parser.feed('http://example.org/document.txt#subtext?istart=2&iend=5');
// console.log(l.results);

// myIfi = new IFI('picture1.jpg#func?p1="v1"&p2=43.23');
// console.log(myIfi.toString());

let myIfi;


myIfi = new IFI('picture1.jpg');
console.log(myIfi)
console.log(myIfi.toString());

myIfi = new IFI('picture1.jpg#func');
console.log(myIfi)
console.log(myIfi.toString());

myIfi = new IFI('picture1.jpg#func?p1="v1"&p2=43.23');
console.log(myIfi)
console.log(myIfi.toString());

myIfi = new IFI('http://example.org/document.txt#subtext?istart=2&iend=5');
console.log(myIfi)
console.log(myIfi.toString());

myIfi = new IFI('http://www.example.org/mytext.txt#subtext?start=4&end=56#char?ind=2');
console.log(myIfi)
console.log(myIfi.toString());

