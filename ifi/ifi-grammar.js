// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

const moo = require("moo");

//TODO: define a better number format.

const lexer = moo.compile({
  QUOTED_STRING: /"(?:(?:""|[^"])*)"/,
  NUMBER: /[+-]?[0-9]+(?:\.[0-9]+)?/,
  UNQUOTED_IDENTIFIER: /[^"#\*<>?&=\s]+/,
  '<': '<',
  '>': '>',
  '#': '#',
  '*': '*',
  '?': '?',
  '&': '&',
  '=': '='});
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
    {"name": "ifi", "symbols": ["group"], "postprocess": id},
    {"name": "ifi", "symbols": ["atom"], "postprocess": id},
    {"name": "ifi", "symbols": ["ifi", "anchor"], "postprocess": (d) => { return {type: 'ifi', artifact: d[0], anchor: d[1]} }},
    {"name": "group", "symbols": [{"literal":"<"}, "ifi", {"literal":">"}], "postprocess": (d) => { return {type: 'group', artifact: d[1] } }},
    {"name": "anchor$ebnf$1$subexpression$1", "symbols": [{"literal":"?"}, "token"]},
    {"name": "anchor$ebnf$1", "symbols": ["anchor$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "anchor$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "anchor", "symbols": ["oper", "indexer", "anchor$ebnf$1"], "postprocess":  (d) => { return {
        type: 'anchor', 
        oper: d[0][0].value, 
        indexer: d[1], 
        token: (d.length > 2 && d[2]) ? d[2][1] : undefined} } },
    {"name": "oper", "symbols": [{"literal":"#"}]},
    {"name": "oper", "symbols": [{"literal":"*"}]},
    {"name": "token", "symbols": ["argument_list"], "postprocess": (d) => { return new Map(d[0]) }},
    {"name": "token", "symbols": ["atom"], "postprocess": id},
    {"name": "token", "symbols": ["group"], "postprocess": id},
    {"name": "argument_list", "symbols": ["argument"], "postprocess": (d) => { return [d[0]] }},
    {"name": "argument_list", "symbols": ["argument", {"literal":"&"}, "argument_list"], "postprocess": (d) => { return [d[0], ...d[2]] }},
    {"name": "argument", "symbols": ["parameter", {"literal":"="}, "value"], "postprocess": (d) => { return [d[0], d[2]] }},
    {"name": "indexer", "symbols": ["atom"], "postprocess": id},
    {"name": "indexer", "symbols": ["group"], "postprocess": id},
    {"name": "parameter", "symbols": [(lexer.has("UNQUOTED_IDENTIFIER") ? {type: "UNQUOTED_IDENTIFIER"} : UNQUOTED_IDENTIFIER)], "postprocess": (d) => { return String(d[0]) }},
    {"name": "value", "symbols": [(lexer.has("QUOTED_STRING") ? {type: "QUOTED_STRING"} : QUOTED_STRING)], "postprocess": (d) => { return String(d[0]) }},
    {"name": "value", "symbols": [(lexer.has("NUMBER") ? {type: "NUMBER"} : NUMBER)], "postprocess": (d) => { return parseFloat(d[0]) }},
    {"name": "value", "symbols": ["group"], "postprocess": id},
    {"name": "atom", "symbols": [(lexer.has("UNQUOTED_IDENTIFIER") ? {type: "UNQUOTED_IDENTIFIER"} : UNQUOTED_IDENTIFIER)], "postprocess": (d) => { return {type: 'atom', value: String(d[0])} }},
    {"name": "atom", "symbols": [(lexer.has("QUOTED_STRING") ? {type: "QUOTED_STRING"} : QUOTED_STRING)], "postprocess": (d) => { return {type: 'atom', value: String(d[0])} }}
]
  , ParserStart: "ifi"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();