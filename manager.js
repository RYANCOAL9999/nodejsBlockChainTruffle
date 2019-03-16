'use strict';
let _EventEmitter        = require('events').EventEmitter;
let _Setting             = require(base_path+'/enum/setting');

class manager extends _EventEmitter
{
    /**
     * 
     * @param {*} redis 
     */
    constructor(redis)
    {
        super();
        this.redis = redis;
        // this.initCid();
        this.subscribeCid();
		this.initIMQueue();
    }

    /*
	 * After sending the message to queue
	 * This manager shall be subscribing to the publish event from the message queue {rsmq.ns}:rt:{qname} eg. rsmq:rt:testQueue 6
	 * Every cluster will receive this event.
	 * We pop the message. In theory only 1 cluster will be able to receive the message
	 * Lets try
	 * 
	 * 
	 */
	initIMQueue() {
        //We need to create queue first before we can send/get messages
        var internalMessageQueue = _Setting.INTERNA_MESSAGE_QUEUE;
        this.redis.createMessageQueue(_Setting.INTERNA_MESSAGE_QUEUE, -1, null);
        this.redis.imSub.subscribe(internalMessageQueue);
        this.redis.imSub.on('message', (channel, message) => {
            // _.log("Process '" + process.pid + " received " + message);

            /**
             * convert message with JSON format.
             * get Cid Size on redis
             * after pop message with correct cid on cluster
             * cluster save Counter on redis 
             */
        
            message = JSON.parse(message);
            var processCounter = message['sendTime'];
            // _.log(`processCounter : ${processCounter}`);
            this.getCidSize((cidLength)=>{
                this.popMessage(cidLength, processCounter, internalMessageQueue, (packet)=>{
                    this.handleInternalMessage(packet);
                });
            })
        });
    }

    /**
     * 
     * @param {*} packet 
     */
    handleInternalMessage(packet) {
        
        // let controllerName  = packet.topic;
        // let command         = packet.type;
        // let data            = packet.data;
        
        // _.log("handleInternalMessage: " + controllerName + "_" + command);
        
        // let controller = this.getController(controllerName);

        // if (!utils.checkUndefined(controller)) {
        //     controller.handleInternalCommand(command, data);
        // }
        
    }

    /**
     * subscribe channel with Cid and message event handle.
     */
    subscribeCid()
    {
        /**
         * subscrible CID_CHANNEL
         * received message with SystemSub
         * if message is delete
         * call updateCid to re-init this cluster 's cid 
         */
        this.redis.subClient.subscribe(_Setting.CID_CHANNEL);	 		//listening event from internal messages
        this.redis.subClient.on('message', (channel, message)=>{
            console.log("Message '" + message + "' on channel '" + channel + "' arrived!");
            var msgObj = JSON.parse(message);
            //the channels that we are going to do work
            switch (msgObj.event) {
                case 'delete':
                    this.updateCid();
                    break;
            }
        });
    }

    /**
     * update the process with cid
     */
    updateCid()
    {
        /**
         * delete cid Number for process environment
         * check process is dead.
         * if No, re-init Cid Number.
         * if Yes, mothing need to do.
         */
        delete process.env.cid;
        if(process.env.IS_ACTIVE != '0')
        {
            this.initCid();
        }
    }

    /**
     * incr cid with modelRedis
     */
    initCid()
    {
        return new Promise((resolve)=>{
            this.redis.incrCid(_Setting.CID_KEY, (reply)=>{
                if(!process.env.cid)
                {
                    var cid = reply - 1;
                    console.log(`cid : ${cid}`);
                    process.env.cid = cid;
                }
                resolve();
            });
        })
    }

    /**
     * server Init
     */
    serverInit()
    {
        this.initCid().then(()=>{
            this.emit('settings_loaded');
        })
    }

    /**
     * delete cid is registered on redis with Promise
     */
    deleteCid()
    {
        return new Promise((resolve)=>{
            this.redis.deleteData(_Setting.CID_KEY, ()=>{
                resolve();
            });
        });
    }

    /**
     * publish event to other cluster is sub on redis with Promise
     */
    publishEvent()
    {
        return new Promise((resolve)=>{
            var data = { event : 'delete' };
            this.redis.publishEvent(_Setting.CID_CHANNEL, data, ()=>{
                resolve();
            });
        });
    }

    /**
     * exitProcess with delete Cid and publishEvent
     */
    exitProcess()
    {
        /**
         * make the process is dead with environment.
         * call deleteCid and publishEvent with same time
         * after process exit
         */
        process.env.IS_ACTIVE = 0;
        var promiseExitArray = [];
        promiseExitArray.push(this.deleteCid());
        promiseExitArray.push(this.publishEvent());
        Promise.all(promiseExitArray).then(() => {
            process.exit();
        });
    }

    /**
     * check the process is Active
     * @param {Number} cidLength          the length of cluster save on redis
     * @param {Number} processCounter     Counter with Random Number for which cluster send messages
     */
    processInActive(cidLength, processCounter)
    {
        /**
         * get cid Number for process environment
         * check cidLength undefined and cid undefined
         * if which is undefined, return false
         * if cid equals (processCounter Mod cidLength)
         * if yes, return true
         * if No,  return false
         */
        var cid = Number(process.env.cid);
        if(cidLength && !utils.checkUndefined(cid)){
            var pmId = processCounter % cidLength;
            return pmId === cid;
        }
        return false;
    }

    /**
     * PopMessage with modelRedis
     * @param {Number} cidLength        the length of cluster save on redis
     * @param {Number} processCounter   Counter with Random Number for which cluster send messages
     * @param {String} queue            queue of channel name
     * @param {Function} callback       back to which functions call this functions 
     */
    popMessage(cidLength, processCounter, queue, callback)
    {
        /**
         * checkProcess is correct with mod cluster Length
         * if Yes, Pop messages on RSMQ with channel
         * after callback
         */
        if(this.processInActive(cidLength, processCounter))
        {
            this.redis.popMessageFromQueue(queue, (queueName, resp) => {
                var packet = undefined;
                if (resp.message) {
                    packet = JSON.parse(resp.message);   
                }
                if(callback){
                    callback(packet);
                }
            });  
        }
    }

    sendMultiInternalMessage(messageList) {
        _.log("Worker Process: " + process.env.cid + " Receives sendMultiInternalMessage event");
        var size = messageList.length;
        this.redis.saveData(Setting.INTERNAL_SAVE_QUEUE, size.toString(), null);
        // for (var message of messageList)
        // {
        //     var targetMsg = {topic: message.controllerName, type: message.command, data: message.data};
        //     this.redis.sendInternalMessageToQueue(JSON.stringify(targetMsg), function() { });
        // }
    }

    /**
     * @param {Function} callback       back to which functions call this functions 
     * get Cid Size for redis
     */
    getCidSize(callback)
    {
        /**
         * get Cid Size for redis
         * if Cid Size != undefined
         * convert Cid Size to Number
         * if Cid Size = undefined
         * set Cid Size = 0
         * return Cid Size
         */
        this.redis.getCidSize(_Setting.CID_KEY, (cidLength)=>{
            if(cidLength != undefined)
            {
                cidLength = Number(cidLength);
            }
            else
            {
                cidLength = 0;
            }
            callback(cidLength);
        })
    }

} 

module.exports = manager;