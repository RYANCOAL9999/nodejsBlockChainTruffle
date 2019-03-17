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
        this.web3 = new _Web3(new _web3.providers.HttpProvider(
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
        var contract = undefined;
        if(!params.contract)
        {
            if(params.agency && params.createDay){
                contract = _.sha1(params.agency+'#'+params.createDay+'#'+_setting.PRIVATE_KEY);
            }
        }
        else
        {
            contract = params.contract;
        }
        if(contract)
        {
            var path = _path.join(base_path+`/data/${contract}.json`);
            
            if(_fs.existsSync(path))
            {
                var json = JSON.parse(_fs.readFileSync(path, 'utf8'));
                var html = this.formHTML.renderingHTML(json, params.createDay);
                var hash = await this.theContract.methods.Get().call({from: _setting.META_MASK_ADDRESS});
                var passedData = 
                {
                    html : html,
                    json : json,
                    hash : hash
                }
                res.send(JSON.stringify(passedData));
            }
        }
        else
        {
            res.status(403).send({ error: '沒有這個代理協議' });
        }
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
            res.status(403).send({ error: '沒有這個代理' });
        }
    }

    getContractCreatingDate(req, res)
    {
        var params = _url.parse(req.url, true).query;
        var path = _path.join(base_path+`/date/${params.account}.json`);
        if(_fs.existsSync(path))
        {
            var data = _fs.readFileSync((path), 'utf8');
            // console.log(data);

            res.send(_fs.readFileSync((path), 'utf8'));
        }
        else
        {
            res.status(403).send({ error: '沒有這個代理' });
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
            res.status(403).send({ error: '沒有這個代理' });
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
            res.status(403).send({ error: '沒有這個代理協議' });
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

    saveDate(agencyId, data)
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
        oldData.date.push(data);
        _fs.writeFileSync(filePath, JSON.stringify(oldData)); 
    }

    saveData(data)
    {
        if(data)
        {
            var unixTime = data.oldCreateDay;
            if(!unixTime)
            {
                unixTime = new Date().getTime();
                this.saveDate(data.agency, unixTime);
            }
            var hash = _.sha1(data.agency+'#'+unixTime+'#'+_setting.PRIVATE_KEY);
            var filePath = `./data/${hash}.json`;
            var json = JSON.stringify(new _modelForm(data));
            _fs.writeFileSync(filePath, json);
            return json; 
        }
        return undefined;
    }

    /**
     * 
     * load post api
     */

    contractEventHandle(shaOneReturnUrl, hash, res)
    {
        var data = {
            returnUrl : shaOneReturnUrl,
            hash : hash
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
        var hash2 = _.sha1(json);
        res.send(hash2);
    }

    /*async*/ 
    contractCallback(req, res)
    {
        var formData = req.body;
        
        if(formData)
        {
            var json = this.saveData(formData);
            var hash2 = _.sha1(json);
            if(formData.action == 'save')
            {
                hash2 = undefined;
            }
            else
            {
                this.runWeb3Function(hash2);
            }
            this.contractEventHandle(formData.shaOneReturnUrl, hash2, res);
        }
    }

    async runWeb3Function(hash2)
    {
        var from_addr = _setting.WALLET_ADDRESS;
        var contract_addr = _setting.CONTRACT_ADDRESS;
        var method_call_abi = await this.theContract.methods.UploadHash(hash2). encodeABI();

        var txCount = await this.web3.eth.getTransactionCount(from_addr);

        var txData = {
            nonce: this.web3.utils.toHex(txCount),
            gasLimit: this.web3.utils.toHex(250000),
            gasPrice: this.web3.utils.toHex(10e8),
            to: contract_addr,
            from: from_addr,
            data: method_call_abi,
        };

        // var transaction = new this.ethereumjs.Tx(txData);                                    //error
        // var privateKeyBuf = new this.ethereumjs.Buffer.Buffer(_setting.ETH_P_KEY, 'hex');    //error

        var transaction = new _tx(txData);                              //should be this correct ?
        var privateKeyBuf = Buffer.from(_setting.ETH_P_KEY, 'hex');     //should be this correct ?

        transaction.sign(privateKeyBuf);
        var serializedTx = transaction.serialize().toString('hex');
        this.web3.eth.sendSignedTransaction('0x' + serializedTx).then(console.log);
    }
}

module.exports = controllerWeb3;