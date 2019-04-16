'use strict';
let _Mongoose = require('mongoose');
// let _Mongo   =  require('mongodb');
let _EventEmitter = require('events').EventEmitter;

class mongoConnectionHelper extends _EventEmitter
{
    /**
     * 
     * @param {*} host 
     * @param {*} port 
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
     * 
     */
    initConnection()
    {
        this.db = this.createConnection(this.host, this.port);
        this.checkConnection();
    }

    /**
     * 
     * @param {*} host 
     * @param {*} port 
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
     * 
     */
    receiptRemoveClient()
    {
        this.db = undefined;
        // remake the connection
        this.initConnection();
    }

    /**
     * 
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
     * 
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
     * 
     */
    get dbAdapter()
    {
        return this.db;
    }

    /**
     * 
     */
    get mongoIsConnected()
    {
        return this.dbConnected;
    }
}

module.exports = mongoConnectionHelper;