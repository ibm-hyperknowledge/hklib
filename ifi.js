const nearley = require("nearley");
const grammar = require("./ifi-grammar.js");

class IFI {

    constructor(artifact, fragment = undefined, grouped = false) {
        this.artifact = artifact;
        this.fragment = fragment;
        this.grouped = grouped;
    }

    toString() {
        let strIFI = this.artifact.toString()
        strIFI = (this.fragment) ? `${strIFI}#${this.fragment}` : strIFI;
        strIFI = (this.grouped) ? `(${this.artifact})` : strIFI;
        return strIFI
    }

    /**
     * Create an IFI object from an string containing an IFI.
     * 
     * @param {string} strIFI string object containing an IFI to be parsed.
     * 
     */
    static parseIFI(strIFI) {
        const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));

        let l = parser.feed(strIFI);
        return l.results;
    }

}

class Anchor {

    constructor(indexer, args = new Map()) {
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

