'use strict';
process.env.TZ          = 'Hongkong';
global.base_path        = __dirname;
process.env.NODE_ENV    = 'development';
process.env.IS_ACTIVE   = 1;
process.env.port 	    = 3000;              
process.env.redisIP     = '192.168.0.109';
process.env.redisPort   = 26375;
process.env.mongodbIP   = '192.168.0.109';
process.env.mongodbPort = 27017;
process.env.DBadmin     = 'myUserAdmin';
process.env.DBpassword  = 'abc123';
process.env.auth        = 'admin';
// process.env.IS_MASTER_PROCESS = (process.env.pm_id === undefined || process.env.pm_id === '0') ? 1 : 0;