@{%
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
%}

# Pass your lexer object using the @lexer option:
@lexer lexer

@builtin "number.ne"

ifi -> group          {% id %} 
    | atom            {% id %} 
    | ifi anchor      {% (d) => { return {type: 'ifi', artifact: d[0], anchor: d[1]} } %}
group -> "<" ifi ">"  {% (d) => { return {type: 'group', artifact: d[1] } } %}  

anchor -> mod indexer ("?" token):?  {% (d) => { return {
                                                type: 'anchor', 
                                                mod: d[0][0].value, 
                                                indexer: d[1], 
                                                token: (d.length > 2 && d[2]) ? d[2][1] : undefined} } %}

mod -> "#" | "*"

token -> argument_list     {% (d) => { return new Map(d[0]) } %}
        | atom             {% id %} 
        | group            {% id %} 

argument_list ->  argument               {% (d) => { return [d[0]] } %}
    | argument "&" argument_list         {% (d) => { return [d[0], ...d[2]] } %}
argument -> parameter "=" value          {% (d) => { return [d[0], d[2]] } %}

indexer -> atom     {% id %}
    | group         {% id %}

parameter -> %UNQUOTED_IDENTIFIER    {% (d) => { return String(d[0]) } %}
value -> %QUOTED_STRING                      {% (d) => { return String(d[0]) } %}
    | %NUMBER                                {% (d) => { return parseFloat(d[0]) } %}
                         

atom -> %UNQUOTED_IDENTIFIER    {% (d) => { return {type: 'atom', value: String(d[0])} } %}
    |  %QUOTED_STRING           {% (d) => { return {type: 'atom', value: String(d[0])} } %}          

