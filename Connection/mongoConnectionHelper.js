'use strict';
let _Mongoose = require('mongoose');
// let _Mongo   =  require('mongodb');
let _EventEmitter = require('events').EventEmitter;

class mongoConnectionHelper extends _EventEmitter
{
    /**
     * init with connection
     * @param {string} host 
     * @param {Number} port 
     */
    constructor(host, port)
    {
        super();
        this.host           =   host;
        this.port           =   port;
        this.dbConnected    =   false;
        this.db             =   undefined;
        this.initConnection();
        this.on('Removedb', this.receiptRemoveClient);    
    }

    /**
     * init with create connection
     */
    initConnection()
    {
        this.db = this.createConnection(this.host, this.port);
        this.checkConnection();
    }

    /**
     * creating connection
     * @param {string} host 
     * @param {Number} port 
     */
    createConnection(host, port)
    {
        _Mongoose.connect(`mongodb://${host}:${port}/truffle`, 	
        {
            // useMongoClient: true,
            autoIndex: false, 
            reconnectTries: Number.MAX_VALUE,
            reconnectInterval: 500, 
            poolSize: 10, 
            bufferMaxEntries: 0,
            useNewUrlParser : true
        },
        (err)=>{
            if(err){
                console.log(error);
            }
        });
        return _Mongoose.connection;
    }

    /**
     * receipt remove client
     */
    receiptRemoveClient()
    {
        this.db = undefined;
        // remake the connection
        this.initConnection();
    }

    /**
     *  get error of mongodb
     */
    getErrorFromMongo()
    {
        this.db.on('error', (err)=>{
            console.log(`Error : ${err}`);
            this.dbConnected = false;
            this.emit('Removedb');
            
        });
    }

    /**
     * check mongodb is connection
     */
    checkConnection()
    {
        this.db.once('open', ()=>
        {
            console.log(`Connected to Mongo`);
            this.dbConnected = true;    
        })
        this.getErrorFromMongo();
    }

    /**
     * get dbAdapter
     */
    get dbAdapter()
    {
        return this.db;
    }

    /**
     * get mongodb is connect
     */
    get mongoIsConnected()
    {
        return this.dbConnected;
    }
}

module.exports = mongoConnectionHelper;