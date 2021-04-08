
const nearley = require("nearley");
const moo = require("moo");

const grammar = require("./ifi-grammar.js");
const IFI = require("./ifi.js");

const compGrammar = nearley.Grammar.fromCompiled(grammar);


function testIfi(str)
{
   let  myIfi = new IFI(str);
    console.log(myIfi);
    console.log(str);
    console.log(myIfi.toString());
    if (str !== myIfi.toString()){
        console.log('ˆˆˆFAIL!ˆˆˆˆ');
        return false;
    }
    return true;
}


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


let myIfi;

let failuresCount = 0;
let testsCount = 0;
failuresCount += testIfi('picture1.jpg#func?p1="v1"&p2=43.23') ? 0 : 1;
testsCount++;
failuresCount += testIfi('picture1.jpg') ? 0 : 1;
testsCount++;
failuresCount += testIfi('picture1.jpg#func') ? 0 : 1;
testsCount++;
failuresCount += testIfi('picture1.jpg#func?p1="v1"&p2=43.23') ? 0 : 1;
testsCount++;
failuresCount += testIfi('picture1.jpg#<http://exemple.org/fmask>?m=3') ? 0 : 1;
testsCount++;
failuresCount += testIfi('http://example.org/document.txt#subtext?istart=2&iend=5') ? 0 : 1;
testsCount++;
failuresCount += testIfi('http://www.example.org/mytext.txt#subtext?start=4&end=56#char?ind=2') ? 0 : 1;
testsCount++;
failuresCount += testIfi('http://www.example.org/mytext.txt*subtext?start=4&end=56') ? 0 : 1;
testsCount++;
failuresCount += testIfi('picture1.jpg#<http://exemple.org/fmask>?<themask.bmp>') ? 0 : 1;
testsCount++;
failuresCount += testIfi('picture1.jpg#<http://exemple.org/fmask>?m=<themask.bmp>&p=56') ? 0 : 1;
testsCount++;
failuresCount += testIfi('http://www.co-ode.org/ontologies/pizza/pizza.owl#VegetarianPizza') ? 0 : 1;
testsCount++;

if(failuresCount === 0)
{
    console.log(`###### ${testsCount} tests successfully executed!`);
}
else
{
    console.log(`###### ${failuresCount} of ${testsCount} tests failed!`);
}
