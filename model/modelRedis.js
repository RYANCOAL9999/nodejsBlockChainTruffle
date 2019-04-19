'use strict';
let _RedisConnectionHelper = require(base_path+'/connection/redisConnectHelper.js');
let _Setting               = require(base_path+'/enum/setting');

class modelRedis
{
    /**
     * init with redis connection
     * @param {String} ipAddress ip address 
     * @param {Number} port port
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
     * redis get
     * @param {String} key key of set
     */
    getData(key)
    {
        var answer = undefined;
        return new Promise((resolve)=>{
            this.workingClient.get(key, (err, reply)=>{
                if(!err)
                {
                    answer = reply;
                }
                resolve(answer);
            })          
        })
    }

    /**
     * redis set
     * @param {String} key  key of set
     * @param {object} data value of set
     */
    saveData(key, data)
    {
        var answer = undefined;
        return new Promise((resolve)=>{
            this.workingClient.set(key, data, (err, reply)=>{
                if(!err)
                {
                    answer = reply;
                }
                resolve(answer);
            })          
        })
    }

    /**
     * redis del
     * @param {String} key       key of set
     */
    deleteData(key, callback)
    {
        if(key){
            this.workingClient.del(key, callback);
        }
    }

    /**
     * redis Hset
     * @param {string} key     key of hset
     * @param {string} field   field of hset
     * @param {object} data    data of hset
     */
    saveDataWithH(key, field, data)
    {
        var answer = undefined;
        data = typeof(data) == 'string' ? data : JSON.stringify(data);
        return new Promise((resolve)=>{
            this.workingClient.hset(key, field, data, (err, reply)=>{
                if(!err)
                {
                    answer = reply;
                }
                resolve(answer);
            })
        })
    }

    /**
     * redis Hget
     * @param {string} key     key of hset
     * @param {string} field   field of hset
     */
    getDataWithH(key, field)
    {
        var answer = undefined;
        return new Promise((resolve)=>{
            this.workingClient.hget(key, field, (err, reply)=>{
                if(!err)
                {
                    answer = reply;
                }
                resolve(answer);
            })
        })
    }

    /**
     * redis hmset
     * @param {string} key     key of hset
     * @param {object} data    data of hset
     */
    saveDataWithHM(key, data)
    {
        var answer = undefined;
        return new Promise((resolve)=>{
            this.workingClient.hmset(key, data, (err, reply)=>{
                if(!err)
                {
                    answer = reply;
                }
                resolve(answer);
            })
        })
    }

    /**
     * redis hmdel
     * @param {string} key key of hset
     * @param {Function} callback callback 
     */
    deleteDataWithHM(key, callback)
    {
        if(key)
        {
            this.workingClient.hdel(key, callback);
        }
    }

    /**
     * redis hgetall
     * @param {String} key key of hset 
     */
    hasValuesWithHM(key)
    {
        var answer = undefined;
        return new Promise((resolve)=>{
            this.workingClient.hgetall(key, (err, reply)=>{
                if(!err)
                {
                    answer = reply;
                }
                resolve(answer);
            })
        })
    }

    /**
     * redis create message queue
     * @param {String} queueName queueName
     * @param {Number} size       queue sizes
     * @param {Function} callback callback 
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
     * redis send message queue
     * @param {String} queueName  queueName
     * @param {String} msg        messages
     * @param {Function} callback callback 
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
     * redis receive messages
     * @param {String} queueName  queueName
     * @param {Function} callback callback 
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
     * redis delete messages
     * @param {String} queueName  queueName
     * @param {Number} messageId  message ID of redis with queue
     * @param {Function} callback callback 
     */
    deleteMessageFromQueue(queueName, messageId, callback) {
        this.redisMQ.deleteMessage({ qname: queueName, id: messageId }, function(err, resp) {
            callback();
        });
    }

    /**
     * redis delete messages with last one
     * @param {String} queueName  queueName
     * @param {Function} callback callback 
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
     * get query attributes
     * @param {String} queueName  queueName
     * @param {Function} callback callback 
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
     * delete message query
     * @param {String} queueName  queueName
     * @param {Function} callback callback 
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
     * redis incr key with getUniqueNumber
     * @param {string} key incr key 
     * @param {Boolean} isGetData to know is get data 
     */
    incrSN(key, isGetData)
    {
        return new Promise( async(resolve)=>{
            var answer = isGetData ? await this.getData(key): null;
            var data = {};
            if(!answer)
            {
                this.incrKey(key, (reply)=>{
                    if(reply)
                    {
                        answer = reply;
                    }
                    data[key] = Number(answer);
                    resolve(data);
                })
            }
            else
            {
                data[key] = Number(answer);
                resolve(data);
            }
        })
    }
    
    /**
     * reset key crKey.
     * @param {String} key 
     */
    resetCrKey(key)
    {
        this.saveData(key, 1);
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
