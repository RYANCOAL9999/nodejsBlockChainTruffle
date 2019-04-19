'use strict';

let _MongoConnectionHelper = require(base_path+'/connection/mongoConnectionHelper.js');

class modelMongo
{
    /**
     * init with mongo connection
     * @param {String} ipAddress ip address 
     * @param {Number} port port
     */
    constructor(ipAddress, port)
    {
        // this.mongoConnectionHelper = new _MongoConnectionHelper('192.168.1.79', 27017);
        this.mongoConnectionHelper = new _MongoConnectionHelper(ipAddress, port);
        this.db = this.mongoConnectionHelper.dbAdapter;
    }

    /**
     * @returns redisClient is connected
     */
    get MongoIsConnected()
    {
        return this.mongoConnectionHelper.mongoIsConnected;
    }

    /**
     * find the data for the query
     * @param {object} query  query
     * @param {object} model  moogoose model
     */
    search(query, model)
    {
        var answer = undefined;
        return new Promise((resolve)=>{
            model.find(query, (err, result)=>{
                if(!err)
                {
                    result = JSON.parse(JSON.stringify(result));
                    result.forEach((value)=>{
                        delete value["__v"];
                        delete value["_id"];
                    })
                    if(result.length == 1)
                    {
                        answer = result[0];
                    }
                    else
                    {
                        answer = result;
                    }
                }
                resolve(answer);
            })
        })
    }

    /**
     * save the object with moogoose model
     * @param {Object} object moogoose model
     */
    insert(object)                                         //object is need with Schema and DBFactory                      
    {
        if(object){
            object.save((err)=>{					//object need var newInformation = new information()
                if(err)
                {
                    console.log(`error : ${err}`);
                }
            })
        }
    }

    /**
     * remove key of the object
     * @param {String} key 
     * @param {String} value 
     */
    remove(key, value)
    {
        var result = {};
	    if(key && value){
		    result[key] = value;
	    }
	    if(!result){
            console.logh(`empty input`);
            return;
        }
        this.db.remove(result, (err)=>{
            if(err)
            {
                console.log(`error : ${err}`);
            }
        })
    }

    /**
     * update the data
     * @param {object} query  query
     * @param {object} data   data need to update
     * @param {object} model  moogoose model
     */
    update(query, data, model)
    {
        if(query && data && model)
        {
            model.updateMany(query, data, (err)=>{
                if(err)
                {
                    console.log(`error : ${err}`);
                }
            })
        }
    }
}

module.exports = modelMongo;
