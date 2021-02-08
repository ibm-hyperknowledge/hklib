@{%
const moo = require("moo");

const lexer = moo.compile({
  QUOTED_STRING: /"(?:(?:""|[^"])*)"/,
  STRING_NO_SHARP_NO_DIAMONDS: /[^"#@<>?&=\s]+/,
  '<': '<',
  '>': '>',
  '#': '#',
  '?': '?',
  '&': '&',
  '=': '='});
%}

# Pass your lexer object using the @lexer option:
@lexer lexer

@builtin "number.ne"

ifi -> group            {% (d) => {return processIfi(d)} %}
    | atom              {% (d) => {return processIfi(d)} %}
    | ifi "#" fragment  {% (d) => {return processIfi(d)} %}
fragment -> full_anchor {% (d) => {return processFragment(d)} %}
    | simple_anchor     {% (d) => {return processFragment(d)} %}
group -> "<" ifi ">"    {% (d) => {return processGroup(d)} %}

full_anchor -> indexer "?" argument_list {% (d) => {return processFullAnchor(d)} %}
argument_list ->  argument               {% (d) => {return processArgumentList(d)} %}
    | argument "&" argument_list         {% (d) => {return processArgumentList(d)} %}
argument -> parameter "=" value          {% (d) => {return processArgument(d)} %}

simple_anchor -> indexer {% (d) => {return processSimpleAnchor(d)} %}

indexer -> atom    {% (d) => { return processIfi(d) } %}
    | group        {% (d) => { return  processIfi(d) } %}

parameter -> %STRING_NO_SHARP_NO_DIAMONDS    {% (d) => { return String(d[0]) } %}
value -> %QUOTED_STRING                      {% (d) => { return String(d[0]) } %}
    | jsonfloat                              {% (d) => { return parseFloat(d[0]) } %}

atom -> %STRING_NO_SHARP_NO_DIAMONDS    {% (d) => {return processAtom(d)} %}
    |  %QUOTED_STRING                   {% (d) => {return processAtom(d)} %}


@{%

//Try to emulate lark idiom for parsing

function processIfi(d){
    if (d[0].type === 'group'){
        return {
            type:'ifi',
            artifact: d[0].value 
        }
    } else if (d[0].type === 'ifi'){
        d[0].fragment = d[2];
        return d[0];
    } else if (d[0].type === 'atom'){
        return {
            type:'ifi',
            artifact: d[0].value 
        }
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
    return {
        type: 'anchor',
        indexer: d[0],
        arguments: d[2]
    }
}

function processArgumentList(d){
    if (d.length > 1){
        //more than one parameter/value pair
        return {...d[0], ...d[2]};
    } else if (d.length == 1){
        return d[0];
    }
}

function processArgument(d){
    let pair = {};
    pair[d[0]] = d[2];
    console.log(pair);
    return pair;
}

function processSimpleAnchor(d){
    return {
        type: 'anchor',
        indexer: d[0],
    }
}



function processAtom(d){
    return {
        type: 'atom',
        value: String(d[0])
    }
}

%}