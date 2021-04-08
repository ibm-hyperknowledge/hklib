const nearley = require("nearley");
const moo = require("moo");

const lexer = moo.compile(
{
    QUOTED_STRING: /"(?:(?:""|[^"])*)"/,
    UNQUOTED_IDENTIFIER: /[^"#\*<>?&=\s]+/,
    ALL_THE_REST: /.+/
});

const IFIOperator = 
{
    FRAGMENTATION: "#",
    DESCRIPTION: "*",
}

const Anchor = require("./anchor");

class IFI 
{

    /**
     * Create a new IFI object.
     * 
     * @param {string|IFI} artifact string with atomic IFI or IFI 
     * @param {string|Anchor} anchor string or or Anchor representing anchor
     * @param {boolean} grouped True if this IFI is to be grouped (i.e. has diamonds around it)
     */
    constructor(artifact, anchor = '', grouped = false) 
    {
        if (typeof artifact == 'string') 
        {
            if (!checkAtom(artifact)) 
            {
                let parsedArg = IFI.parseIFI(artifact);
                if (anchor == '') 
                {
                    artifact = parsedArg.artifact;
                    anchor = parsedArg.anchor;
                } 
                else 
                {
                    artifact = parsedArg;
                }
            }
        }
        if (typeof anchor == 'string' && anchor != '') 
        {
            anchor = new Anchor(anchor);
        }
        this.artifact = artifact;
        this.anchor = anchor;
        this.grouped = grouped;
    }

    isGrouped() 
    {
        return this.grouped;
    }

    hasAnchor() 
    {
        return this.anchor != '';
    }

    toString() 
    {
        let strIFI = this.artifact.toString()
        strIFI = (this.isGrouped()) ? `<${this.artifact}>` : strIFI;
        strIFI = (this.anchor) ? `${strIFI}${this.anchor}` : strIFI;
        return strIFI
    }

    /**
     * Create an IFI object from an string containing an IFI.
     * 
     * @param {string} strIFI string object containing an IFI to be parsed.
     * 
     */
    static parseIFI(strIFI) 
    {
        const grammar = require("./ifi-grammar.js");
        const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));

        let l = parser.feed(strIFI);
        if (l.results.length > 1) 
        {
            // this should not happen if grammar is correct
            throw new Error(`The string IFI "${strIFI}" is ambiguous.`);
        }
        let tree = l.results[0]; //assume one result

        let result = postProcessTree(tree);
        return result
    }

}


function checkAtom(atom) 
{
    lexer.reset(atom)
    r1 = lexer.next();
    r2 = lexer.next();
    lexer.reset('');

    return (r1.type == 'QUOTED_STRING' || r1.type == 'UNQUOTED_IDENTIFIER') && r2 == undefined;
}

//Try to emulate lark idiom for parsing

function postProcessTree(tree) 
{
    return processIfi(tree);
}

function processIfi(d) 
{
    // console.log('- Processing IFI:');
    // console.log(d);
    if (d.type === 'group') 
    {
        return new IFI(processIfi(d.artifact), undefined, true);
    } else if (d.type === 'atom')
     {
        return new IFI(d.value);
    } else if (d.type === 'ifi') 
    {
        let artifact = processIfi(d.artifact);
        let anchor = processAnchor(d.anchor);

        return new IFI(artifact, anchor);
    }
}



function processAnchor(d) 
{
    if (d.type === 'anchor') 
    {
        let indexer = processIfi(d.indexer);

        //unstack arguments
        let token = d.token;
        let oper = d.oper;

        if (token) 
        {
            if (token.type && (token.type == 'group' || token.type == 'atom')) 
            {
                token = processIfi(token);
            } 
            else if (token instanceof Map) 
            {
                for (let [key, value] of token)
                {
                    if (value.type && value.type == 'group') 
                    {
                        //value is an group ifi, which is allowed
                        value = processIfi(value);
                        token.set(key, value);
                    }
                }
            }
        }

        return new Anchor(indexer, token, oper);
    } 
    else if (d.type === 'atom') 
    {
        //canonical anchor
        let ifi = processIfi(d);
        return new Anchor(ifi);
    }
}


module.exports = IFI;
module.exports.IFIOperator = IFIOperator;
module.exports.Anchor = Anchor;

