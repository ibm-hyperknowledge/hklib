const nearley = require("nearley");
const moo = require("moo");

const lexer = moo.compile({
    QUOTED_STRING: /"(?:(?:""|[^"])*)"/,
    UNQUOTED_IDENTIFIER: /[^"#@<>?&=\s]+/,
    ALL_THE_REST: /.+/
});

function checkAtom(atom) {
    lexer.reset(atom)
    let good = true;
    r1 = lexer.next();
    r2 = lexer.next();
    lexer.reset('');

    return (r1.type == 'QUOTED_STRING' || r1.type == 'UNQUOTED_IDENTIFIER') && r2 == undefined;
}

class IFI {

    /**
     * Create a new IFI object.
     * 
     * @param {string|IFI} artifact string with atomic IFI or IFI 
     * @param {string|Anchor} anchor string or or Anchor representing anchor
     * @param {boolean} grouped True if this IFI is to be grouped (i.e. has diamonds around it)
     */
    constructor(artifact, anchor = '', grouped = false) {
        if (typeof artifact == 'string') {
            if (!checkAtom(artifact)) {
                let parsedArg = IFI.parseIFI(artifact);
                if (anchor == '') {
                    artifact = parsedArg.artifact;
                    anchor = parsedArg.anchor;
                } else {
                    artifact = parsedArg;
                }
            }
        }
        if (typeof anchor == 'string'  && anchor != '') {
            anchor = new Anchor(anchor);
        }
        this.artifact = artifact;
        this.anchor = anchor;
        this.grouped = grouped;
    }

    isGrouped() {
        return this.grouped;
    }

    hasAnchor(){
        return this.anchor != '';
    }

    toString() {
        let strIFI = this.artifact.toString()
        strIFI = (this.isGrouped()) ? `<${this.artifact}>` : strIFI;
        strIFI = (this.anchor) ? `${strIFI}#${this.anchor}` : strIFI;
        return strIFI
    }

    /**
     * Create an IFI object from an string containing an IFI.
     * 
     * @param {string} strIFI string object containing an IFI to be parsed.
     * 
     */
    static parseIFI(strIFI) {
        const grammar = require("./ifi-grammar.js");
        const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));

        let l = parser.feed(strIFI);
        if (l.results.length > 1){
            // this should not happen if grammar is correct
            throw new Exception(`The string IFI "${strIFI}" is ambiguous.`);
        }
        return l.results[0]; //assume one result
    }

}

class Anchor {

    /** 
     * Create a new Anchor instance based on an IFI (or string representing an UFI) and a 
     * ordered collection of arguments.
     * 
     * @param {string|IFI} IFI or string representing ifi.
     * @param {Map} args Map with anchor tuple token arguments. Assumed to be ordered by key.
     */
    constructor(indexer, args = new Map()) {
        if (typeof (indexer) == 'string') {
            indexer = IFI(indexer);
        }
        this.indexer = indexer;
        this.arguments = args;
    }

    toString() {
        let strAnchor = this.indexer.toString();

        if (this.arguments.size > 0) {
            let args = [];
            for (let [param, value] of this.arguments) {
                //assuming Map iterates using insertion order (as stated in documentation)
                args.push(`${param}=${value}`);
            }
            let strArguments = args.join('&');
            strAnchor = `${strAnchor}?${strArguments}`;
        }
        return strAnchor;
    }

}

module.exports = {
    IFI,
    Anchor
};

