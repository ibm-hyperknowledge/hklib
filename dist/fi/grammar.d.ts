/**
* Copyright (c) 2016-present, IBM Research
* Licensed under The MIT License [see LICENSE for details]
*/
declare var _default: "

fijs				::= id (DOT_OP anchor)*

anchor              ::= indexer ( operator )? ( BEGIN_PARAM token END_PARAM )?
indexer             ::= id

token               ::= jsonValue 

DOT_OP              ::= '.'
operator            ::= '*'
BEGIN_PARAM         ::= WS* '(' WS*
END_PARAM           ::= WS* ')' WS*


/* json token - adapted from https://github.com/lys-lang/node-ebnf */
jsonValue           ::= fijs | false | null | true | object | array | number | string 
BEGIN_ARRAY         ::= WS* #x5B WS*  /* [ left square bracket */
BEGIN_OBJECT        ::= WS* #x7B WS*  /* { left curly bracket */
END_ARRAY           ::= WS* #x5D WS*  /* ] right square bracket */
END_OBJECT          ::= WS* #x7D WS*  /* } right curly bracket */
NAME_SEPARATOR      ::= WS* #x3A WS*  /* : colon */
VALUE_SEPARATOR     ::= WS* #x2C WS*  /* , comma */
WS                  ::= [#x20#x09#x0A#x0D]+   /* Space | Tab | 
 |  */
false               ::= \"false\"
null                ::= \"null\"
true                ::= \"true\"
object              ::= BEGIN_OBJECT (member (VALUE_SEPARATOR member)*)? END_OBJECT
member              ::= (string | id) NAME_SEPARATOR jsonValue
array               ::= BEGIN_ARRAY (jsonValue (VALUE_SEPARATOR jsonValue)*)? END_ARRAY

number              ::= \"-\"? (\"0\" | [1-9] [0-9]*) (\".\" [0-9]+)? ((\"e\" | \"E\") ( \"-\" | \"+\" )? (\"0\" | [1-9] [0-9]*))?

/* STRINGS */

string              ::= '\"' (([#x20-#x21] | [#x23-#x5B] | [#x5D-#xFFFF]) | #x5C (#x22 | #x5C | #x2F | #x62 | #x66 | #x6E | #x72 | #x74 | #x75 HEXDIG HEXDIG HEXDIG HEXDIG))* '\"'
HEXDIG              ::= [a-fA-F0-9]

/* IDS */

id                  ::= idSimple | idExtended | iri
idSimple		    ::= [_a-zA-Z][a-zA-Z0-9_-]*
idExtended          ::= #x60 #x60 ([^#x60#x5C#xA#xD])* #x60 #x60
iri                 ::= \"<\" ([a-z] | [A-Z] | [0-9] | \"!\" | [#x23-#x2F] | \":\" | \";\" | \"=\" | \"?\" | \"@\" | \"[\" | \"]\" | \"_\" | \"|\" | \"~\")* \">\"



";
export default _default;
