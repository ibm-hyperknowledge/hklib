/*
 * Copyright (c) 2016-present, IBM Research
 * Licensed under The MIT License [see LICENSE for details]
 */

const grammar = require('./grammar.js');
const FIOperator = require('./fioperator.js')
const FIAnchor = require("./fianchor");
const EBNF = require("ebnf");

const PARSER = new EBNF.Grammars.W3C.Parser(grammar);

/**
 * Fragment Identifier (FI.js)
 */
class FI
{

    /**
     * Create a new FI object.
     * 
     * @param {string|FI} artifact string with atomic FIjs or Fijs 
     * @param {string|FIAnchor} anchor string or FIAnchor representing anchor
     */
    constructor(artifact, anchor = undefined)
    {
        let _artifact = artifact;
        let _anchor = anchor;
        let _extendedArtifact = false;
        if (typeof artifact == 'string') 
        {
            //check if an artifact id
            let id = parseId(artifact);
            if (!id) 
            {
                //if not, then it might be a full FI to be parsed
                let parsedArg = FI.parseFI(artifact);
                if (anchor === undefined) 
                {
                    _artifact = parsedArg.artifact;
                    _anchor = parsedArg.anchor;
                }
            } else {
                _artifact = id;
            }
        } else if (artifact instanceof FI)
        {
            //if artifact has no anchor, add anchor in a new FI
            if (!artifact.hasAnchor())
            {
                _artifact = artifact._artifact;
            }
        }
        if (anchor)
        {
            if (typeof anchor === 'string') 
            {
                _anchor = new FIAnchor(anchor);
            }
        }

        this._artifact = _artifact;
        this.anchor = _anchor;
    }

    get artifact()
    {
        //never return string;
        if (this._artifact instanceof HKID)
        {
            return new FI(this._artifact);
        } else
        {
            return this._artifact;
        }
    }


    hasAnchor()
    {
        return this.anchor !== undefined;
    }


    /**
     * Get base artifact of this FI, walking FI.artifact recursively to the base.
     */
    getBaseArtifact(){
        if (this._artifact instanceof HKID){
            return this.artifact;
        } else {
            return this.artifact.getBaseArtifact();
        }
    }

    /**
     * Returns string representation of all anchors from getBaseArtifact()
     */
    toStringTail(){
        if (this._artifact instanceof HKID){
            return (this.anchor) ? this.anchor.toString() : '';
        } else {
            let next = this._artifact.toStringTail()
            if (next !== ''){
                next = next + '.';
            }
            return next + this.anchor.toString();
        }
    }


    toString()
    {
        let strFI = (this._artifact instanceof HKID) ? this._artifact.toStringDecorated() : this._artifact.toString();
        strFI = (this.anchor) ? `${strFI}.${this.anchor.toString()}` : strFI;
        return strFI
    }

    /**
     * Create an FI object from an string containing an FI.
     * 
     * @param {string} strFI string object containing an FI to be parsed.
     * 
     */
    static parseFI(strFI)
    {

        let ast = PARSER.getAST(strFI);

        if (ast.errors.length > 0) 
        {
            throw new Error(`Error parsing "${strFI}": ${ast.errors} `);
        }

        let result = postProcessTree(ast);
        return result
    }

}



function parseId(text)
{
    //checks wheter text is just a simple id
    let target;
    let ast = PARSER.getAST(text, target = 'id');
    if (ast.type !== 'id' || ast.errors.length !== 0)
    {
        return undefined;
    }
    let id;
    try {
        let id = processId(ast);
    } finally {
        return id;
    }
}



class HKID
{

    constructor(id)
    {
        if (typeof id !== 'string')
        {
            throw Error('Parameter id must be a string');
        }
        this._id = id;
    }

    toString()
    {
        return this._id;
    }

    toStringDecorated()
    {
        throw 'Abstract method';
    }
}

class BasicHKID extends HKID
{

    constructor(id)
    {
        let target;
        let ast = PARSER.getAST(id, target = 'idSimple');

        if (ast.type !== 'idSimple' || ast.errors.length !== 0)
        {
            throw Error('Parameter id not a valid BasicHKID');
        }
        super(id);
    }

    toStringDecorated()
    {
        return super.toString();
    }

}

class ExtendedHKID extends HKID
{

    constructor(id)
    {
        let target;
        let ast = PARSER.getAST(`\`\`${id}\`\``, target = 'idExtended');

        if (ast.type !== 'idExtended' || ast.errors.length !== 0)
        {
            throw Error('Parameter id not a valid ExtendedHKID');
        }
        super(id);
    }

    toStringDecorated()
    {
        return `\`\`${super.toString()}\`\``;
    }

}

class IriHKID extends HKID
{

    constructor(id)
    {
        let target;
        let ast = PARSER.getAST(`<${id}>`, target = 'iri');

        if (ast.type !== 'iri' || ast.errors.length !== 0)
        {
            throw Error('Parameter id not a valid IriHKID');
        }
        super(id);
    }

    toStringDecorated()
    {
        return `<${super.toString()}>`;
    }
}


//Try to emulate lark idiom for parsing

function postProcessTree(ast)
{
    return processFijs(ast);
}

function processFijs(ast)
{

    if (ast.children.length === 1)
    {
        let artifact = processId(ast.children[0]);
        return new FI(artifact);
    } else if (ast.children.length >= 2)
    {
        let firstArtifact = processId(ast.children[0]);
        let anchor = processAnchor(ast.children[1]);

        let lastFI = new FI(firstArtifact, anchor)
        for (let i = 2; i < ast.children.length; i++)
        { //start on the 2nd anchor, if any
            anchor = processAnchor(ast.children[i]);
            lastFI = new FI(lastFI, anchor);
        }

        return lastFI;
    } else
    {
        throw Error(`Error parsing ${ast.text}`)
    }

}


function processAnchor(ast)
{

    if (ast.children.length == 1)
    {
        let indexer = processIndexer(ast.children[0]);
        return new FIAnchor(indexer);
    } else if (ast.children.length == 2)
    {
        let indexer = processIndexer(ast.children[0]);
        if (ast.children[1].type === 'operator')
        {
            return new FIAnchor(indexer, null, FIOperator.DESCRIPTION);
        } else
        {
            let token = processToken(ast.children[1]);
            return new FIAnchor(indexer, token);
        }
    } else if (ast.children.length == 3)
    {
        let indexer = processIndexer(ast.children[0]);
        let token = processToken(ast.children[2]);
        return new FIAnchor(indexer, token, FIOperator.DESCRIPTION);
    } else
    {
        throw Error(`Error parsing ${ast.text}`);
    }

}

function processToken(ast)
{
    return processJsonPlus(ast.children[0])
}

function processJsonPlus(ast)
{
    ast = ast.children[0];
    switch (ast.type)
    {
        case 'fijs': return processFijs(ast);
        case 'false': return false;
        case 'null': return null;
        case 'true': return true;
        case 'object': return processObject(ast);
        case 'array': return processArray(ast);
        case 'number': return JSON.parse(ast.text);
        case 'string': return ast.text.substring(1, ast.text.length - 1); //return JSON.parse(ast.text);
    }
}

function processObject(ast)
{
    let object = {};
    if (ast.children.length > 0)
    {
        let members = ast.children;
        for (let member of members)
        {
            let pair = processMember(member);
            object[pair[0]] = pair[1];
        }
    }
    return object;
}

function processMember(ast)
{
    let key;
    if (ast.children[0].type === 'string')
    {
        key = ast.children[0].text.substring(1, ast.children[0].text.length - 1);
    } else if (ast.children[0].type === 'id')
    {
        key = processId(ast.children[0]);
    } else 
    {
        throw Error(`Error processing: ${ast.children[0].text}`);
    }

    let value = processJsonPlus(ast.children[1]);
    return [key, value];
}

function processIndexer(ast)
{
    return processId(ast.children[0]);
}

function processId(ast)
{
    ast = ast.children[0];
    if (ast.type === 'idSimple')
    {
        return new BasicHKID(ast.text);
    } else if (ast.type === 'idExtended')
    {
        return new ExtendedHKID(ast.text.substring(2, ast.text.length - 2));
    } else if (ast.type === 'iri')
    {
        return new IriHKID(ast.text.substring(1, ast.text.length - 1));
    } else
    {
        throw Error(`Error parsing ${ast.text}`);
    }
}


module.exports = FI;