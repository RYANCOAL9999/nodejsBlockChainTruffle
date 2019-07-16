# Electrics Prescribed forms with Ethereum

Project Desription : It is a systems that have 4 Prescribed forms to give any estate agency to do Real estate agency agreement. This system is use node.js, mongodb, redis to develop. It is connected Etherenum to check the Prescribed forms without changeable with real-time to protected the data is consistency.

## Installation

environment : Any platform with Mongodb, Redis, Node.js, PM2 and Nginx.

Mongodb installation :
https://docs.mongodb.com/manual/installation/

Redis installation :
https://redis.io/topics/quickstart

Node.js installation :
https://nodejs.org/en/download/

PM2 installation and why need this:
https://www.npmjs.com/package/pm2

Nginx installation :
https://www.nginx.com/resources/wiki/start/topics/tutorials/install/
The reason is uses for proxy server with 80(http) or 443(https) ports.

step 1 : npm install.

step 2 : check any connection for Mongodb and Redis. The connection config is on the config.js.

step 3 : PM2 start ecosystem.config.js

## Contributing
Nginx Proxy server with with 80(http) or 443(https) ports:
http://blog.topspeedsnail.com/archives/4982

You must need to bing IP and make to the systems with daemon after Install mongodb and Redis.

Redis bing IP :
https://dotblogs.com.tw/colinlin/2017/06/26/150257

Redis daemon :
https://stackoverflow.com/questions/14816892/how-to-keep-redis-server-running

Mongodb bind IP :
https://docs.mongodb.com/manual/core/security-mongodb-configuration/

Mongodb daemon :
https://docs.mongodb.com/manual/tutorial/manage-mongodb-processes/

It must connect to mongodb with admin account.
This is tutorial and why need to doing this:
https://docs.mongodb.com/manual/tutorial/enable-authentication/

It must have project with infura.io.
https://infura.io/project/***********************************

*********************************** is project ID of infura.io.

https://ropsten.infura.io/v3/ is for testing uses.

https://mainnet.infura.io/v3/ is for production uses.

mainnet must have ether with deploy the contract and hash-string, ether is need to pay money.
https://coinmarketcap.com/currencies/ethereum/

https://www.api2pdf.com/
api2pdf must have account for rendering PDF, api2pdf is no free, it must need to pay money with account. for example, $2 usd to use many time, rendering PDF for one time is about 0.00005 usd.

## License
K Consulting Pro




































 







