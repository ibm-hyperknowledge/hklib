"use strict";
/*
 * Copyright (c) 2016-present, IBM Research
 * Licensed under The MIT License [see LICENSE for details]
 */
const FIOperator = require("./fioperator");
//const PARSER = new EBNF.Grammars.W3C.Parser(grammar);
class FIAnchor {
    /**
     * Create a new Anchor instance based on an FI (or string representing an FI) and a
     * ordered collection of arguments.
     *
     * @param {string|FI} FI or string representing fi.
     * @param {any|object} token Anything parseable as an fi or tuple token map. If argument list, use Map ordered  by key.
     * @param {string} operator set operator (i.e. descriptor). Default is null.
     */
    constructor(indexer, token, operator = FIOperator.NONE) {
        const FI = require("./fi");
        if (!(indexer instanceof FI)) {
            indexer = new FI(indexer);
        }
        this.indexer = indexer;
        this.token = token;
        this.operator = operator;
    }
    toString() {
        let strAnchor = '';
        strAnchor = strAnchor + this.indexer.toString();
        strAnchor = strAnchor + ((this.operator !== undefined && this.operator !== null) ? this.operator.toString() : '');
        if (this.token) {
            const FI = require("./fi");
            if (this.token instanceof FI) {
                strAnchor = `${strAnchor}(${this.token.toString()})`;
            }
            else if (this.token instanceof Object && Object.keys(this.token).length > 0) {
                let args = [];
                for (let param in this.token) {
                    let value = this.token[param];
                    if (typeof value === 'string') {
                        value = '"' + value + '"';
                    }
                    //assuming Map iterates using insertion order (as stated in documentation)
                    args.push(`${param}: ${value}`);
                }
                let strArguments = args.join(',');
                strAnchor = `${strAnchor}({${strArguments}})`;
            }
            else {
                strAnchor = `${strAnchor}(${this.token.toString()})`;
            }
        }
        return strAnchor;
    }
}
module.exports = FIAnchor;
