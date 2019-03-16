'use strict';
let _RedisConnectionHelper = require(base_path+'/Connection/redisConnectHelper.js');
let _Setting               = require(base_path+'/enum/setting');

class modelRedis
{
    /**
     * 
     * @param {*} ipAddrss 
     * @param {*} port 
     */
    constructor(ipAddrss, port)
    {
        this.RedisConnectionHelper = new _RedisConnectionHelper({host: ipAddrss, port: port});
        this.workingClient = this.RedisConnectionHelper.workClient;
        this.pubClient = this.RedisConnectionHelper.publishClient;
        this.subClient = this.RedisConnectionHelper.subscriberClient;
        this.imSub = this.RedisConnectionHelper.imSubscriber;
        this.redisMQ = this.RedisConnectionHelper.rsmq; 
        this.print = this.RedisConnectionHelper.printClient;
    }

    /**
     * 
     * @param {*} key 
     * @param {*} callback 
     */
    getData(key, callback)
    {
        callback = _.callback(Null);
        this.workingClient.get(key, (err, reply)=>
        {
            if(err)
            {
                console.log(`get data for Redis error with ${key}`);
                callback(undefined);
            }
            else
            {
                callback(reply);
            }
        });
    }

    /**
     * 
     * @param {*} key 
     * @param {*} data 
     * @param {*} callback 
     */
    saveData(key, data, callback)
    {
        callback = _.callback(Null);
        if(key){
            data = typeof(data) == 'string' ? data : JSON.stringify(data);
            this.workingClient.set(key, data, callback);
        }
    }

    /**
     * 
     * @param {*} key 
     * @param {*} callback 
     */
    deleteData(key, callback)
    {
        if(key){
            this.workingClient.del(key, callback);
        }
    }

    /**
     * 
     * @param {*} key 
     * @param {*} field 
     * @param {*} data 
     * @param {*} callback 
     */
    saveDataWithH(key, field, data, callback)
    {
        if(key && !(field))
        {
            data = typeof(data) == 'string' ? data : JSON.stringify(data);
            this.workingClient.hset(key, field, data, callback);
        }
    }

    /**
     * 
     * @param {*} key 
     * @param {*} field 
     * @param {*} callback 
     */
    getDataWithH(key, field, callback)
    {
        this.workingClient.hget(key, field, (err, reply)=>
        {
            if(err)
            {
                console.log(`get data for Redis error with ${key}`);
                callback(undefined);
            }
            else
            {
                callback(reply);
            }
        });
    }

    /**
     * 
     * @param {*} key 
     * @param {*} data 
     * @param {*} callback 
     */
    saveDataWithHM(key, data, callback)
    {
        if(key && data)
        {
            this.workingClient.hmset(key, data, callback);
        }
    }

    /**
     * 
     * @param {*} key 
     * @param {*} callback 
     */
    deleteDataWithHM(key, callback)
    {
        if(key)
        {
            this.workingClient.hdel(key, callback);
        }
    }

    /**
     * 
     * @param {*} key 
     * @param {*} callback 
     */
    hasValuesWithHM(key, callback)
    {
        this.workingClient.hvals(key, (err, reply)=>
        {
            if(err)
            {
                console.log(`get data for Redis error with ${key}`);
                callback(undefined);
            }
            else
            {
                callback(reply);
            }
        });
    }

    /**
     * 
     * @param {*} queueName 
     * @param {*} size 
     * @param {*} callback 
     */
    createMessageQueue(queueName, size, callback) {
        console.log(`Createing queue ${queueName}`);
        this.redisMQ.createQueue({ qname: queueName, maxsize: size }, function(err, resp) {
            if (err) {
                // console.log(err.message);
                if (callback) {
                    callback(false);
                }
            } else {
                if (resp === 1) {
                    console.log(`Queue created`);
                    if (callback) {
                        callback(true);
                    }
                } else {
                    console.log(`Cannot Create? `, resp);
                    if (callback) {
                        callback(false);
                    }
                }
            }
        });
    }

    /**
     * 
     * @param {*} queueName 
     * @param {*} msg 
     * @param {*} callback 
     */
    sendMessageToQueue(queueName, msg, callback) {
        this.redisMQ.sendMessage({ qname: queueName, message: msg }, function(err, resp) {
            if (err) {
                console.log(err.message);
            }
            if (resp) {
                console.log(`Message ID ${resp} Sent to queue: ${queueName}`);
                callback();
            }
        });
    }

    /**
     * 
     * @param {*} queueName 
     * @param {*} callback 
     */
    receiveMessageFromQueue(queueName, callback) {
        this.redisMQ.receiveMessage({ qname: queueName }, function(err, resp) {
            if (err) {
                console.log(`Receive Message Error: ${err}`);
                callback(queueName, resp);
                return;
            }
            if (resp.id) {
                console.log(`MessageQueue: ${queueName} MessageID: ${resp.id}`);
            } else {
                console.log(`No messages in MessageQueue: ${queueName}`);
            }
            callback(queueName, resp);
        });
    }

    /**
     * 
     * @param {*} queueName 
     * @param {*} messageId 
     * @param {*} callback 
     */
    deleteMessageFromQueue(queueName, messageId, callback) {
        this.redisMQ.deleteMessage({ qname: queueName, id: messageId }, function(err, resp) {
            callback();
        });
    }

    /**
     * 
     * @param {*} queueName 
     * @param {*} callback 
     */
    popMessageFromQueue(queueName, callback) {
        var self = this;
        this.redisMQ.popMessage({ qname: queueName }, function(err, resp) {
            if (err) {
                return;
            }
            console.log(`Poped Message ${resp} from Queue ${queueName}`);
            callback(queueName, resp);
        });
    }

    /**
     * 
     * @param {*} queueName 
     * @param {*} callback 
     */
    getAttributesFromQueue(queueName, callback) {
        this.redisMQ.getQueueAttributes({ qname: queueName }, function(err, resp) {
            if (err) {
                return;
            }
            callback(resp);
        });
    }

    /**
     * 
     * @param {*} queueName 
     * @param {*} callback 
     */
    deleteMessageQueue(queueName, callback)
    {
        this.redisMQ.deleteQueue({qname: queueName}, function(err, resp){
            if (callback)
            {
                callback(resp);
            }
        });
    }

    /**
	 * decr with redis api
	 * @param {String} key 		   identify key
	 * @param {Function} callback  back to which functions call this functions  
	 */
	decrKey(key, callback)
	{
		this.workingClient.decr(key, (err, reply)=>{
			var size = 0;
			if(!err)
			{
				size = reply;
			}
			if(callback)
			{
				callback(size);
			}
		});
	}

	/**
	 * incr with redis api
	 * @param {String} key 		   identify key
	 * @param {Function} callback  back to which functions call this functions  
	 */
	incrKey(key, callback)
	{
		this.workingClient.incr(key, (err, reply)=>{
			var size = 0;
			if(!err)
			{
				size = reply;
			}
			if(callback)
			{
				callback(size);
			}
		});
	} 

    /**
	 * incr Target Socket Size for redis
	 * @param {String} key 			identify key
	 * @param {Function} callback  	back to which functions call this functions  
	 */
	incrCid(key, callback)
	{
		this.incrKey(key, callback);
	}

	/**
	 * get Cid size for redis
	 * @param {String} key 			identify key
	 * @param {Function} callback  	back to which functions call this functions  
	 */
	getCidSize(key, callback)
	{
		this.getData(key, callback);
	}

	/**
	 * using publish to event to other subscribe cluster
	 * @param {String} channel 		channel name
	 * @param {Any} data 			data need to be send
	 * @param {Function} callback 	back to which functions call this functions  
	 */
	publishEvent(channel, data, callback)
    {
		if(channel && data){
			data = typeof(data) === 'string' ? data : JSON.stringify(data);
			this.pubClient.publish(channel, data, ()=>{
				if(callback){
					callback();
				}
			})
		}
    }
    
    /**
	 * send Message with internal channel
	 * @param {Object} msg        message of data need to send
	 * @param {Function} callback   back to which functions call this functions 
	 */
	sendInternalMessageToQueue(msg, callback) {
		/**
		 * sendMessage to with INTERNA_MESSAGE_QUEUE channel
		 * after callback and publishEvent with same time
		 */
		var queueName = setting.INTERNA_MESSAGE_QUEUE;
		this.redisMQ.sendMessage({ qname: queueName, message: msg }, (err, resp)=>{
			if (err) {
				console.log(`send Message Error: ${err} with queueName ${queueName}`);
			}
			if (resp) {
				// _.log(`Message ID ${resp} Sent to queue: ${queueName}`);
				if(callback){
					callback();
				}
				var data = {};
				data['sendTime'] = Math.floor((Math.random() * _Setting.CID_RANDOM_NUM) + 1);
				data['msg'] = msg;
				this.publishEvent(setting.INTERNA_MESSAGE_QUEUE, data, ()=>{});
			}
		});
	}

    
    



}

module.exports = modelRedis;