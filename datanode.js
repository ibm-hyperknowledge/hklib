const { MIMETYPE } = require("./constants");
const Node = require("./node");

class HKDataNode extends Node{

    /**
     * This is a helper strucure to intantiate content nodes with non-symbolic
     *  data. It takes a mimeType and a data object, which might be an url or 
     * a Buffer object
     * 
     * @param {*} id 
     * @param {*} parent 
     * @param {*} mimeType 
     * @param {*} data 
     */
   constructor(id, parent, data, mimeType = 'application/octet-stream'){
       super(id, parent)
       super.properties[MIMETYPE] = mimeType;
       this.data = data;
   }

}