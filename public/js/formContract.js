//function can not be init submit and cancel
function insertNewProperty()
{
    var radioButtonIndex = Number($('#radioUpdate1').val());
    //event listeners
    var row = $(`<tr>`);
    row.append($(`<td style="width:150px;height:100px;border-style:outset;overflow:hidden"><textarea rows="8" cols="20" id="showPropertyName${inputproperty}T" name="showPropertyName${inputproperty}"></textarea></td>`))
       .append($(`<td style="width:150px;height:100px;border-style:outset;overflow:hidden"><textarea rows="8" cols="20" id="showPropertyDate${inputproperty}T" name="showPropertyDate${inputproperty}"></textarea></td>`))
       .append($(`<td style="width:150px;height:100px;border-style:outset;overflow:hidden"><span class="sortOptions"><input type="radio" name="propertyRelase${inputproperty}" value=${radioButtonIndex} checked><label for=${radioButtonIndex}>是</label><input type="radio" name="propertyRelase${inputproperty}" value=${radioButtonIndex+1}><label for=${radioButtonIndex+1}>否</label></span></td>`))
       .append($(`<td style="width:150px;height:100px;border-style:outset;overflow:hidden"><span class="sortOptions"><input type="radio" name="propertyRelation${inputproperty}" value=${radioButtonIndex+2} checked><label for=${radioButtonIndex+2}>單邊代理</label></span><span class="sortOptions"><input type="radio" name="propertyRelation${inputproperty}" value=${radioButtonIndex+3}><label for=${radioButtonIndex+3}>雙邊代理</label><input type="radio" name="propertyRelation${inputproperty}" value=${radioButtonIndex+4}><label for=${radioButtonIndex+4}>有可能代表雙方的代理</label></span></td>`))
       .append($(`<td style="width:150px;height:100px;border-style:outset;overflow:hidden"><textarea rows="8" cols="20" id="sellerCommission${inputproperty}T" name="sellerCommission${inputproperty}"></textarea></td>`))
       .append($(`<td style="width:150px;height:100px;border-style:outset;overflow:hidden"><textarea rows="8" cols="20" id="buyerCommission${inputproperty}T" name="buyerCommission${inputproperty}"></textarea></td>`))
       .append($(`<td style="width:150px;height:100px;border-style:outset;overflow:hidden"><span class="cls_003"><div id="signature${inputproperty}"></div><script type="text/javascript" src="/js/dsSign.js"></script></span></td>`))
       .append($(`<td style="width:80px;height:100px"><span class="cls_013"><button type="button" class="deletebtn" title="Remove row">X</button></span><span class="cls_003"><input type="button" value="reset" onclick="inputSignReset()"></span></td>`));
    $("#myTable tbody").append(row);
    radioButtonIndex += 4;

    $('#radioUpdate1')[0].value   =  radioButtonIndex + 1;
    $('#radioUpdate2')[0].htmlFor =  radioButtonIndex + 1;
    $('#radioUpdate3')[0].value   =  radioButtonIndex + 2;
    $('#radioUpdate4')[0].htmlFor =  radioButtonIndex + 2;

    inputproperty += 1;
    radioButtonIndex += 2;
    
}


$(document).on('click', 'button.deletebtn', function () {
    if(inputproperty > 0)
    {
        inputproperty -= 1;
    }
    if(radioButtonIndex >= 10)
    {
        radioButtonIndex -=4;
        $('#radioUpdate1')[0].value   = radioButtonIndex -2;
        $('#radioUpdate2')[0].htmlFor = radioButtonIndex -2;
        $('#radioUpdate3')[0].value   = radioButtonIndex -1;
        $('#radioUpdate4')[0].htmlFor = radioButtonIndex -1;

        radioButtonIndex -= 2;

    }
    $(this).closest('tr').remove();
    return false;
});
