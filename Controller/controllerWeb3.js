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
let _Mongoose       =   require('mongoose');
let _moment         =   require('moment');
let _api2Pdf        =   require('api2pdf');
let _errorMessage   =   require(base_path+'/enum/errorMessage');
let a2pClient       =   new _api2Pdf('ba28d6a8-b161-416a-8bba-7828fe14c192');

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
        this.modelForm = new _modelForm();
        this.theContract = new this.web3.eth.Contract(_HashBlockJson.abi, _setting.CONTRACT_ADDRESS);
        this.tankObject = {};
        this.connection = _Mongoose.connection;
        // connection.db.collection('formOnePage', (err, collectionObject)=>{
        //     collectionObject.find({}).toArray((err, data)=>
        //     {
        //         this.formOnePage = data[0];
        //     })
        // })
        // connection.db.collection('formTwoPage', (err, collectionObject)=>{
        //     collectionObject.find({}).toArray((err, data)=>
        //     {
        //         this.formTwoPage = data[0];
        //     })
        // })

        this.connection.db.collection('form', (err, collectionObject)=>{
            collectionObject.find({}).toArray((err, data)=>
            {
                this.formPage = data[0];
            })
        })


        // connection.db.collection('formThreePage', (err, collectionObject)=>{
        //     collectionObject.find({}).toArray((err, data)=>
        //     {
        //         this.formThreePage = data[0];
        //     })
        // })
    }

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
            "language" : String
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
                "propertyblock":String,
                "propertyCat":String,
                "propertyDate":String,
                "propertyflat":String,
                "propertyfloor":String,
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
                "rejectForDirectMarket" : String,
                "rejectForLoanReferral" : String,
                "rejectForSendData" : String,
                "propertyOffPlan" : String,
                "hash" : String,
                "userSignDate" : String
            };
        }
        return object;
    }

    loadIndexhtml(req, res)
    {
        res.sendFile(_path.join(base_path+'/public/index.html'));
    }

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
            this.sendError(403, res, languageText[language]);
            return;
        }
        var html = await _fsHelper.readFileAsync(path, 'utf8');
        var params = _url.parse(req.url, true).query;
        if(params.returnUrl)
        {
            path = await this.genContentContract(params, html);
        }
        res.sendFile(path);
    }

    loadfrom3(req, res)
    {
        this.loadFile(req, res, 3);
    }

    loadfrom4(req, res)
    {
        this.loadFile(req, res, 4);
    }

    loadfrom5(req, res)
    {
        this.loadFile(req, res, 5);
    }

    loadfrom6(req, res)
    {
        this.loadFile(req, res, 6);
    }

    loadfrom8(req, res)
    {
        this.loadFile(req, res, 8);
    }

    loadfrom3Eng(req, res)
    {
        this.loadFile(req, res, 3, 'eng');
    }

    loadfrom4Eng(req, res)
    {
        this.loadFile(req, res, 4, 'eng');
    }

    loadfrom5Eng(req, res)
    {
        this.loadFile(req, res, 5, 'eng');
    }

    loadfrom6Eng(req, res)
    {
        this.loadFile(req, res, 6, 'eng');
    }

    loadfrom8Eng(req, res)
    {
        this.loadFile(req, res, 8, 'eng');
    }

    loadGetForm(req, res)
    {
        res.sendFile(_path.join(base_path+'/public/getForm.html'));
    }

    resSendWithString(res, data)
    {
        res.send(JSON.stringify(data)); 
    }

    updatelanguage(language)
    {
        if(!language)
        {
            language = 'eng';
        }
        return language;
    }

    async getContractBalanceByAgent(req, res)
    {
        var params = _url.parse(req.url, true).query;
        var agency = params.account;
        var language = this.updatelanguage(params.language);
        var languageText = _errorMessage['getContractBalanceByAgent'];
        if(!agency)
        {
            this.sendError(403, res, languageText[language]);
            return;
        }

        var contract = await this.redis.hasValuesWithHM(agency);

        if(!contract)
        {
            this.sendError(403, res, languageText[language]);
            return;
        }

        var uniqueNumberArray = Object.keys(contract);
        
        var data = {};

        data["contract"] = uniqueNumberArray;

        res.send(JSON.stringify(data));
    }

    async getHashFormBlockChain(req, res)
    {
        var params = _url.parse(req.url, true).query;
        var uniqueNumber = params.uniqueNumber;
        var agency = params.account;

        var language = this.updatelanguage(params.language);
        var languageText = _errorMessage['getHashFormBlockChain'];
        if(!uniqueNumber || !agency)
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

        var num = uniqueNumberArray.includes(uniqueNumber);

        if(num == -1)
        {
            this.sendError(403, res, languageText[language]);
            return;
        }
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



    async getContractBalance(req, res)
    {
        var params = _url.parse(req.url, true).query;
        var uniqueNumber = params.uniqueNumber;
        var language = this.updatelanguage(params.language);
        var languageText = _errorMessage['getContractBalance'];
        if(!uniqueNumber)
        {
            this.sendError(403, res, languageText[language]);
            return;
        }

        var inputPropertyCurrent = await this.redis.getData(uniqueNumber);

        var contract = await this.redis.getDataWithH('record', uniqueNumber);

        if(!contract)
        {
            this.sendError(403, res, languageText[language]);
            return;
        }

        var inputProperty = inputPropertyCurrent == undefined || inputPropertyCurrent == null ? 0: Number(inputPropertyCurrent);

        var search = uniqueNumber.split("");
        
        var form_id = Number(search[2]);

        var tank = this.getTanks(inputProperty, form_id);

        var formData = await this.mongodb.search({
            hash: contract
        }, tank);

        if(!formData)
        {
            this.sendError(403, res, languageText[language]);
            return;
        }

        var action = formData.action;

        var daynamic = undefined;

        var data = {};

        if(action=='save')
        {
            var json = this.modelForm.getFormData(formData, inputProperty);
            daynamic = await this.formHTML.renderingHTML(json, uniqueNumber, formData.language, inputProperty);
            data.html = daynamic;
            res.send(JSON.stringify(data));
        }
        else if(action == 'submit')
        {
            var subPath = `/htmlCache/${contract}.pdf`; //pdf
            var htmlCachePath = _path.join(base_path+`/public/${subPath}`);
            
            if(!await _fsHelper.fileExistAsync(htmlCachePath))
            {
                var htmlCachePath = await this.submitRendering(formData, htmlCachePath, contract, inputProperty);
                data.url = subPath;
                res.send(JSON.stringify(data));
            }
            else
            {
                data.url = subPath;
                res.send(JSON.stringify(data));
            }
        }
        else
        {
            this.sendError(403, res, languageText[language]);
            return;
        }
    }

    submitRendering(formData, htmlCachePath, contractName, inputProperty)
    {
        return new Promise((resolve)=>{
            var json = this.modelForm.getPDFData(formData, inputProperty);
            var form_id = formData.form_id;
            var options = { 
                "pageSize": "A4",
                "pageWidth":"595px",
                "pageHeight":"842px"
            };
            this.formHTML.renderingPDF(json, this.formPage[form_id], undefined, undefined, formData.language, inputProperty)
            .then((daynamic)=>{
                // console.log(daynamic);
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

    getUniqueNumber(day, form_id)
    {      
        return new Promise((resolve)=>{
            var promiseEvent = [];
            promiseEvent.push(this.redis.incrSN('secondChat', true));
            promiseEvent.push(this.redis.incrSN('firstChat', true));
            promiseEvent.push(this.redis.incrSN('thirdChat', false)); 

            Promise.all(promiseEvent).then( async(result)=>{
                result = _.convectorArrayToObjectWithKey(result);
    
                console.log(result);
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
    
    saveData(data, form_id, tableRecord)
    {
        if(data)
        {
            var tank = this.getTanks(tableRecord, form_id);
            var json = new tank(data);
            this.mongodb.insert(json);
        }
    }

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

    updateTableRecord(uniqueNumber, form_id, tableRecord)
    {
        if(form_id == 4 || form_id == 6)
        {
            this.redis.saveData(uniqueNumber, String(tableRecord));
        }
    }

    async getContracts(req, res)
    {
        var params = _url.parse(req.url, true).query;
        var agency = params.account;
        var before = params.before;
        var after  = params.after;
        var language = this.updatelanguage(params.language);
        var languageText = _errorMessage['getContracts'];
        if(!agency)
        {
            this.sendError(403, res, languageText[language]);
            return;
        }
        var contractObject = await this.redis.hasValuesWithHM(`${agency}timeRecord`);

        if(!contractObject)
        {
            this.sendError(403, res, languageText[language]);
            return;
        }

        var outputObject = this.renderContractWithDate(this.beforeAndAftercalculate(before, after, contractObject));

        // var outputObject = await this.renderContractWithPDF(`${req.protocol}://${req.headers.host}`, this.beforeAndAftercalculate(before, after, contractObject));


        res.send(JSON.stringify(outputObject));
    }

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

    async contractCallback(req, res)
    {
        var formData = req.body;

        console.log(formData);
        
        if(formData)
        {
            var returnUrl = formData.shaOneReturnUrl;
            var agency = formData.agency;
            var uniqueNumberCache = formData.uniqueNumber;
            var dataHash = _.sha1(JSON.stringify(formData));
            var unixTime = new Date();
            var form_id = Number(formData.form_id);
            var tableRecord = formData.tableRecord == undefined || formData.tableRecord == null ? 0 : Number(formData.tableRecord);
            var isNeedToUpdate = false;
            var uniqueNumber = undefined;
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

            if(tableRecord){
                this.updateTableRecord(uniqueNumber, form_id, tableRecord);
            }

            if(formData.action == 'save')
            {
                if(!isNeedToUpdate){
                    this.saveData(formData, form_id, tableRecord);
                    this.redis.saveDataWithH('record', uniqueNumber, fileHash);
                    this.redis.saveDataWithH(agency, uniqueNumber, fileHash);             
                }
                else
                {
                    this.updateData(formData, uniqueNumber, fileHash, form_id, tableRecord);
                }
                this.contractEventHandle(returnUrl, res);
            }
            else
            {
                formData.userSignDate = _moment().format("YYYY-MM-DD");
                if(formData.form_id != 8){
                    formData.agencySignDate = _moment().format("YYYY-MM-DD");
                }
                this.runWeb3Function(dataHash, formData, agency, isNeedToUpdate, form_id, returnUrl, res);
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

    async runWeb3Function(dataHash, json, agency, isNeedToUpdate, form_id, returnUrl, res)
    {
        var uniqueNumber = json.uniqueNumber;
        var contractObject = await this.redis.hasValuesWithHM(agency);
        var num = 0;
        if(contractObject)
        {
            num = Object.keys(contractObject).indexOf(uniqueNumber);
        }

        var language = this.updatelanguage(json.language);
        var languageText = _errorMessage['runWeb3Function'];

        var method_call_abi = await this.theContract.methods.UploadHash(agency, num, dataHash).encodeABI();
        if(!method_call_abi)
        {
            this.sendError(403, res, languageText[language]);
            return;
        }

        this.handleResToClient(json, isNeedToUpdate, form_id, agency, returnUrl, res);
        this.handleSendTransaction(method_call_abi);
    }

    handleResToClient(json, isNeedToUpdate, form_id, agency, returnUrl, res)
    {
        var tableRecord = json.tableRecord == undefined || json.tableRecord == null ? 0 : Number(json.tableRecord);
        var uniqueNumber = json.uniqueNumber;
        var fileHash = json.hash;
        if(!isNeedToUpdate){
            this.saveData(json, form_id, tableRecord);
            this.redis.saveDataWithH('record', uniqueNumber, fileHash);
            this.redis.saveDataWithH(agency, uniqueNumber, fileHash);       
        }
        else
        {
            this.updateData(json, uniqueNumber, fileHash, form_id, tableRecord);
        }
        this.updateTableRecord(uniqueNumber, form_id, tableRecord);
        this.contractEventHandle(returnUrl, res);
    }

    async handleSendTransaction(method_call_abi)
    {
        var from_addr = _setting.WALLET_ADDRESS;
        var contract_addr = _setting.CONTRACT_ADDRESS;

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
        if(!confirmSendSignTransaction)
        {
            this.handleSendTransaction(method_call_abi);
        }
    }

    getAccessUsers(query)
    {
        return new Promise((resolve)=>{
            this.connection.db.collection('accessUsers', (err, collectionObject)=>{
                collectionObject.find(query).toArray((err, data)=>
                {
                    resolve(data[0]);
                })
            })
        })
    }

    async adminCorrect(req, res)
    {
        var params = _url.parse(req.url, true).query;
        var user = params.user;
        var password = params.password;
        var correct = false;
        if(user &&  password)
        {
            var accessUserObject = await this.getAccessUsers({'user' : user});
            if(accessUserObject){
                var defaultadmin = accessUserObject.user;
                var defaultPassword = accessUserObject.password;
                if(user === defaultadmin && defaultPassword === password)
                {
                    correct = true;
                }
            }
        }

        if(correct)
        {
            res.send(String(1));
        }
        else
        {
            this.sendError(403, res, 0);
        }

    }
}

module.exports = controllerWeb3;
