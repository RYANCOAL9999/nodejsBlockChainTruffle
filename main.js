'use strict';
/**
 *  _... = require module !!!! 
 */
let _Config         =   require('./config');            //load process env.
let _Mongo          =   require('./model/modelMongo');  
let _Redis          =   require('./model/modelRedis');
let _BodyParser     =   require('body-parser');
let _Express        =   require('express');
let _Manager        =   require('./manager'); 
let _               =   require('./util/MyUnderscore');


let mongodb = new _Mongo(process.env.mongodbIP, process.env.mongodbPort);
let redis = new _Redis(process.env.redisIP, process.env.redisPort);
let manager = new _Manager(redis);
let app = _Express();

global.config = _Config;
global._ = _;

/**
 * process exit
 */
process.on('exit', () =>{
});

/**
 * exit with remove cid
 */
global.exit = function() {
    manager.exitProcess();
};

/**
 * for forever using
 */
process.on('SIGTERM', ()=>{
	console.log(`SIGTERM exit`);
	global.exit();
});

/**
 * for control-c using
 */
process.on('SIGINT', () => {
	console.log(`SIGINT exit`);
	global.exit();
});

/**
 * for exception using
 */
// process.on('unhandledRejection', (reason)=>{
// 	console.log('Unhandled Rejection reason : ', reason);
// 	global.exit();
// });

/**
 * for uncaught Exception
 */
// process.on('uncaughtException', (err)=>{
// 	console.log('uncaught Exception err : ', err);
// 	global.exit();
// });

/**
 * for rejeact handled
 */
// process.on('rejectionHandled', (promise) => {
// 	console.log('rejectionHandled promise : ', promise);
// 	global.exit();
// });

/**
 * start Server with controller and express api
 */
var StartServer = ()=>
{
    //set directory for public
    app.use(_Express.static(__dirname + '/public'));
    // parse application/json with 100 mb
    app.use(_BodyParser.json({limit: '100mb'}));
    app.use(_BodyParser.urlencoded({limit: '100mb', extended: true}));
    

    let _ControllerWeb3  =  require('./controller/controllerWeb3'); 
    
    var controllerWeb3   =  new _ControllerWeb3(mongodb, redis);

    /**
     * request get for website 
     */
    app.get('/', controllerWeb3.loadIndexhtml);

    app.get('/contract/3/form', controllerWeb3.loadfrom3.bind(controllerWeb3));

    app.get('/contract/4/form', controllerWeb3.loadfrom4.bind(controllerWeb3));

    app.get('/contract/5/form', controllerWeb3.loadfrom5.bind(controllerWeb3));

    app.get('/contract/6/form', controllerWeb3.loadfrom6.bind(controllerWeb3));

    app.get('/contract/8/form', controllerWeb3.loadfrom8.bind(controllerWeb3));

    app.get('/contract/3Eng/form', controllerWeb3.loadfrom3Eng.bind(controllerWeb3));

    app.get('/contract/4Eng/form', controllerWeb3.loadfrom4Eng.bind(controllerWeb3));

    app.get('/contract/5Eng/form', controllerWeb3.loadfrom5Eng.bind(controllerWeb3));

    app.get('/contract/6Eng/form', controllerWeb3.loadfrom6Eng.bind(controllerWeb3));

    app.get('/contract/8Eng/form', controllerWeb3.loadfrom8Eng.bind(controllerWeb3));

    app.get('/show/contract', controllerWeb3.loadGetForm.bind(controllerWeb3));

    /**
     * request get for api 
     */
    app.get('/admin', controllerWeb3.adminCorrect.bind(controllerWeb3));
     
    app.get('/api/users/agency', controllerWeb3.getContractBalanceByAgent.bind(controllerWeb3));

    app.get('/api/users/balance', controllerWeb3.getContractBalance.bind(controllerWeb3));

    app.get('/api/users/contracts', controllerWeb3.getContracts.bind(controllerWeb3));

    /**
     * request post for api 
     */

    app.post('/process', controllerWeb3.contractCallback.bind(controllerWeb3));

    app.post('/hash', controllerWeb3.hashCallback.bind(controllerWeb3));

    app.listen(process.env.port, controllerWeb3.initServerWithPortCallback);

}

manager.on('settings_loaded', StartServer);
manager.serverInit();
