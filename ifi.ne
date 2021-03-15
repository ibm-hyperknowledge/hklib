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

ifi -> group          {% id %} 
    | atom            {% id %} 
    | ifi "#" anchor  {% (d) => { return {type: 'ifi', artifact: d[0], anchor: d[2] } } %}
anchor -> full_anchor {% id %} 
    | simple_anchor   {% id %} 
group -> "<" ifi ">"  {% (d) => { return {type: 'group', artifact: d[0] } } %}  

full_anchor -> indexer "?" argument_list {% (d) => { return {type: 'anchor', indexer: d[0], arguments: d[2] } } %}
argument_list ->  argument               {% (d) => { return [d[0]] } %}
    | argument "&" argument_list         {% (d) => { return [d[0], ...d[2]] } %}
argument -> parameter "=" value          {% (d) => { return {type: 'argument', parameter: d[0], value: d[2]} } %}

simple_anchor -> indexer    {% id %}

indexer -> atom     {% id %}
    | group         {% id %}

parameter -> %UNQUOTED_IDENTIFIER    {% (d) => { return String(d[0]) } %}
value -> %QUOTED_STRING                      {% (d) => { return String(d[0]) } %}
    | %NUMBER                                {% (d) => { return parseFloat(d[0]) } %}
                         

atom -> %UNQUOTED_IDENTIFIER    {% (d) => { return {type: 'atom', value: String(d[0])} } %}
    |  %QUOTED_STRING           {% (d) => { return {type: 'atom', value: String(d[0])} } %}          

