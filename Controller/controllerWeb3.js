'use strict';
let _web3           =   require("web3");
let _url            =   require('url');
let _path           =   require('path');
let _setting        =   require(base_path+'/enum/setting');
let _fs             =   require('fs');
let _cheerio        =   require('cheerio');
let _modelForm      =   require(base_path+'/model/modelFormData');
let _HashBlockJson  =   require(base_path+'/build/contracts/HashBlock.json');
let _modelFormHTML  =   require(base_path+'/model/modelFormHTML');
let _tx             =   require('ethereumjs-tx');

class controllerWeb3 
{
    constructor(mongodb, redis)
    {
        this.mongodb = mongodb;
        this.redis = redis; //testnet mainnet to testing!
        this.web3 = new _web3(new _web3.providers.HttpProvider(
            `https://ropsten.infura.io/v3/${_setting.INFURA_API_KEY}`
        ));
        this.formHTML = new _modelFormHTML();
        this.theContract = new this.web3.eth.Contract(_HashBlockJson.abi, _setting.CONTRACT_ADDRESS);
    }

    loadIndexhtml(req, res)
    {
        res.sendFile(_path.join(base_path+'/public/index.html'));
    }

    genContentContract(params, html)
    {
        var $ = _cheerio.load(html);

        var returnUrl = params.returnUrl;
        delete params.returnUrl;
        Object.keys(params).forEach(function(key, index) {
            $('input[type="text"]')[index].attribs.value = params[key];
        })
        if(returnUrl)
        {
            // var shaOneRetunUrl = _.sha1(returnUrl);
            // this.redis.saveData(shaOneRetunUrl, retunUrl, null);
            $('input[type="hidden"]')[0].attribs.value = returnUrl;
        }

        var unixTime = new Date().getTime();
        var hash = _.sha1(unixTime+'#'+_setting.PRIVATE_KEY);
        var filePath = _path.join(base_path+`/public/htmlCache/${hash}.html`);
        _fs.writeFileSync(filePath, $.html());
        return filePath;
    }

    loadFile(req, contractIndex)
    {
        var path = _path.join(base_path+`/public/formHTML/form${contractIndex}.html`);
        if(!_fs.existsSync(path))
        {
            res.status(403).send({ error: '沒有這個合約' });
        }
        var html = _fs.readFileSync(path, 'utf8');
        var params = _url.parse(req.url, true).query;
        if(params.returnUrl)
        {
            path = this.genContentContract(params, html);
        }
        return path;
    }

    loadfrom3(req, res)
    {
        res.sendFile(this.loadFile(req, 3));
    }

    loadfrom4(req, res)
    {
        res.sendFile(this.loadFile(req, 4));
    }

    loadfrom5(req, res)
    {
        res.sendFile(this.loadFile(req, 5));
    }

    loadfrom6(req, res)
    {
        res.sendFile(this.loadFile(req, 6));
    }

    loadGetForm(req, res)
    {
        res.sendFile(_path.join(base_path+'/public/getForm.html'));
    }

    resSendWithString(res, data)
    {
        res.send(JSON.stringify(data)); 
    }

    

    async getContractBalance(req, res)
    {
        var params = _url.parse(req.url, true).query;
        var agency = params.agency;
        var createDay = Number(params.createDay);
        if(!agency || !createDay)
        {
            this.sendError(403, res, '沒有這個代理協議');
            return;
        }
        var contract = this.hashFilePath(agency, createDay);
        var path = _path.join(base_path+`/data/${contract}.json`);

        if(!_fs.existsSync(path))
        {
            this.sendError(403, res, '沒有這個代理協議');
            return;
        }

        var json = JSON.parse(_fs.readFileSync(path, 'utf8'));
        var num = Object.values(JSON.parse(_fs.readFileSync(`date/${agency}.json`, 'utf8')).date).indexOf(createDay);
        var html = this.formHTML.renderingHTML(json, createDay);
        var hash = await this.theContract.methods.Get(agency, num).call({from: _setting.WALLET_ADDRESS});
        var passedData = 
        {
            html : html,
            json : json,
            hash : hash
        }
        res.send(JSON.stringify(passedData));    
    }

    getAgentLogInID(req, res)
    {
        var params = _url.parse(req.url, true).query;
        var path = _path.join(base_path+`/data/${params.account}.json`);
        if(_fs.existsSync(path))
        {
            res.send(_fs.readFileSync(path), 'utf8');
        }
        else
        {
            this.sendError(403, res, '沒有這個代理');
        }
    }

    getContractCreatingDate(req, res)
    {
        var params = _url.parse(req.url, true).query;
        var path = _path.join(base_path+`/date/${params.account}.json`);
        if(_fs.existsSync(path))
        {
            res.send(_fs.readFileSync((path), 'utf8'));
        }
        else
        {
            this.sendError(403, res, '沒有這個代理');
        }
    
    }

    getContractCount(req, res)
    {
        var params = _Url.parse(req.url, true).query;
        var path = _path.join(base_path+`/data/${params.contract}.json`);
        if(_fs.existsSync(path))
        {
            res.send(_fs.readFileSync(path), 'utf8');
        }
        else
        {
            this.sendError(403, res, '沒有這個代理');
        }
    }

    getContractDifferenetPrice(req, res)
    {
        var params = _url.parse(req.url, true).query;
        var path = _path.join(base_path+`/data/${params.account}.json`);
        if(_fs.existsSync(path))
        {
            res.send(_fs.readFileSync(path), 'utf8');
        }
        else
        {
            this.sendError(403, res, '沒有這個代理協議');
        }
    }

    initServerWithPortCallback()
    {
        console.log(`Listening on port ${process.env.port}`);
    }


    queryUrl(shaOneReturnUrl)
    {
        return new Promise((resolve)=>{
            this.redis.getData(shaOneReturnUrl, (url)=>{
                resolve(url);
            })
        });
    }

    fileExist(filePath)
    {
        return _fs.existsSync(filePath);
    }

    saveDate(agencyId, unixTime)
    {
        var filePath = `./date/${agencyId}.json`;
        var oldData = undefined;
        if(_fs.existsSync(filePath))
        {
            oldData = JSON.parse(_fs.readFileSync(filePath, 'utf8'));
        }
        else
        {
            oldData = {};
            oldData.date = [];
        }
        // console.log(oldData);
        oldData.date.push(unixTime);
        _fs.writeFileSync(filePath, JSON.stringify(oldData)); 
    }

    saveData(data, agency, unixTime)
    {
        if(data)
        {
            if(!unixTime)
            {
                var unixTime = new Date();
                this.saveDate(agency, unixTime.getTime());
            }
            var hash = this.hashFilePath(agency, unixTime.getTime());
            var filePath = `./data/${hash}.json`;
            _fs.writeFileSync(filePath, data);
        }
    }

    renderData(data)
    {
        return JSON.stringify(new _modelForm(data));
    }

    /**
     * 
     * load post api
     */

    contractEventHandle(shaOneReturnUrl, res)
    {
        var data = {
            returnUrl : shaOneReturnUrl
            //get on redis
            //returnUrl : await queryUrl(shaOneReturnUrl)
        };
        this.resSendWithString(res, data);
    }

    /*async*/ 
    renderCallback(req, res)
    {
        var formData = req.body;
        
        if(formData)
        {
            if(!formData.hasOwnProperty('inputDateFieldObject') 
            && !formData.hasOwnProperty('inputNumberFieldObject') 
            && !formData.hasOwnProperty('inputTextFieldObject') 
            && !formData.hasOwnProperty('checkboxObject') 
            && !formData.hasOwnProperty('textareaObject') 
            && !formData.hasOwnProperty('radioButtonObject') 
            && !formData.hasOwnProperty('signatureObject') 
            )
            {
                var formData = new _modelForm(formData);
            }
        }
        var json = JSON.stringify(formData);
        var hash = _.sha1(json);
        res.send(hash);
    }

    /*async*/ 
    contractCallback(req, res)
    {
        var formData = req.body;
        
        if(formData)
        {
            var returnUrl = formData.shaOneReturnUrl;
            var agency = formData.agency;
            var unixTime = formData.oldCreateDay;
            var json = this.renderData(formData);
            var hash = _.sha1(json);
            if(formData.action == 'save')
            {
                this.saveData(json, agency, unixTime);
                this.contractEventHandle(returnUrl, res);
            }
            else
            {
                this.runWeb3Function(hash, returnUrl, res, json, agency, unixTime);
            }
        }
    }

    hashFilePath(agency, createDay)
    {
        return _.sha1(agency+'#'+createDay+'#'+_setting.PRIVATE_KEY);
    }

    sendError(code, res, message)
    {
        res.status(code).send({ error: message });
    }


    async runWeb3Function(hash, returnUrl, res, json, agency, unixTime)
    {
        var from_addr = _setting.WALLET_ADDRESS;
        var contract_addr = _setting.CONTRACT_ADDRESS;

        var num = 0;
        var filePath = `./date/${agency}.json`;
        if(_fs.existsSync(filePath))
        {
            num = JSON.parse(_fs.readFileSync(filePath, 'utf8')).length;
        }
        var method_call_abi = await this.theContract.methods.UploadHash(agency, num, hash). encodeABI();
        if(!method_call_abi)
        {
            this.sendError(403, res, 'cannot unload this contract');
            return;
        }

        var txCount = await this.web3.eth.getTransactionCount(from_addr);
        var txData = {
            nonce: this.web3.utils.toHex(txCount),
            gasLimit: this.web3.utils.toHex(250000),
            gasPrice: this.web3.utils.toHex(10e8),
            to: contract_addr,
            from: from_addr,
            data: method_call_abi,
        };

        var transaction = new _tx(txData);                             
        var privateKeyBuf = Buffer.from(_setting.ETH_P_KEY, 'hex');   

        transaction.sign(privateKeyBuf);
        var serializedTx = transaction.serialize().toString('hex');
        var confirmSendSignTransaction = await this.web3.eth.sendSignedTransaction('0x' + serializedTx);
        console.log(confirmSendSignTransaction);
        if(confirmSendSignTransaction)
        {
            this.saveData(json, agency, unixTime);
            this.contractEventHandle(returnUrl, res);
        }
        else
        {
            this.sendError(403, res, 'cannot unload this contract');
        }
    }
}

module.exports = controllerWeb3;
