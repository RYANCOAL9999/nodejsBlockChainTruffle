var inputproperty = 0;

/**
 * get Hash by server
 * @param {Object} data Any data need to encryted
 */
function getHash(data){
    return new Promise((resolve)=>{
        $.ajax({
            type: 'post',
            url: '/hash',
            data: data,
            success: function (hash) {
                resolve(hash);
            }
        });    
    })
}

/**
 * get num by server
 * @param {String} agency        formData agency
 * @param {String} uniqueNumber  formData uniqueNumber
 */
function getNum(agency, uniqueNumber)
{
    var num = 0;
    return new Promise((resolve)=>{
        $.ajax({
            type: 'get',
            url: '/api/users/agency',
            data: `account=${agency}`,
            success: function (contractObject) {
                var uniqueNumberArray = contractObject["contract"];
                if(uniqueNumberArray)
                {
                    num = uniqueNumberArray.indexOf(uniqueNumber);
                    if(num == -1)
                    {
                        num = uniqueNumberArray.length;
                    }
                    resolve(num);
                }
                else
                {
                    resolve(num);
                }
            },
            error: function (data) {
                resolve(num);
            }
        });     
    })
}

/**
 * submit contract with data with confirm button and only the agency checking!
 * @param {Number} form_id  form id
 * @param {String} language language
 */
function submitContract(form_id, language)
{
    var action = 'submit';
    var url = '/process';
    var data = $(`#form${form_id}Letter`).serialize();

    if($(`#referenceForCompanyT`).val()!='')
    {
        formData[language][form_id]['userBDN'] = `${formUser[language][form_id]}`;
    };

    var stringformId= 'threeToSix';
    if(form_id == 8)
    {
        stringformId = '8';
    }

    var message = validation(form_id, language);

    if(!message)
    {
        message += validationCheckBox(stringformId, language);
    }

    if(!message)
    {
        var correct = confirm(buttonEvent[language]["submitCorrect"])

        if(!correct)
        {
            return;
        }

        var agency = document.getElementsByName('agency')[0].value;
        var uniqueNumber = $('#uniqueNumber').text;
        getNum(agency, uniqueNumber).then((num)=>{
            getHash(data).then((hash)=>{
                contract.methods.UploadHash(agency, num, hash).send({from: WALLET_ADDRESS}).then((result)=>{
                    console.log(result);
                    if(result){
                        data += `&documentHash=${hash}`;
                        console.log(data);
                        saveContract(form_id, language, url, data, action, function(data)
                        {
                            if(data)
                            {
                                location.href = data.returnUrl == '' || data.returnUrl == undefined ? '../../../' : data.returnUrl;
                            }
                            else
                            {
                                alert(buttonEvent[language]["submitError"]);
                            }
                        });
                    }
                })
            })
        })
    }
    else
    {
        alert(message);
    }
}

/**
 * validation check for check box
 * @param {Number} id        form id
 * @param {String} language  language
 */
function validationCheckBox(id, language)
{
    var message = '';
    var beforeMessage = checkBox[language]["beforeMessage"];
    var afterMessage = checkBox[language]["afterMessage"];
    var data = checkBox[language][id];

    for(var key in data)
    {
        var nameArray = data[key];
        var index = 0;
        var checkBoxZero = document.forms["formNewsLetter"][nameArray[index]];
        var correctZero = false
        var checkBoxOne = document.forms["formNewsLetter"][nameArray[index+1]];
        var correctOne = false;
        if(checkBoxZero && checkBoxZero.checked)
        {
            correctZero = true;
        }
        if(checkBoxOne && checkBoxOne.checked)
        {
            correctOne = true;
        }
        if(correctZero && correctOne){}
        else if(!correctZero && correctOne){}
        else if(correctZero && !correctOne){}
        else
        {
            message = `${beforeMessage} ${key}${afterMessage}`;
            break;
        }
    }
    return message;
}

/**
 * validation for input felid
 * @param {Number} id        form id
 * @param {String} language  language
 */
function validation(id, language)
{
    var message = '';
    var data = formData[language][id];
    var sign = signData[language][id];
    data['svgUser'] = sign['svgUser'];
    if(id != 8){
        data['svgAgency'] = sign['svgAgency'];
    }
    for(var name in data)
    {
        if(name == 'iDNumber')
        {
            if(!document.forms["formNewsLetter"][name].value || typeof document.forms["formNewsLetter"][name].value == "number")
            {
                message = data[name];
                break;
            }
        }
        else
        {
            var formName = document.forms["formNewsLetter"][name];
            if(formName)
            {
                if(formName.value == "")
                {
                    message = data[name];
                    break;
                }
            }
        }
    }
    return message;
}

/**
 * save Contract 
 * @param {Number} form_id    form id
 * @param {String} language   language
 * @param {String} url        return url
 * @param {Object} data       submitted data
 * @param {String} action     sumitted action
 * @param {Function} callback callback Function
 */
function saveContract(form_id, language, url, data, action, callback)
{
    callback = callback == null || callback == undefined ? null : callback;

    if(callback == null)
    {
        if(document.forms["formNewsLetter"]['agency'].value== '')
        {
            alert(buttonEvent[language]["agencyNotInput"]);
            return;
        }

        var correct = confirm(buttonEvent[language]["saveCorrect"]);
        if(!correct)
        {
            return;
        }
    }

    var form = $(`#form${form_id}Letter`);

    if(!url)
    {
        url = form.attr('action');
    }

    if(!data)
    {
        data = form.serialize();
    }

    inputproperty = $("#myTable").children().length == 0 ? 0 : $("#myTable")[0].childElementCount;

    if(inputproperty != 0)
    {   
        data += `&tableRecord=${inputproperty}`;
    }
       
    if(!action)
    {
        action = 'save';
    }

    data += `&form_id=${form_id}`;

    var uniqueNumber = $('#uniqueNumber').text();

    var res = uniqueNumber.match(buttonEvent[language]['form']);

    if(!res)
    {
        data += `&uniqueNumber=${uniqueNumber}`;
    }
    // data += `&form_name=${formName[form_id]}`;
    
    data += `&action=${action}`;
    
    data += `&language=${language}`;
    
    if(form_id == 3 || form_id == 5 )
    {
        var userAgreeSeeProperty = $('select[id=userAgreeSeeProperty]').val();
        var userAgreeKeepKey = $('select[id=userAgreeKeepKey]').val();

        data += `&userAgreeSeeProperty=${userAgreeSeeProperty}`;
        data += `&userAgreeKeepKey=${userAgreeKeepKey}`;
    }
    
    $.ajax({
        type: form.attr('method'),
        url: url,
        data: data,
        success: function (data) {
            data = JSON.parse(data);
            if(action == 'submit')
            {
                callback(data);
            }
            else
            {
                location.href = data.returnUrl == '' || data.returnUrl == undefined ? '../../../' : data.returnUrl;
            }
        },
        error: function (data) {
            alert(buttonEvent[language]["submitError"]);
        },
    });
}

/**
 * reload pages
 * @param {String} language language 
 */
function playReset(language)
{
    var correct = confirm(buttonEvent[language]["resetCorrect"])
    if(!correct)
    {
        return;
    }

    window.location.reload();
}
