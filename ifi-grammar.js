// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

const moo = require("moo");

//TODO: define a better number format.

const lexer = moo.compile({
  QUOTED_STRING: /"(?:(?:""|[^"])*)"/,
  NUMBER: /[+-]?[0-9]+(?:\.[0-9]+)?/,
  STRING_NO_SHARP_NO_DIAMONDS: /[^"#@<>?&=\s]+/,
  '<': '<',
  '>': '>',
  '#': '#',
  '?': '?',
  '&': '&',
  '=': '='});



//Try to emulate lark idiom for parsing

const {IFI, Anchor} = require("./ifi");

function processIfi(d){
    if (d[0].type === 'group'){
        return new IFI(d[0].value);
    } else if (d[0] instanceof IFI){
        d[0].fragment = d[2];
        return d[0];
    } else if (d[0].type === 'atom'){
        return new IFI(d[0].value);
    }
}

function processFragment(d){
    return d[0];
}


function processGroup(d){
    return {
        type: 'group',
        value: d[0]
    }
}


function processFullAnchor(d){
    //unstack arguments
    let mapArgs = new Map();
    const lstArgs = d[2];
    for (let i = lstArgs.length - 1; i >= 0; i--){
        mapArgs.set(lstArgs[i][0], lstArgs[i][1]);
    }
    
    return new Anchor(d[0], mapArgs);
}

function processArgumentList(d){
    if (d.length > 1){
        //more than one parameter/value pair
        d[2].push(d[0])
        return d[2];
    } else if (d.length == 1){
        return [d[0]];
    }
}

function processArgument(d){
    return [d[0], d[2]];
}

function processSimpleAnchor(d){
    return new Anchor(d[0]);
}



function processAtom(d){
    return {
        type: 'atom',
        value: String(d[0])
    }
}

var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "unsigned_int$ebnf$1", "symbols": [/[0-9]/]},
    {"name": "unsigned_int$ebnf$1", "symbols": ["unsigned_int$ebnf$1", /[0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "unsigned_int", "symbols": ["unsigned_int$ebnf$1"], "postprocess": 
        function(d) {
            return parseInt(d[0].join(""));
        }
        },
    {"name": "int$ebnf$1$subexpression$1", "symbols": [{"literal":"-"}]},
    {"name": "int$ebnf$1$subexpression$1", "symbols": [{"literal":"+"}]},
    {"name": "int$ebnf$1", "symbols": ["int$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "int$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "int$ebnf$2", "symbols": [/[0-9]/]},
    {"name": "int$ebnf$2", "symbols": ["int$ebnf$2", /[0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "int", "symbols": ["int$ebnf$1", "int$ebnf$2"], "postprocess": 
        function(d) {
            if (d[0]) {
                return parseInt(d[0][0]+d[1].join(""));
            } else {
                return parseInt(d[1].join(""));
            }
        }
        },
    {"name": "unsigned_decimal$ebnf$1", "symbols": [/[0-9]/]},
    {"name": "unsigned_decimal$ebnf$1", "symbols": ["unsigned_decimal$ebnf$1", /[0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "unsigned_decimal$ebnf$2$subexpression$1$ebnf$1", "symbols": [/[0-9]/]},
    {"name": "unsigned_decimal$ebnf$2$subexpression$1$ebnf$1", "symbols": ["unsigned_decimal$ebnf$2$subexpression$1$ebnf$1", /[0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "unsigned_decimal$ebnf$2$subexpression$1", "symbols": [{"literal":"."}, "unsigned_decimal$ebnf$2$subexpression$1$ebnf$1"]},
    {"name": "unsigned_decimal$ebnf$2", "symbols": ["unsigned_decimal$ebnf$2$subexpression$1"], "postprocess": id},
    {"name": "unsigned_decimal$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "unsigned_decimal", "symbols": ["unsigned_decimal$ebnf$1", "unsigned_decimal$ebnf$2"], "postprocess": 
        function(d) {
            return parseFloat(
                d[0].join("") +
                (d[1] ? "."+d[1][1].join("") : "")
            );
        }
        },
    {"name": "decimal$ebnf$1", "symbols": [{"literal":"-"}], "postprocess": id},
    {"name": "decimal$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "decimal$ebnf$2", "symbols": [/[0-9]/]},
    {"name": "decimal$ebnf$2", "symbols": ["decimal$ebnf$2", /[0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "decimal$ebnf$3$subexpression$1$ebnf$1", "symbols": [/[0-9]/]},
    {"name": "decimal$ebnf$3$subexpression$1$ebnf$1", "symbols": ["decimal$ebnf$3$subexpression$1$ebnf$1", /[0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "decimal$ebnf$3$subexpression$1", "symbols": [{"literal":"."}, "decimal$ebnf$3$subexpression$1$ebnf$1"]},
    {"name": "decimal$ebnf$3", "symbols": ["decimal$ebnf$3$subexpression$1"], "postprocess": id},
    {"name": "decimal$ebnf$3", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "decimal", "symbols": ["decimal$ebnf$1", "decimal$ebnf$2", "decimal$ebnf$3"], "postprocess": 
        function(d) {
            return parseFloat(
                (d[0] || "") +
                d[1].join("") +
                (d[2] ? "."+d[2][1].join("") : "")
            );
        }
        },
    {"name": "percentage", "symbols": ["decimal", {"literal":"%"}], "postprocess": 
        function(d) {
            return d[0]/100;
        }
        },
    {"name": "jsonfloat$ebnf$1", "symbols": [{"literal":"-"}], "postprocess": id},
    {"name": "jsonfloat$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "jsonfloat$ebnf$2", "symbols": [/[0-9]/]},
    {"name": "jsonfloat$ebnf$2", "symbols": ["jsonfloat$ebnf$2", /[0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "jsonfloat$ebnf$3$subexpression$1$ebnf$1", "symbols": [/[0-9]/]},
    {"name": "jsonfloat$ebnf$3$subexpression$1$ebnf$1", "symbols": ["jsonfloat$ebnf$3$subexpression$1$ebnf$1", /[0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "jsonfloat$ebnf$3$subexpression$1", "symbols": [{"literal":"."}, "jsonfloat$ebnf$3$subexpression$1$ebnf$1"]},
    {"name": "jsonfloat$ebnf$3", "symbols": ["jsonfloat$ebnf$3$subexpression$1"], "postprocess": id},
    {"name": "jsonfloat$ebnf$3", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "jsonfloat$ebnf$4$subexpression$1$ebnf$1", "symbols": [/[+-]/], "postprocess": id},
    {"name": "jsonfloat$ebnf$4$subexpression$1$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "jsonfloat$ebnf$4$subexpression$1$ebnf$2", "symbols": [/[0-9]/]},
    {"name": "jsonfloat$ebnf$4$subexpression$1$ebnf$2", "symbols": ["jsonfloat$ebnf$4$subexpression$1$ebnf$2", /[0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "jsonfloat$ebnf$4$subexpression$1", "symbols": [/[eE]/, "jsonfloat$ebnf$4$subexpression$1$ebnf$1", "jsonfloat$ebnf$4$subexpression$1$ebnf$2"]},
    {"name": "jsonfloat$ebnf$4", "symbols": ["jsonfloat$ebnf$4$subexpression$1"], "postprocess": id},
    {"name": "jsonfloat$ebnf$4", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "jsonfloat", "symbols": ["jsonfloat$ebnf$1", "jsonfloat$ebnf$2", "jsonfloat$ebnf$3", "jsonfloat$ebnf$4"], "postprocess": 
        function(d) {
            return parseFloat(
                (d[0] || "") +
                d[1].join("") +
                (d[2] ? "."+d[2][1].join("") : "") +
                (d[3] ? "e" + (d[3][1] || "+") + d[3][2].join("") : "")
            );
        }
        },
    {"name": "ifi", "symbols": ["group"], "postprocess": (d) => {return processIfi(d)}},
    {"name": "ifi", "symbols": ["atom"], "postprocess": (d) => {return processIfi(d)}},
    {"name": "ifi", "symbols": ["ifi", {"literal":"#"}, "fragment"], "postprocess": (d) => {return processIfi(d)}},
    {"name": "fragment", "symbols": ["full_anchor"], "postprocess": (d) => {return processFragment(d)}},
    {"name": "fragment", "symbols": ["simple_anchor"], "postprocess": (d) => {return processFragment(d)}},
    {"name": "group", "symbols": [{"literal":"<"}, "ifi", {"literal":">"}], "postprocess": (d) => {return processGroup(d)}},
    {"name": "full_anchor", "symbols": ["indexer", {"literal":"?"}, "argument_list"], "postprocess": (d) => {return processFullAnchor(d)}},
    {"name": "argument_list", "symbols": ["argument"], "postprocess": (d) => {return processArgumentList(d)}},
    {"name": "argument_list", "symbols": ["argument", {"literal":"&"}, "argument_list"], "postprocess": (d) => {return processArgumentList(d)}},
    {"name": "argument", "symbols": ["parameter", {"literal":"="}, "value"], "postprocess": (d) => {return processArgument(d)}},
    {"name": "simple_anchor", "symbols": ["indexer"], "postprocess": (d) => {return processSimpleAnchor(d)}},
    {"name": "indexer", "symbols": ["atom"], "postprocess": (d) => { return processIfi(d) }},
    {"name": "indexer", "symbols": ["group"], "postprocess": (d) => { return  processIfi(d) }},
    {"name": "parameter", "symbols": [(lexer.has("STRING_NO_SHARP_NO_DIAMONDS") ? {type: "STRING_NO_SHARP_NO_DIAMONDS"} : STRING_NO_SHARP_NO_DIAMONDS)], "postprocess": (d) => { return String(d[0]) }},
    {"name": "value", "symbols": [(lexer.has("QUOTED_STRING") ? {type: "QUOTED_STRING"} : QUOTED_STRING)], "postprocess": (d) => { return String(d[0]) }},
    {"name": "value", "symbols": [(lexer.has("NUMBER") ? {type: "NUMBER"} : NUMBER)], "postprocess": (d) => { return parseFloat(d[0]) }},
    {"name": "atom", "symbols": [(lexer.has("STRING_NO_SHARP_NO_DIAMONDS") ? {type: "STRING_NO_SHARP_NO_DIAMONDS"} : STRING_NO_SHARP_NO_DIAMONDS)], "postprocess": (d) => {return processAtom(d)}},
    {"name": "atom", "symbols": [(lexer.has("QUOTED_STRING") ? {type: "QUOTED_STRING"} : QUOTED_STRING)], "postprocess": (d) => {return processAtom(d)}}
]
  , ParserStart: "ifi"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
