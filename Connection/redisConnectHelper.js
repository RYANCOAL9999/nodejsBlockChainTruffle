'use strict';

let _Redis = require('redis');
// let _Redis = require('ioredis');
let _RedisSMQ = require('rsmq');
let _EventEmitter = require('events').EventEmitter;

class RedisConnectHelper extends _EventEmitter
{

    /**
     * 
     * @param {*} startupNodes 
     */
    constructor(startupNodes)
    {
        super();
        this.startupNodes = startupNodes;
        this.redisConnected = false;
        this.workingClient = undefined;
        this.pubClient = undefined;
        this.subClient = undefined;
        this.imSub     = undefined;
        this.redisSMQ =  undefined;
        this.initConnection();
        this.receiptRedisCloseEvent();
        this.on('RemoveRedisClient', this.receiptRemoveClient);
    }

    /**
     * 
     */
    initConnection()
    {
        this.workingClient = this.createConnection(this.startupNodes);
        this.checkConnection(undefined);
    }

    /**
     * 
     * @param {*} startupNodes 
     */
    createConnection(startupNodes)
    {
        return new _Redis.createClient(startupNodes);
    }

    /**
     * 
     */
    getErrorFromRedis()
    {
        this.workingClient.on('error', (err)=>{
            console.log(`Error : ${err}`);
            this.emit('RemoveRedisClient');
        });
    }

    /**
     * 
     * @param {*} rClient 
     */
    checkConnection(rClient)
    {
        if(rClient == undefined){
            this.workingClient.on('connect', ()=>{
                console.log(`Connected to Redis`);
                this.redisConnected = true;     
            });
        }
        else
        {
            this.workingClient = rClient;
        }
        this.pubClient = this.workingClient.duplicate();
        this.subClient = this.workingClient.duplicate();
        this.imSub     = this.workingClient.duplicate();
        this.redisSMQ = new _RedisSMQ({ client : this.workingClient.duplicate() });
        this.getErrorFromRedis();
    }

    /**
     * 
     */
    receiptRemoveClient()
    {
        this.redisConnected = false;
        if(!this.redisConnected)
        {
            this.pubClient     = undefined;
            this.subClient     = undefined;
            this.redisSMQ      = undefined;
            this.imSub         = undefined;
            this.workingClient = undefined;
        }
    }

    /**
     * 
     * @param {*} time 
     * @param {*} startServer 
     */
    pingRedis(time, startServer)
    {
        var rClient = this.createConnection(this.startupNodes);
        rClient.ping((err, result)=>
        {
            if(err != undefined)
            {
                console.log(`What is error = ${err}`);
                if(!startServer){
                    this.ReclusivePing(time, startServer);
                }
                else
                {
                    global.exit();
                }
            }
            else
            {
                console.log(`What is result = ${result}`);
                if(!startServer)
                {
                    this.redisConnected = true;
                    this.checkConnection(rClient);
                }
            }
        })
    }

    /**
     * 
     * @param {*} time 
     * @param {*} startServer 
     */
    reclusivePing(time, startServer)
    {
        console.log('set TimeOut Ping With Reclusive')
        setTimeout(()=>
        {
            this.pingRedis(time, startServer);
        }, time);
    }

    /**
     * 
     */
    receiptRedisCloseEvent()
    {
        this.workingClient.once("end", ()=>{
            console.log('redis is closed');
            this.emit('RemoveRedisClient');
            this.reclusivePing(1000, false);
        })
    }

    /**
     * 
     */
    get workClient()
    {
        return this.workingClient;
    }

    /**
     * 
     */
    get publishClient()
    {
        return this.pubClient;
    }

    /**
     * 
     */
    get rsmq()
    {
        return this.redisSMQ;
    }

    /**
     * 
     */
    get subscriberClient()
    {
        return this.subClient;
    }

    /**
     * 
     */
    get imSubscriber()
    {
        return this.imSub;
    }

    /**
     * 
     */
    get printClient()
    {
        return _Redis.print;
    }

    /**
     * 
     */
    get redisIsConnected()
    {
        return this.redisConnected;
    }


}

module.exports = RedisConnectHelper;