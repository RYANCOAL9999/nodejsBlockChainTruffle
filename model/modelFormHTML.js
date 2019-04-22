'use strict';

let _path           =   require('path');
let _fsHelper       =   require(base_path+'/connection/fsHelper');
let _cheerio        =   require('cheerio');
let _propertyData   =   require(base_path+'/enum/propertyData');
let _propertyadded  =   require(base_path+'/enum/propertyadded');

class modelFormHTML
{
    /**
     * 
     */
    constructor()
    {
    }

    /**
     * inputField include date and text and number, checkBox
     * update input text Field         
     * @param {object} fieldObject     gen form Data
     * @param {object} inputFieldHTML  html data
     * @param {Boolean} isCheckBox     know is checkBox
     */ 
    updateInputFieldHTML(fieldObject, inputFieldHTML, isCheckBox)
    {
        if(fieldObject && inputFieldHTML)
        {
            Object.keys(inputFieldHTML).forEach(function(key, index){
                if(inputFieldHTML[index]){
                    var name = inputFieldHTML[index].attribs.name;
                    if(fieldObject[name])
                    {
                        if(isCheckBox)
                        {
                            inputFieldHTML[index].attribs.checked = "";
                        }
                        else
                        {
                            inputFieldHTML[index].attribs.value = String(fieldObject[name]);
                        }
                    }
                }
            })
        }
    }

    /**
     * update radio button  
     * @param {Object} radioButtonObject  gen form Data
     * @param {Object} radioButtonHTML    html data
     */
    updateRadioButtonHTML(radioButtonObject, radioButtonHTML)
    {
        if(radioButtonObject && radioButtonHTML){
            for(var i = 0 ; i < radioButtonHTML.length;i++)
            {
                delete radioButtonHTML[i].attribs.checked;
            }
            Object.keys(radioButtonHTML).forEach(function(key, index){
                if(radioButtonHTML[index]){
                    var name = radioButtonHTML[index].attribs.name;
                    if(radioButtonObject[name] && radioButtonObject[name] == radioButtonHTML[index].attribs.value)
                    {
                        radioButtonHTML[index].attribs.checked = "";
                    }
                }
            })
        }
    }

    /**
     * textArea and Span and SignatureObject, selectFieldObject
     * @param {Object} fieldObject gen form Data
     * @param {String} idTextArea  string of id  
     * @param {String} type        which type 
     * @param {Object} $           html
     */
    updateFieldHTML(fieldObject, idTextArea, type, $)
    {
        if(fieldObject){
            Object.keys(fieldObject).forEach(function(key) {
                var field = key;
                if(idTextArea)
                {
                    field+= idTextArea;
                }
                var idObject = $(`#${field}`);
                if(idObject){
                    switch (type)
                    {
                        case 'signature':
                        idObject.attr('src', fieldObject[key]);
                        break;
                        case 'textArea':
                        idObject.text(fieldObject[key]).html();
                        break;
                        // case 'span' :
                        // var text = " "+fieldObject[key] + " ";
                        // idObject.text(text).html();
                        // break;
                        case 'select':
                        idObject.val(fieldObject[key]).html();
                        break;
                    }
                }
            })
        }
    }

    /**
     * update Span Object
     * @param {Object} fieldObject gen form Data
     * @param {String} language    language
     * @param {Object} $           html  
     */
    updateSpan(fieldObject, language, $)
    {
        if(fieldObject){
            Object.keys(fieldObject).forEach(function(key) {
            var idObject = $(`#${key}`);
                if(idObject){
                    var text = "";
                    if(language == 'eng'){
                        text = " "+fieldObject[key] + " ";
                    }
                    else
                    {
                        text = fieldObject[key];
                    }
                    idObject.text(text).html();
                }
            })
        }
    }

    /**
     * render HTML
     * @param {Object} fileObject    gen form Data
     * @param {String} createDay     uniqueNumber
     * @param {String} language      contract language
     * @param {Number} inputproperty table Record of contract
     */
    renderingHTML(fileObject, createDay, language, inputproperty)
    {
        return new Promise( async(resolve)=>{
            // var action                 =    fileObject.action;
            var inputDateFieldObject   =    fileObject.inputDateFieldObject;
            var inputNumberFieldObject =    fileObject.inputNumberFieldObject;
            var inputTextFieldObject   =    fileObject.inputTextFieldObject;
            var textareaObject         =    fileObject.textareaObject;
            var radioButtonObject      =    fileObject.radioButtonObject;
            var checkboxObject         =    fileObject.checkboxObject;
            var selectFieldObject      =    fileObject.selectFieldObject;
            // var signatureObject        =    fileObject.signatureObject;

            var form_id = fileObject.form_id;

            var filePath = `/public/formHTML/form${form_id}`;
            if(language == 'eng')
            {
                filePath += 'eng';
            }

            var _propertyObject = _propertyadded[language];

            var keepDataLangugae = _propertyData[language][form_id];

            var $ = _cheerio.load(await _fsHelper.readFileAsync(_path.join(base_path+`${filePath}.html`), 'utf8'));
            
            if(inputproperty >= 1){
                for(var i = 0; i < inputproperty;i++)
                {
                    var div = $(`<div class="row flex-nowrap">`);
                    var ul = $(`<ul>`);

                    ul.append(`<li> ${keepDataLangugae["property"]} : <input type="text" name="showPropertyName${i}" size="50"></li>`)
                    .append(`<li> ${keepDataLangugae["date"]} : <input type="text" name="showPropertyDate${i}"></li>`)
                    .append(`<li> ${keepDataLangugae["right"]} : <span class="sortOptions"><input type="radio" name="propertyRelase${i}" value="${_propertyObject['propertyRelaseTrue']}" checked><label for="${_propertyObject['propertyRelaseTrue']}">${_propertyObject['propertyRelaseTrue']}</label><input type="radio" name="propertyRelase${i}" value="${_propertyObject['propertyRelasefalse']}"><label for="${_propertyObject['propertyRelasefalse']}">${_propertyObject['propertyRelasefalse']}</label></span></li>`)
                    .append(`<li> ${keepDataLangugae["relation"]} <span class="sortOptions"><input type="radio" name="propertyRelation${i}" value="${_propertyObject['propertyRelationSingle']}" checked><label for="${_propertyObject['propertyRelationSingle']}">${_propertyObject['propertyRelationSingle']}</label><input type="radio" name="propertyRelation${i}" value="${_propertyObject['propertyRelationMutli']}"><label for="${_propertyObject['propertyRelationMutli']}">${_propertyObject['propertyRelationMutli']}</label><input type="radio" name="propertyRelation${i}" value="${_propertyObject['propertyRelationMany']}"><label for="${_propertyObject['propertyRelationMany']}">${_propertyObject['propertyRelationMany']}</label></span></li>`)
                    .append(`<li> ${keepDataLangugae["seller"]} : <input type="text" id="amount" name="sellerCommission${i}"></li>`)
                    .append(`<li> ${keepDataLangugae["user"]} : <input type="text" id="amount" name="buyerCommission${i}"></li>`)
                    .append(`<li><button type="button" class="deletebtn" title="Remove row">X</button></li>`);
                    div.append(ul);
                    $("#myTable").append(div);
                }
            }

            var inputTextFieldHTML = $('input[type="text"]');
            var inputNumberFieldHTML = $('input[type="number"]');
            var inputDataFieldHTML = $('input[type="date"]');
            var checkboxHTML = $('input[type="checkbox"]');
            var radioButtonHTML = $('input[type="radio"]');

            this.updateInputFieldHTML(inputTextFieldObject, inputTextFieldHTML, false);
            this.updateInputFieldHTML(inputNumberFieldObject, inputNumberFieldHTML, false);
            this.updateInputFieldHTML(inputDateFieldObject, inputDataFieldHTML, false);
            this.updateInputFieldHTML(checkboxObject, checkboxHTML, true);
            this.updateFieldHTML(textareaObject, 'T', 'textArea', $);
            this.updateFieldHTML(selectFieldObject, null, 'select', $);
            this.updateRadioButtonHTML(radioButtonObject, radioButtonHTML);

            $('#uniqueNumber').text(createDay.toString());
            resolve($.html());
        });
    }

    /**
     * append div
     * @param {Object} $          html
     * @param {String} subtext    text
     * @param {String} index      key
     */
    divAppendForm($, subtext, index)
    {
        // console.log($(`#${index}`));
        $(`#${index}`).append(subtext);
    }

    /**
     * append div with mongodb
     * @param {Object} pdfDataLan mongodb data
     * @param {String} key        id
     * @param {Object} $          html
     * @param {String} startFor   ol start for
     */
    pdfAppendForm(pdfDataLan, key, $, startFor)
    {
        var formData = $(`#${key}`);
        var text = `<ol type="1" start="${startFor}">`;
        for(var key in pdfDataLan)
        {
            var subtext = pdfDataLan[key];
            if(key == 'signature')
            {
                // this.divAppendForm($, subtext, 'twoPage');
                continue;
            }
            text += `<li>${key}<br/>`;
            text += subtext.join('');
            text += `</li>`;
        }

        text += `</ol>`;
        // formData.append(text);
        formData.prepend(text);
    }

    /**
     * rendering pdf
     * @param {Object} fileObject    formData
     * @param {Object} formOnePage   mongodb data
     * @param {Object} formTwoPage   mongodb data
     * @param {Object} formThreePage mongodb data 
     * @param {String} language      formData language
     * @param {Number} inputproperty formdata tableRecord
     */
    renderingPDF(fileObject, formOnePage, formTwoPage, formThreePage, language, inputproperty)
    { 
        return new Promise( async(resolve)=>{
            var form_id = fileObject.form_id;

            var filePath = `/public/formPDF/form${form_id}`;
            if(language == 'eng')
            {
                filePath += 'eng';
            }

            var $ = _cheerio.load(await _fsHelper.readFileAsync(_path.join(base_path+`${filePath}.html`), 'utf8')); 
            var pdfDataLanOne = formOnePage[language];

            if(form_id != 8){
                this.pdfAppendForm(pdfDataLanOne, 'formOnePage', $, 1);
                // this.pdfAppendForm(formTwoPage[language], 'formTwoPage', $, Object.keys(pdfDataLanOne).length + 1);
            }

            if(inputproperty >= 1){

                for(var i = 0; i < inputproperty;i++)
                {
                    var row = $(`<tr>`);
                    row.append(`<td style="width:500px;height:100px;border-style:outset;overflow:hidden"><span class="cls_003" id="showPropertyName${i}" style="color:lightblue;text-decoration:underline;"></span></td>`)
                       .append(`<td style="width:200px;height:100px;border-style:outset;overflow:hidden"><span class="cls_003" id="showPropertyDate${i}" style="color:lightblue;text-decoration:underline;"></span></td>`)
                       .append(`<td style="width:200px;height:100px;border-style:outset;overflow:hidden"><span class="cls_003" id="propertyRelase${i}" style="color:lightblue;text-decoration:underline;"></span></td>`)
                       .append(`<td style="width:200px;height:100px;border-style:outset;overflow:hidden"><span class="cls_003" id="propertyRelation${i}" style="color:lightblue;text-decoration:underline;"></span></td>`)
                       .append(`<td style="width:200px;height:100px;border-style:outset;overflow:hidden"><span class="cls_003" id="sellerCommission${i}" style="color:lightblue;text-decoration:underline;"></span></td>`)
                       .append(`<td style="width:200px;height:100px;border-style:outset;overflow:hidden"><span class="cls_003" id="buyerCommission${i}" style="color:lightblue;text-decoration:underline;"></span></td>`);
                    $("table tbody").append(row);
                }
            }

            var textFieldObject        =    fileObject.textFieldObject;
            var checkboxObject         =    fileObject.checkboxObject;
            var signatureObject        =    fileObject.signatureObject;

            var checkboxHTML = $('input[type="checkbox"]');


            // this.updateFieldHTML(textFieldObject, null, 'span', $);
            this.updateSpan(textFieldObject, language, $);
            this.updateInputFieldHTML(checkboxObject, checkboxHTML, true);
            this.updateFieldHTML(signatureObject, null, 'signature', $);
            resolve($.html());
        });
    }




}

module.exports = modelFormHTML;
