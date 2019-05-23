'use strict';
let _web3           =   require("web3");
let _url            =   require('url');
let _path           =   require('path');
let _setting        =   require(base_path+'/enum/setting');
let _cheerio        =   require('cheerio');
let _modelForm      =   require(base_path+'/model/modelFormData');
let _HashBlockJson  =   require(base_path+'/build/contracts/HashBlock.json');
let _modelFormHTML  =   require(base_path+'/model/modelFormHTML');
let _tx             =   require('ethereumjs-tx');
let _fsHelper       =   require(base_path+'/connection/fsHelper');
let _moment         =   require('moment');
let _api2Pdf        =   require('api2pdf');
let _errorMessage   =   require(base_path+'/enum/errorMessage');
let a2pClient       =   new _api2Pdf('ba28d6a8-b161-416a-8bba-7828fe14c192');
let _defaultHeader  =   require(base_path+'/enum/httpHeader');

/**
 * controllerWeb3 with api functions
 */
class controllerWeb3 
{
    /**
     * init the mongo and redis connect's object
     * init the web3 object
     * init formHTML object and modelForm for JSON convertor
     * init contract object
     * init the moongoose object for create model
     * init the formData for mongodb
     * @param {object} mongodb mongodb connect's object
     * @param {object} redis   redis connect's object
     */
    constructor(mongodb, redis)
    {
        this.mongodb = mongodb;
        this.redis = redis; //testnet mainnet to testing!
        this.web3 = new _web3(new _web3.providers.HttpProvider(
            "http://localhost:5000"
        ));
        this.formHTML = new _modelFormHTML();
        this.modelForm = new _modelForm();
        this.theContract = new this.web3.eth.Contract(_HashBlockJson.abi, _setting.CONTRACT_ADDRESS);
        this.tankObject = {};
        this.formPage = undefined;
        this.genformPage(mongodb.MongooseConnection);
    }

    /**
     * gen forPage content form pdf
     * @param {connection} connection 
     */
    genformPage(connection)    
    {
        connection.once('open', function () {
            connection.db.collection('form', (err, collectionObject)=>{
                collectionObject.find({}).toArray((err, data)=>
                {
                    this.formPage = data[0];
                })
            })
        })
    }

    /**
     * gen the schema with structure for moogoose schema with 0 to more object
     * @param {Number} inputproperty to know gen 0 to more object
     * @param {Number} form_id to know the form is 8 or not
     */
    genSchema(inputproperty, form_id){
        var object = {
            "hash" : String,
            "opening":String,
            "userEng":String,
            "userChi":String,
            "agency":String,
            "exclusive":String,
            "property":String,
            "createDay":String,
            "expiresDay":String,
            "relationship":String,
            "dollar":String,
            "dollarTenThoursand":String,
            "dollarThoursand":String,
            "dollarHK":String,
            "showProperty":String,
            "keepProperty":String,
            "watchProperty":String,
            "distributProperty":String,
            "advertisements":String,
            "showRightInterests":String,
            "fiveAgreement":String,
            "salePurchaseAgreement":String,
            "additionalLaw":String,
            "iDNumber":String,
            "iDBRNumber":String,
            "agencyName":String,
            "agencyNumber":String,
            "referenceForCompany":String,
            "user":String,
            "userPosition":String,
            "userBDN":String,
            "agencyBDN":String,
            "userAddress":String,
            "userPhone":String,
            "userFax":String,
            "userSignDate":String,
            "agencyAddress":String,
            "agencyPhone":String,
            "agencyFax":String,
            "agencySignDate":String,
            "signatureCheck":String,
            "propertyFinished":String,
            "toAgencyMoney":String,
            "propertyPercentage":String,
            "moneyIncrease":String,
            "reference":String,
            "svgUser":String,
            "svgAgency":String,
            "shaOneReturnUrl":String,
            "uniqueNumber":String,
            "form_id":Number,
            "action":String,
            "userAgreeSeeProperty":String,
            "userAgreeKeepKey":String,
            "language" : String,
            "documentHash" : String
        }
        for(var i = 0; i < inputproperty;i++)
        {
            object[`showPropertyName${i}`] = String;
            object[`showPropertyDate${i}`] = String;
            object[`propertyRelase${i}`] = String;
            object[`propertyRelation${i}`] = String;
            object[`sellerCommission${i}`] = String;
            object[`buyerCommission${i}`] = String;
        }

        if(form_id == 8){

            object = 
            {
                "action":String,
                "additionalLoanPlan":String,
                "agency":String,
                "AmountOwned":String,
                "approvalLoan":String,
                "approvalLoanDay":String,
                "BankChoose":String,
                "bankMortgage":String,
                "carAddress":String,
                "cashRebate":String,
                "cashRebatePer":String,
                "contractBlock":String,
                "contractFlat":String,
                "contractFloor":String,
                "contractPerson":String,
                "contribution":String,
                "cover":String,
                "existingMortgageRate":String,
                "form_id":String,
                "interestRate":String,
                "interestRatePer":String,
                "language":String,
                "loanPurpose":String,
                "loanRequest":String,
                "loanRequestMoney":String,
                "loanRequestPer":String,
                "market":String,
                "otherBankChoose":String,
                "penaltyPeriod":String,
                "penaltyPeriodYear":String,
                "price":String,
                "propertyBlock":String,
                "propertyCat":String,
                "propertyDate":String,
                "propertyFlat":String,
                "propertyFloor":String,
                "propertyOther":String,
                "propertyStatus":String,
                "remainingContributionPeriodYear":String,
                "repaymentPeriod":String,
                "repaymentPeriodYear":String,
                "shaOneReturnUrl":String,
                "surlusFineYear":String,
                "svgUser":String,
                "uniqueNumber":String,
                "userABirthday":String,
                "userABusinessNature":String,
                "userAEducation":String,
                "userAEmail":String,
                "userAEmploy":String,
                "userAEng":String,
                "userAExclusive":String,
                "userAFaxNumber":String,
                "userAIDBRNumber":String,
                "userAIDNumber":String,
                "userAIncome":String,
                "userAIncomeDollar":String,
                "userAMobilePhoneNumber":String,
                "userAOfficePhoneNumber":String,
                "userAPosition":String,
                "userATelePhoneNumber":String,
                "userBBirthday":String,
                "userBBusinessNature":String,
                "userBEducation":String,
                "userBEmail":String,
                "userBEmploy":String,
                "userBEng":String,
                "userBExclusive":String,
                "userBFaxNumber":String,
                "userBIDBRNumber":String,
                "userBIDNumber":String,
                "userBIncome":String,
                "userBIncomeDollar":String,
                "userBMobilePhoneNumber":String,
                "userBOfficePhoneNumber":String,
                "userBPosition":String,
                "userBTelePhoneNumber":String,
                "rejectForDirectMarket" : String,
                "rejectForLoanReferral" : String,
                "rejectForSendData" : String,
                "propertyOffPlan" : String,
                "hash" : String,
                "userSignDate" : String,
                "documentHash" : String
            };
        }
        return object;
    }

    /**
     * load the html for index.html
     * @param {Object} req api request
     * @param {Object} res api response
     */
    loadIndexhtml(req, res)
    {
        res.sendFile(_path.join(base_path+'/public/index.html'));
    }

    /**
     * gen the contract with new file
     * @param {object} params request params for client
     * @param {object} html html code for form file
     */
    genContentContract(params, html)
    {
        return new Promise( async(resolve)=>{
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

            await _fsHelper.writeFileAsync(filePath, $.html());
            resolve(filePath);
        })
    }

    /**
     * load the form
     * if have data just call genContentContract function to gen new form file
     * send the form file to client
     * @param {object} req request
     * @param {object} res response
     * @param {Number} contractIndex which form 
     * @param {String} language which language
     */
    async loadFile(req, res, contractIndex, language)
    {
        var subPath = `/public/formHTML/form${contractIndex}`;
        if(language){
            subPath += language;
        }
        var languageText = _errorMessage['loadFile'];

        var path = _path.join(base_path+`${subPath}.html`);
        if(! await _fsHelper.fileExistAsync(path))
        {
            this.sendError(403, res, `${languageText[language]} : ${path}`, 'loadFile');
            return;
        }

        _.log(`loadFile: ${path}`);

        var html = await _fsHelper.readFileAsync(path, 'utf8');
        var params = _url.parse(req.url, true).query;
        if(params.returnUrl)
        {
            path = await this.genContentContract(params, html);
        }
        res.sendFile(path);
    }

    /**
     * send Form 3 with response
     * @param {object} req request
     * @param {object} res response
     */
    loadfrom3(req, res)
    {
        this.loadFile(req, res, 3);
    }

    /**
     * send Form 4 with response
     * @param {object} req request
     * @param {object} res response
     */
    loadfrom4(req, res)
    {
        this.loadFile(req, res, 4);
    }

    /**
     * send Form 5 with response
     * @param {object} req request
     * @param {object} res response
     */
    loadfrom5(req, res)
    {
        this.loadFile(req, res, 5);
    }

    /**
     * send Form 6 with response
     * @param {object} req request
     * @param {object} res response
     */
    loadfrom6(req, res)
    {
        this.loadFile(req, res, 6);
    }

    /**
     * send Form 8 with response
     * @param {object} req request
     * @param {object} res response
     */
    loadfrom8(req, res)
    {
        this.loadFile(req, res, 8);
    }

    /**
     * send Form 3 eng with response
     * @param {object} req request
     * @param {object} res response
     */
    loadfrom3Eng(req, res)
    {
        this.loadFile(req, res, 3, 'eng');
    }

    /**
     * send Form 4 eng with response
     * @param {object} req request
     * @param {object} res response
     */
    loadfrom4Eng(req, res)
    {
        this.loadFile(req, res, 4, 'eng');
    }

    /**
     * send Form 5 eng with response
     * @param {object} req request
     * @param {object} res response
     */
    loadfrom5Eng(req, res)
    {
        this.loadFile(req, res, 5, 'eng');
    }

   /**
     * send Form 6 eng with response
     * @param {object} req request
     * @param {object} res response
     */
    loadfrom6Eng(req, res)
    {
        this.loadFile(req, res, 6, 'eng');
    }

    /**
     * send Form 8 eng with response
     * @param {object} req request
     * @param {object} res response
     */
    loadfrom8Eng(req, res)
    {
        this.loadFile(req, res, 8, 'eng');
    }

    /**
     * send getForm with response
     * @param {object} req request
     * @param {object} res response
     */
    loadGetForm(req, res)
    {
        res.sendFile(_path.join(base_path+'/public/getForm.html'));
    }

    /**
     * send back string with response
     * @param {object} res response 
     * @param {object} data data for which functions is call this function 
     */
    resSendWithString(res, data)
    {
        res.send(JSON.stringify(data)); 
    }

    /**
     * update language with english or other
     * if not language is english.
     * @param {String} language 
     */
    updatelanguage(language)
    {
        if(!language)
        {
            language = 'eng';
        }
        return language;
    }

    /**
     * get contract Number for Agent
     * @param {object} req request
     * @param {object} res response
     */
    async getContractBalanceByAgent(req, res)
    {
        var accessUserObject = await this.getAccessUsers({'user' : req.headers["x-kconsultingpro-user"]});
        if(!_.checkHeader(req.headers, _defaultHeader, accessUserObject))
        {
            this.sendError(404, res, 0, 'getContractBalanceByAgent');
            return;
        }

        var params = _url.parse(req.url, true).query;
        var agency = params.account;
        var language = this.updatelanguage(params.language);
        var agent = _errorMessage['getAgent'];
        if(!agency)
        {
            this.sendError(403, res, agent[language], 'getContractBalanceByAgent');
            return;
        }

        var contract = await this.redis.hasValuesWithHM(agency);
        var languageText = _errorMessage['getContractBalanceByAgent'];

        if(!contract)
        {
            this.sendError(403, res, `${languageText[language]} : ${contract}`, 'getContractBalanceByAgent');
            return;
        }

        _.log(`getContractBalanceByAgent:${agency}`);

        var uniqueNumberArray = Object.keys(contract);
        
        var data = {};

        data["contract"] = uniqueNumberArray;

        res.send(JSON.stringify(data));
    }

     /**
     * get the contract hash for agency and uniqueNumber
     * @param {object} req request
     * @param {object} res response
     */
    async getHashFormBlockChainWithAgency(req, res)
    {
        var accessUserObject = await this.getAccessUsers({'user' : req.headers["x-kconsultingpro-user"]});
        if(!_.checkHeader(req.headers, _defaultHeader, accessUserObject))
        {
            this.sendError(404, res, 0, 'getHashFormBlockChain');
            return;
        }

        var params = _url.parse(req.url, true).query;
        var uniqueNumber = params.uniqueNumber;
        var agency = params.account;
        var language = this.updatelanguage(params.language);
        var agent = _errorMessage['getAgent'];
        if(!uniqueNumber || !agency)
        {
            this.sendError(403, res, agent[language], 'getHashFormBlockChain');
            return;
        }

        var contractObject = await this.redis.hasValuesWithHM(agency);
        var languageText = _errorMessage['getContractBalanceByAgent'];

        if(!contract)
        {
            this.sendError(403, res, `${languageText[language]} : ${uniqueNumber}`, 'getHashFormBlockChain');
            return;
        }

        var uniqueNumberArray = Object.keys(contractObject);

        var num = uniqueNumberArray.includes(uniqueNumber);
        var languageMessage = _errorMessage['getHashFormBlockChain'];

        if(num == -1)
        {
            this.sendError(403, res, `${languageMessage[language]} : ${uniqueNumber}`, 'getHashFormBlockChain');
            return;
        }

        _.log(`getContractBalanceByAgent:${agency}, ${uniqueNumber}`);

        var data = {};
        try
        {
            data[uniqueNumber] = await this.theContract.methods.Get(agency, num).call({from: _setting.WALLET_ADDRESS});
        }
        catch(error)
        {
            throw new Error(error);
        }

        res.send(JSON.stringify(data));
    }


    /**
     * get the contract hash for agency and uniqueNumber
     * @param {object} req request
     * @param {object} res response
     */
    async getHashFormBlockChain(req, res)
    {
        var params = _url.parse(req.url, true).query;
        var uniqueNumber = params.uniqueNumber;
        var agency = await this.redis.getDataWithH('recordAgency', uniqueNumber);
        var language = this.updatelanguage(params.language);
        var agent = _errorMessage['getAgent'];
        if(!uniqueNumber || !agency)
        {
            this.sendError(403, res, agent[language], 'getHashFormBlockChain');
            return;
        }

        var contractObject = await this.redis.hasValuesWithHM(agency);
        var languageText = _errorMessage['getContractBalanceByAgent'];

        if(!contract)
        {
            this.sendError(403, res, `${languageText[language]} : ${uniqueNumber}`, 'getHashFormBlockChain');
            return;
        }

        var uniqueNumberArray = Object.keys(contractObject);

        var num = uniqueNumberArray.includes(uniqueNumber);
        var languageMessage = _errorMessage['getHashFormBlockChain'];

        if(num == -1)
        {
            this.sendError(403, res, `${languageMessage[language]} : ${uniqueNumber}`, 'getHashFormBlockChain');
            return;
        }

        _.log(`getContractBalanceByAgent:${agency}, ${uniqueNumber}`);

        var data = {};
        try
        {
            data[uniqueNumber] = await this.theContract.methods.Get(agency, num).call({from: _setting.WALLET_ADDRESS});
        }
        catch(error)
        {
            throw new Error(error);
        }

        res.send(JSON.stringify(data));
    }

    /**
     * get tanks model for the this class
     * if no this model, it will gen new tanks model
     * @param {*} tableRecord 
     * @param {*} form_id 
     */
    getTanks(tableRecord, form_id)
    {
        if(form_id == 8)
        {
            tableRecord = 'eightForm';
        }
        if(!this.tankObject[tableRecord])
        {
            this.tankObject[tableRecord] = _Mongoose.connection.model(`tanks${tableRecord}` ,new _Mongoose.Schema(this.genSchema(tableRecord, form_id)));
        }
        return this.tankObject[tableRecord];
    }

    /**
     * get the contract for uniqueNumber
     * @param {object} req request
     * @param {object} res response
     */
    async getContractBalance(req, res)
    {
        var accessUserObject = await this.getAccessUsers({'user' : req.headers["x-kconsultingpro-user"]});
        if(!_.checkHeader(req.headers, _defaultHeader, accessUserObject))
        {
            this.sendError(404, res, 0, 'getContractBalance');
            return;
        }

        var params = _url.parse(req.url, true).query;
        var uniqueNumber = params.uniqueNumber;
        var language = this.updatelanguage(params.language);
        var languageText = _errorMessage['getContractBalance'];
        if(!uniqueNumber)
        {
            this.sendError(403, res, languageText[language], 'getContractBalance');
            return;
        }

        var inputPropertyCurrent = await this.redis.getData(uniqueNumber);

        var contract = await this.redis.getDataWithH('record', uniqueNumber);

        if(!contract)
        {
            this.sendError(403, res, `${languageText[language]} : ${uniqueNumber}`, 'getContractBalance');
            return;
        }

        var inputProperty = inputPropertyCurrent == undefined || inputPropertyCurrent == null ? 0: Number(inputPropertyCurrent);

        var search = uniqueNumber.split("");
        
        var form_id = Number(search[2]);

        var tank = this.getTanks(inputProperty, form_id);

        var formData = await this.mongodb.search({
            hash: contract
        }, tank);

        var languageMessage = _errorMessage['getHashFormBlockChain'];

        if(!formData)
        {
            this.sendError(403, res, `${languageMessage[language]} : ${uniqueNumber}`, 'getContractBalance');
            return;
        }

        var action = formData.action;

        var daynamic = undefined;

        var sendBackObject = {};

        if(action=='save')
        {
            var json = this.modelForm.getFormData(formData, inputProperty);
            daynamic = await this.formHTML.renderingHTML(json, uniqueNumber, formData.language, inputProperty);
            sendBackObject.html = daynamic;
            _.log(`getContractBalance : ${uniqueNumber}, ${action}`); _.log(`getContractBalance : ${uniqueNumber}, ${action}`);
            res.send(JSON.stringify(sendBackObject));
        }
        else if(action == 'submit')
        {
            var agency = await this.redis.getDataWithH('recordAgency', uniqueNumber);

            if(!agency)
            {
                this.sendError(403, res, languageText[language]);
                return;
            }
            var contractObject = await this.redis.hasValuesWithHM(agency);
    
            if(!contract)
            {
                this.sendError(403, res, languageText[language]);
                return;
            }
    
            var uniqueNumberArray = Object.keys(contractObject);
    
            var num = uniqueNumberArray.indexOf(uniqueNumber);
    
            if(num == -1)
            {
                this.sendError(403, res, languageText[language]);
                return;
            }

            try
            {
                sendBackObject['hash'] = await this.theContract.methods.Get(agency, num).call({from: _setting.WALLET_ADDRESS});
            }
            catch(error)
            {
                throw new Error(error);
            }

            sendBackObject['data'] = formData;

            var subPath = `/htmlCache/${contract}.pdf`; //pdf
            var htmlCachePath = _path.join(base_path+`/public/${subPath}`);

            _.log(`getContractBalance : ${uniqueNumber}, ${action}`);
            
            if(!await _fsHelper.fileExistAsync(htmlCachePath))
            {
                var htmlCachePath = await this.submitRendering(formData, htmlCachePath, contract, inputProperty, uniqueNumber);
                sendBackObject.url = subPath;
                res.send(JSON.stringify(sendBackObject));

            }
            else
            {
                sendBackObject.url = subPath;
                res.send(JSON.stringify(sendBackObject));
            }
        }
        else
        {
            this.sendError(403, res, `${languageMessage[language]} : ${uniqueNumber}`, 'getContractBalance');
            return;
        }
    }

    /**
     * gen preview html code with pdf format
     * @param {object} req request
     * @param {object} res response
     */
    async preview(req, res)
    {
        var formData = req.body;
        // var language = this.updatelanguage(params.language);
        // var languageText = _errorMessage['getContractBalance'];
        var tableRecord = formData.tableRecord == undefined || formData.tableRecord == null ? 0 : Number(formData.tableRecord);
        var form_id = formData.form_id;
        var json = this.modelForm.getPDFData(formData, tableRecord);
        var daynamic = await this.formHTML.renderingPDF(json, this.formPage[form_id], undefined, undefined, formData.language, tableRecord);
        _.log(`preview : ${form_id}, ${formData.agency}`);
        res.send(JSON.stringify(daynamic));
    }

    /**
     * make the data to pdf, after return back the url of file
     * @param {Object} formData      data of contract
     * @param {String} htmlCachePath htmlCachePath
     * @param {String} contractName  contract Name
     * @param {Number} inputProperty table record
     * @param {String} uniqueNumber  formData uniqueNumber
     */
    submitRendering(formData, htmlCachePath, contractName, inputProperty, uniqueNumber)
    {
        _.log(`submitRendering : ${htmlCachePath}, ${contractName}`);
        return new Promise((resolve)=>{
            var json = this.modelForm.getPDFData(formData, inputProperty);
            var form_id = formData.form_id;
            var options = { 
                "pageSize": "A4",
                "pageWidth":"595px",
                "pageHeight":"842px",
                "dpi": 300,
            };
            this.formHTML.renderingPDF(json, this.formPage[form_id], undefined, undefined, formData.language, inputProperty, uniqueNumber)
            .then((daynamic)=>{
                a2pClient.headlessChromeFromHtml(daynamic, true, `${contractName}.pdf`, options)
                .then(async (result)=>{
                    var success = await _fsHelper.downloadFile(htmlCachePath, result.pdf);
                    if(success)
                    {
                        resolve(htmlCachePath);
                    }
                })
            })
        })
    }

    /**
     * init the server with console.log
     */
    initServerWithPortCallback()
    {
        _.log(`Listening on port ${process.env.port}`);
    }

    /**
     * get url for redis, it data is save to redis
     * @param {String} shaOneReturnUrl 
     */
    queryUrl(shaOneReturnUrl)
    {
        return new Promise((resolve)=>{
            this.redis.getData(shaOneReturnUrl, (url)=>{
                resolve(url);
            })
        });
    }

    /**
     * gen the unique Number with redis
     * @param {String} day       new Date
     * @param {Number} form_id   which form
     */
    getUniqueNumber(day, form_id)
    {      
        return new Promise((resolve)=>{
            var promiseEvent = [];
            promiseEvent.push(this.redis.incrSN('secondChat', true));
            promiseEvent.push(this.redis.incrSN('firstChat', true));
            promiseEvent.push(this.redis.incrSN('thirdChat', false)); 

            Promise.all(promiseEvent).then( async(result)=>{
                result = _.convectorArrayToObjectWithKey(result);
                var thirdChat =  result['thirdChat'];
                var secondChat = result['secondChat']
                var firstChat =  result['firstChat']
                if( thirdChat >=99999)
                {
                    this.resetCrKey('thirdChat');
                    thirdChat = 1;
                    secondChat = await this.redis.incrSN('secondChat');
                    if(secondChat > 26)
                    {
                        this.resetCrKey('thirdChat');
                        thirdChat = 1;
                        this.resetCrKey('secondChat');
                        secondChat = 1;
                        firstChat = await this.redis.incrSN('firstChat');
                    }
                }
                var charOneStr = String.fromCharCode(firstChat+64);
                var charTwoStr = String.fromCharCode(secondChat+64);

                resolve(charOneStr+charTwoStr+form_id+day+String(thirdChat).padStart(6, '0'));
            })
        })       
    }

    /**
     * gen the uniqueNumber with redis
     * @param {String} uniqueNumber  unique Number for this contract
     * @param {String} agency        agency for this contract
     * @param {Object} unixTime      current time
     */
    getAndupdateHash(uniqueNumber, agency, unixTime)
    {
        return new Promise((resolve)=>{
            var hash = undefined;
            if(!uniqueNumber)
            {
                hash = this.hashFilePath(agency, unixTime.getTime());
                resolve(hash);
            }
            else
            {
                this.redis.getDataWithH('record', uniqueNumber)
                .then((hash)=>{
                    resolve(hash);
                })
            }
        })
    }
    
    /**
     * save the data with mongodb
     * @param {Object} data         client 's upload data
     * @param {Number} form_id      which form
     * @param {Number} tableRecord  the table Record of upload data
     */
    saveData(data, form_id, tableRecord)
    {
        if(data)
        {
            var tank = this.getTanks(tableRecord, form_id);
            var json = new tank(data);
            this.mongodb.insert(json);
        }
    }

    /**
     * update the data with mongodb
     * @param {Object} data         client 's upload data
     * @param {String} uniqueNumber unique Number for this contract
     * @param {String} hash         hash for this contract
     * @param {Number} form_id      which form
     * @param {Number} tableRecord  the table Record of upload data
     */
    async updateData(data, uniqueNumber, hash, form_id, tableRecord)
    {
        if(data)
        {
            var tank = this.getTanks(tableRecord, form_id);
            var hash = await this.redis.getDataWithH('record', uniqueNumber);
            var query = {hash : hash, uniqueNumber : uniqueNumber};
            this.mongodb.update(query, data, tank);
        }
    }

    /**
     * only form 4 and form 6 just update table record for redis
     * @param {String} uniqueNumber  unique Number for this contract
     * @param {Number} form_id       which form
     * @param {Number} tableRecord   the table Record of upload data
     */
    updateTableRecord(uniqueNumber, form_id, tableRecord)
    {
        if(tableRecord != 0){
            if(form_id == 4 || form_id == 6)
            {
                _.log(`update table Record with ${uniqueNumber}, ${form_id}, ${tableRecord}`);
                this.redis.saveData(uniqueNumber, String(tableRecord));
            }
        }
    }

    /**
     * get the contract with before day and after day
     * @param {object} req request
     * @param {object} res response
     */
    async getContracts(req, res)
    {
        var accessUserObject = await this.getAccessUsers({'user' : req.headers["x-kconsultingpro-user"]});
        if(!_.checkHeader(req.headers, _defaultHeader, accessUserObject))
        {
            this.sendError(404, res, 0, 'getContractBalance');
            return;
        }

        var params = _url.parse(req.url, true).query;
        var agency = params.account;
        var before = params.before == undefined || params.before == null ? null : params.before;
        var after  = params.after == undefined || params.after == null ? null : params.after;
        var language = this.updatelanguage(params.language);
        var languageText = _errorMessage['getContracts'];
        var agent = _errorMessage['getAgent'];
        if(!agency)
        {
            this.sendError(403, res, agent[language], 'getContracts');
            return;
        }
        var contractObject = await this.redis.hasValuesWithHM(`${agency}timeRecord`);

        if(!contractObject)
        {
            this.sendError(403, res, `${languageText[language]} : ${agency}`, 'getContracts');
            return;
        }

        _.log(`getContracts:${agency}, ${before}, ${after}`);

        var outputObject = this.renderContractWithDate(this.beforeAndAftercalculate(before, after, contractObject));

        // var outputObject = await this.renderContractWithPDF(`${req.protocol}://${req.headers.host}`, this.beforeAndAftercalculate(before, after, contractObject));


        res.send(JSON.stringify(outputObject));
    }

    /**
     * gen the data between before day and after day
     * @param {Object} before          before this day
     * @param {Object} after           after this day
     * @param {Object} handleObject    redis data
     */
    beforeAndAftercalculate(before, after, handleObject)
    {
        var outputObject = {};
        if(before && after)
        {
            var beforeC = new Date(before);
            var afterC = new Date(after);
            var beforeDay = beforeC.getTime();
            var afterDay = afterC.getTime() + 86400000;
            Object.keys(handleObject).forEach((value)=>{
                var currentTime = Number(value);
                if(currentTime >= beforeDay && currentTime < afterDay)
                {
                    outputObject[value] = handleObject[value];
                }       
            })
        }
        else
        {
            outputObject = handleObject;
        }
        return outputObject;
    }

    /**
     * gen the data localstring
     * @param {object} outputObject day of object 
     */
    renderContractWithDate(outputObject)
    {
        Object.keys(outputObject).forEach((value)=>{
            var currentDay = new Date(Number(value));
            var contractNumber = outputObject[value];
            delete outputObject[value];
            var current = currentDay.toLocaleString();
            if(!outputObject[current])
            {
                outputObject[current] = contractNumber;
            }
        })
        return outputObject;
    }

    /**
     * render contract with pdf
     * @param {String} url        file path
     * @param {object} inputbject redis data
     */
    renderContractWithPDF(url, inputbject)
    {
        return new Promise((resolve)=>{
            var length = Object.keys(inputbject).length;
            var outputObject = {};
            Object.keys(inputbject).forEach((value)=>{
                var currentDay = new Date(Number(value));
                var contractNumber = inputbject[value];
                this.redis.getDataWithH('record', contractNumber)
                .then((contract)=>{
                    var current = currentDay.toLocaleString();
                    if(!outputObject[current])
                    {
                        outputObject[current] = `${url}/htmlCache/${contract}.pdf`;
                    }
                    var outputObjectlength = Object.keys(outputObject).length;
                    if(outputObjectlength >= length)
                    {
                        resolve(outputObject);
                    }
                })
            })
        })
    }

    /**
     * send sha One Return url with res
     * @param {String} shaOneReturnUrl  sha One Return url
     * @param {object} res              response
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

    /**
     * post data with contract
     * @param {object} req request
     * @param {object} res response
     */
    hashCallback(req, res)
    {
        var formData = req.body;
        if(formData)
        {
            var dataHash = _.sha1(JSON.stringify(formData));
        }
        res.send(dataHash);
    }

    /**
     * post data with contract
     * @param {object} req request
     * @param {object} res response
     */
    async contractCallback(req, res)
    {
        var accessUserObject = await this.getAccessUsers({'user' : req.headers["x-kconsultingpro-user"]});
        if(!_.checkHeader(req.headers, _defaultHeader, accessUserObject))
        {
            this.sendError(406, res, 0, 'contractCallback');
            return;
        }

        var formData = req.body;

        // console.log(formData);
        
        if(formData)
        {
            var returnUrl = formData.shaOneReturnUrl;
            var agency = formData.agency;
            var uniqueNumberCache = formData.uniqueNumber;
            var unixTime = new Date();
            var form_id = Number(formData.form_id);
            var tableRecord = formData.tableRecord == undefined || formData.tableRecord == null ? 0 : Number(formData.tableRecord);
            var isNeedToUpdate = false;
            var uniqueNumber = undefined;
            _.log(`form_id :${form_id}, agency:${agency}, tableRecord:${tableRecord}`);
            if(!uniqueNumberCache)
            {
                uniqueNumber = await this.getUniqueNumber(unixTime.getFullYear().toString().substr(-2), form_id);
            }
            else
            {
                uniqueNumber = uniqueNumberCache;
                isNeedToUpdate = true;
            }
            var fileHash = await this.getAndupdateHash(uniqueNumberCache, agency, unixTime);

            formData.hash = fileHash;
            formData.uniqueNumber = uniqueNumber;

            _.log(`uniqueNumber : ${uniqueNumber}, fileHash : ${fileHash}`);

            this.updateTableRecord(uniqueNumber, form_id, tableRecord);

            if(formData.action == 'save')
            {
                _.log(`save draft`);
                if(!isNeedToUpdate){
                    _.log(`save with ${uniqueNumber}, ${form_id}, ${tableRecord}, ${fileHash}, with agency ${agency}`);
                    this.saveData(formData, form_id, tableRecord);
                    this.redis.saveDataWithH('record', uniqueNumber, fileHash);
                    this.redis.saveDataWithH(agency, uniqueNumber, fileHash);    
                    this.redis.saveDataWithH('recordAgency', uniqueNumber, agency);                  
                }
                else
                {
                    _.log(`update with ${uniqueNumber}, ${form_id}, ${tableRecord}, ${fileHash}, with agency ${agency}`);
                    this.updateData(formData, uniqueNumber, fileHash, form_id, tableRecord);
                }
                this.contractEventHandle(returnUrl, res);
            }
            else
            {
                _.log(`submit contract`);
                formData.userSignDate = _moment().format("YYYY-MM-DD");
                if(formData.form_id != 8){
                    formData.agencySignDate = _moment().format("YYYY-MM-DD");
                }
                this.runWeb3Function(formData, agency, isNeedToUpdate, form_id, returnUrl, res);
            }
        }
    }

    /**
     * gen the hash sha 1
     * @param {String} agency       agency of contract data
     * @param {Number} createDay    which day create the contract
     */
    hashFilePath(agency, createDay)
    {
        return _.sha1(agency+'#'+createDay+'#'+_setting.PRIVATE_KEY);
    }

    /**
     * send error to client with res
     * @param {Number} code     error coding with http response
     * @param {Object} res      response
     * @param {String} message  error message
     * @param {String} functionName functionName
     */
    sendError(code, res, message, functionName)
    {
        _.log(`${functionName} error: ${message}`);
        res.status(code).send({ error: message });
    }

    /**
     * 
     * @param {String} dataHash         hash of contract data
     * @param {object} json             contract data
     * @param {String} agency           contract of agency
     * @param {Boolean} isNeedToUpdate  know need to update the contract data 
     * @param {Number} form_id          which form
     * @param {Number} returnUrl        sha One Return url
     * @param {Object} res              response
     */
    async runWeb3Function(json, agency, isNeedToUpdate, form_id, returnUrl, res)
    {
        _.log(`runWeb3Function ${json.uniqueNumber}, ${agency}, ${form_id}`);
        this.handleResToClient(json, isNeedToUpdate, form_id, agency, returnUrl, res);
    }

    /**
     * handle data after method api with update or save
     * if is need to update, just save.
     * if not just update.
     * update table record
     * send finished to client
     * @param {object} json             contract data
     * @param {String} agency           contract of agency
     * @param {Boolean} isNeedToUpdate  know need to update the contract data 
     * @param {Number} form_id          which form
     * @param {Number} returnUrl        sha One Return url
     * @param {Object} res              response
     */
    handleResToClient(json, isNeedToUpdate, form_id, agency, returnUrl, res)
    {
        var tableRecord = json.tableRecord == undefined || json.tableRecord == null ? 0 : Number(json.tableRecord);
        var uniqueNumber = json.uniqueNumber;
        var fileHash = json.hash;
        if(!isNeedToUpdate){
            _.log(`save with ${uniqueNumber}, ${form_id}, ${tableRecord}, ${fileHash}, with agency ${agency}`);
            this.saveData(json, form_id, tableRecord);
            this.redis.saveDataWithH('record', uniqueNumber, fileHash);
            this.redis.saveDataWithH(agency, uniqueNumber, fileHash);    
            this.redis.saveDataWithH('recordAgency', uniqueNumber, agency);                    
        }
        else
        {
            _.log(`update with ${uniqueNumber}, ${form_id}, ${tableRecord}, ${fileHash}, with agency ${agency}`);
            this.updateData(json, uniqueNumber, fileHash, form_id, tableRecord);
        }
        this.updateTableRecord(uniqueNumber, form_id, tableRecord);
        this.submitRendering(json, _path.join(base_path+`/public/htmlCache/${fileHash}.pdf`), fileHash, tableRecord, uniqueNumber);
        this.contractEventHandle(returnUrl, res);
    }

    /**
     * query for access white
     * @param {object} query query
     * @param {connection} connection mongodb connection
     */
    getAccessUsers(query, connection)
    {
        return new Promise((resolve)=>{
            connection.db.collection('accessUsers', (err, collectionObject)=>{
                collectionObject.find(query).toArray((err, data)=>
                {
                    resolve(data[0]);
                })
            })
        })
    }

    /**
     * post data to access white to make which one can login to test the website.
     * this query is save on mongodb 
     * if true, pass correct to the client
     * if false, pass error to the client
     * @param {object} req request
     * @param {object} res response
     */
    async adminCorrect(req, res)
    {
        if(!_.checkHeader(req.headers, _defaultHeader, null))
        {
            this.sendError(404, res, 0, 'adminCorrect');
            return;
        }
        
        var params = _url.parse(req.url, true).query;
        var user = params.user;
        var password = params.password;
        var correct = false;
        if(user &&  password)
        {
            var accessUserObject = await this.getAccessUsers({'user' : user}, this.mongodb.MongooseConnection);
            if(accessUserObject){
                var defaultadmin = accessUserObject.user;
                var defaultPassword = accessUserObject.password;
                if(user === defaultadmin && defaultPassword === password)
                {
                    correct = true;
                }
            }
        }

        _.log(`access User: ${user}`);

        if(correct)
        {
            res.send(String(1));
        }
        else
        {
            this.sendError(401, res, 0, 'adminCorrect');
        }

    }
}

module.exports = controllerWeb3;
