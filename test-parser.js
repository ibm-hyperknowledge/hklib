

const nearley = require("nearley");
const grammar = require("./ifi-grammar.js");
const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));

// let l = parser.feed('lala.jpg#func');
// console.log(l.results);
let l = parser.feed('lala.jpg#func?p1="v1"&p2=23');
console.log(l.results);

l = 0;