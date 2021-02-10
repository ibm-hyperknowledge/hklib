@{%
const moo = require("moo");

//TODO: define a better number format.

const lexer = moo.compile({
  QUOTED_STRING: /"(?:(?:""|[^"])*)"/,
  NUMBER: /[+-]?[0-9]+(?:\.[0-9]+)?/,
  UNQUOTED_IDENTIFIER: /[^"#@<>?&=\s]+/,
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
    | ifi "#" anchor  {% (d) => {return processIfi(d)} %}
anchor -> full_anchor {% (d) => {return processAnchor(d)} %}
    | simple_anchor     {% (d) => {return processAnchor(d)} %}
group -> "<" ifi ">"    {% (d) => {return processGroup(d)} %}

full_anchor -> indexer "?" argument_list {% (d) => {return processFullAnchor(d)} %}
argument_list ->  argument               {% (d) => {return processArgumentList(d)} %}
    | argument "&" argument_list         {% (d) => {return processArgumentList(d)} %}
argument -> parameter "=" value          {% (d) => {return processArgument(d)} %}

simple_anchor -> indexer {% (d) => {return processSimpleAnchor(d)} %}

indexer -> atom    {% (d) => { return processIfi(d) } %}
    | group        {% (d) => { return  processIfi(d) } %}

parameter -> %UNQUOTED_IDENTIFIER    {% (d) => { return String(d[0]) } %}
value -> %QUOTED_STRING                      {% (d) => { return String(d[0]) } %}
    | %NUMBER                                {% (d) => { return parseFloat(d[0]) } %}

atom -> %UNQUOTED_IDENTIFIER    {% (d) => {return processAtom(d)} %}
    |  %QUOTED_STRING                   {% (d) => {return processAtom(d)} %}


@{%

//Try to emulate lark idiom for parsing

const {IFI, Anchor} = require("./ifi");

function processIfi(d){
    // console.log('- Processing IFI:');
    // console.log(d);
    if (d[0].type === 'group'){
        return new IFI(d[0].value);
    } else if (d[0].type === 'atom'){
        return new IFI(d[0].value);
    } else if (d[0] instanceof IFI){
        if (d[0].hasAnchor()){
            return new IFI(d[0],d[2]);
        } else {
            d[0].anchor = d[2];
            return d[0];
        }
    }
}

function processAnchor(d){
    // console.log('--- Processing anchor:');
    // console.log(d);
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

%}