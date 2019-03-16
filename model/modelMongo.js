'use strict';

let _MongoConnectionHelper = require(base_path+'/Connection/mongoConnectionHelper.js');

class modelMongo
{
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

    search(query)
    {
        var answer = undefined;
        return new Promise((resolve)=>{
            this.db.find(query, (err, result)=>
            {
                if(!err)
                {
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

    update(key, value)
    {
        var result = {};
	    if(key && value){
		    result['$set'] = value;
	    }
	    if(!result){
            console.logh(`empty input`);
            return;
        }
        this.db.update(key, result, (err)=>{
            if(err)
            {
                console.log(`error : ${err}`);
            }
        })
    }
}

module.exports = modelMongo;