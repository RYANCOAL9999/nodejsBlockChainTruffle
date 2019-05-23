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
        this.createConnection(host, port);
        this.host           =   host;
        this.port           =   port;
        this.dbConnected    =   false;
        this.db             =   undefined;
        this.on('Removedb', this.receiptRemoveClient);    
    }
    
    /**
     * creating connection
     * @param {string} host 
     * @param {Number} port 
     */
    createConnection(host, port)
    {
        _Mongoose.connect(`mongodb://${process.env.DBadmin}:${process.env.DBpassword}@${host}:${port}/truffle?authSource=${process.env.auth}&w=1`,
        // _Mongoose.connect(`mongodb://${host}:${port}/truffle`,
        {
            autoIndex: false, 
            reconnectTries: Number.MAX_VALUE,
            reconnectInterval: 500, 
            poolSize: 5, 
            bufferMaxEntries: 0,
            useNewUrlParser : true,
            family: 4
        }).then(()=>{
            _.log(`Connected to Mongo`);
            this.db = _Mongoose.connection;
            this.getErrorFromMongo();
        }, (err)=>{
            _.log(`Can't connected to Mongo`);
            global.exit();
        })
    }

    /**
     * receipt remove client
     */
    receiptRemoveClient()
    {
        this.db = undefined;
        // remake the connection
        this.createConnection(this.host, this.port);
    }

    /**
     *  get error of mongodb
     */
    getErrorFromMongo()
    {
        this.db.on('error', (err)=>{
            _.log(`Error : ${err}`);
            this.dbConnected = false;
            this.emit('Removedb');
            
        });
    }

    /**
     * get dbAdapter
     */
    get dbAdapter()
    {
        return this.db;
    }

    /**
     * get MoogooseConnection
     */
    get MongooseConnection()
    {
        return _Mongoose.connection;
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
