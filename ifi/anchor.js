
const IFI = require("./ifi");

class Anchor 
{

    /** 
     * Create a new Anchor instance based on an IFI (or string representing an UFI) and a 
     * ordered collection of arguments.
     * 
     * @param {string|IFI} IFI or string representing ifi.
     * @param {any|Map} token Anything parseable as an ifi or tuple token map. If argument list, use Map ordered  by key. 
     * @param {boolean} meta set this a description anchor. Default is false.
     */
    constructor(indexer, token, operator = operators.FRAGMENTATION) 
    {
        if (typeof (indexer) == 'string') 
        {
            indexer = IFI(indexer);
        }
        this.indexer = indexer;
        this.token = token;
        this.operator = operator;
    }

    toString() 
    {

        let strAnchor = this.operator;
        strAnchor = strAnchor + this.indexer.toString();
        if (this.token) 
        {
            if (this.token instanceof Map && this.token.size > 0) 
            {
                let args = [];
                for (let [param, value] of this.token) {
                    //assuming Map iterates using insertion order (as stated in documentation)
                    args.push(`${param}=${value}`);
                }
                let strArguments = args.join('&');
                strAnchor = `${strAnchor}?${strArguments}`;
            } 
            else 
            {
                strAnchor = `${strAnchor}?${this.token.toString()}`;
            }
        }
        return strAnchor;
    }

}

module.exports = Anchor;