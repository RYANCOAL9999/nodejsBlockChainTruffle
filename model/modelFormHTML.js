'use strict';

let _path           =   require('path');
let _fs             =   require('fs');
let _cheerio        =   require('cheerio');

class modelFormHTML
{
    constructor()
    {
    }

    renderingHTML(fileObject, createDay)
    {

        // var fileObject = JSON.parse(_fs.readFileSync(path, 'utf8'));

        var action                 =    fileObject.action;
        var inputDateFieldObject   =    fileObject.inputDateFieldObject;
        var inputNumberFieldObject =    fileObject.inputNumberFieldObject;
        var inputTextFieldObject   =    fileObject.inputTextFieldObject;
        // var textareaObject         =    fileObject.textareaObject;
        var radioButtonObject      =    fileObject.radioButtonObject;
        var checkboxObject         =    fileObject.checkboxObject;
        // var signatureObject        =    fileObject.signatureObject;

        var form_id = fileObject.form_id;
        var subPath = 'formHTML';
        if(action=='submit')
        {
            subPath = 'formPDF';
        }
        var $ = _cheerio.load(_fs.readFileSync(_path.join(base_path+`/public/${subPath}/form${form_id}.html`), 'utf8'));
        var inputproperty = Number(fileObject.tableRecord);
        var radioButtonIndex = 0;  //form 4
        if(form_id == 6)
        {
            radioButtonIndex = 10;
        }
        if(form_id == 4)
        {
            radioButtonIndex = 11;
        }

        // var radioButtonIndex = 10;  //form 6
        if(inputproperty >= 1 && radioButtonIndex >=10){
            var label = $(`label`);
            var LabelLast = label.length - 1;
            label[LabelLast-1].attribs.for = (Number(label[LabelLast-1].attribs.for) + 5 * inputproperty + 1).toString();
            label[LabelLast].attribs.for = (Number(label[LabelLast].attribs.for) + 5 * inputproperty + 1).toString();

            var radioButton = $('input[type="radio"]');
            var radioButtonLast = radioButton.length - 1;
            radioButton[radioButtonLast-1].attribs.value = (Number(radioButton[radioButtonLast-1].attribs.value) + 5 * inputproperty + 1).toString();
            radioButton[radioButtonLast].attribs.value = (Number(radioButton[radioButtonLast].attribs.value) + 5 * inputproperty + 1).toString();


            for(var i = 0; i < inputproperty;i++)
            {
                var row = $(`<tr>`);
                row.append($(`<td style="width:150px;height:100px;border-style:outset;overflow:hidden"><textarea rows="8" cols="20" id="showPropertyName${i}T" name="showPropertyName${i}"></textarea></td>`))
                .append($(`<td style="width:150px;height:100px;border-style:outset;overflow:hidden"><textarea rows="8" cols="20" id="showPropertyDate${i}T" name="showPropertyDate${i}"></textarea></td>`))
                .append($(`<td style="width:150px;height:100px;border-style:outset;overflow:hidden"><span class="sortOptions"><input type="radio" name="propertyRelase${i}" value=${radioButtonIndex+i} checked><label for=${radioButtonIndex+i}>是</label><input type="radio" name="propertyRelase${i}" value=${radioButtonIndex+i+1}><label for=${radioButtonIndex+i+1}>否</label></span></td>`))
                .append($(`<td style="width:150px;height:100px;border-style:outset;overflow:hidden"><span class="sortOptions"><input type="radio" name="propertyRelation${i}" value=${radioButtonIndex+i+2} checked><label for=${radioButtonIndex+i+2}>單邊代理</label></span><span class="sortOptions"><input type="radio" name="propertyRelation${i}" value=${radioButtonIndex+i+3}><label for=${radioButtonIndex+i+3}>雙邊代理</label><input type="radio" name="propertyRelation${i}" value=${radioButtonIndex+i+4}><label for=${radioButtonIndex+i+4}>有可能代表雙方的代理</label></span></td>`))
                .append($(`<td style="width:150px;height:100px;border-style:outset;overflow:hidden"><textarea rows="8" cols="20" id="sellerCommission${i}T" name="sellerCommission${i}"></textarea></td>`))
                .append($(`<td style="width:150px;height:100px;border-style:outset;overflow:hidden"><textarea rows="8" cols="20" id="buyerCommission${i}T" name="buyerCommission${i}"></textarea></td>`));
                if(action=="save")
                {
                    //render html
                    row.append($(`<td style="width:150px;height:100px;border-style:outset;overflow:hidden"><span class="cls_003"><div id="signature${i}"></div><script type="text/javascript" src="/js/dsSign.js"></script></span></td>`))
                        .append($(`<td style="width:80px;height:100px"><span class="cls_013"><button type="button" class="deletebtn" title="Remove row">X</button></span><span class="cls_003"><input type="button" value="reset" onclick="inputSignReset()"></span></td>`));
                }
                else
                {
                    // render pdf
                    row.append($(`<td style="width:150px;height:100px;border-style:outset;overflow:hidden"><span class="cls_003"><div id="signature${i}"><img src=""></div></span></td>`));
                }
                $("table tbody").append(row);
            }
        }

        var inputTextFieldHTML = $('input[type="text"]');
        var inputNumberFieldHTML = $('input[type="number"]');
        var inputDataFieldHTML = $('input[type="date"]');
        // var textAreaHTML = $('textarea');
        var checkboxHTML = $('input[type="checkbox"]');
        var radioButtonHTML = $('input[type="radio"]');
        // var ImageHTML = $('img');

        //textArea and Image not to do!

        Object.keys(inputTextFieldObject).forEach(function(key, index) {
            if(inputTextFieldHTML[index] && inputTextFieldHTML[index].attribs)
            {
                inputTextFieldHTML[index].attribs.value = inputTextFieldObject[key];
            }
        })

        Object.keys(inputNumberFieldObject).forEach(function(key, index) {
            if(inputNumberFieldHTML[index] && inputNumberFieldHTML[index].attribs)
            {
                inputNumberFieldHTML[index].attribs.value = inputNumberFieldObject[key];
            }
        })

        Object.keys(inputDateFieldObject).forEach(function(key, index) {
            if(inputDataFieldHTML[index] && inputDataFieldHTML[index].attribs)
            {
                inputDataFieldHTML[index].attribs.value = inputDateFieldObject[key];
            }
        })

        Object.keys(checkboxObject).forEach(function(key, index) {
            if(checkboxHTML[index] && checkboxHTML[index].attribs)
            {
                checkboxHTML[index].attribs.checked = "";
            }
        })


        for(var i = 0 ; i < radioButtonHTML.length;i++)
        {
            delete radioButtonHTML[i].attribs.checked;
        }

        Object.keys(radioButtonObject).forEach(function(key) {
            var index = radioButtonObject[key];
            if(radioButtonHTML[index] && radioButtonHTML[index].attribs)
            {
                radioButtonHTML[index].attribs.checked = "";
            }
        })

        //error of textArea and signatureObject

        if(createDay && action == "save")
        {
            var hiddenObject = $('input[type="hidden"]');
            var last = hiddenObject.length - 1;
            hiddenObject[last].attribs.value = createDay;
        }

        return $.html();
    }
}

module.exports = modelFormHTML;