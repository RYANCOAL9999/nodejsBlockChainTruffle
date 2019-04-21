/**
 * input new property data.
 * @param {Number} form_id   form id 
 * @param {String} language  language
 */
function insertNewProperty(form_id, language)
{
  if(inputproperty > 10)
  {
    return;
  }
  var keepDataLangugae = keepData[language][form_id];
  
  var div = $(`<div class="row flex-nowrap">`);

  var ul = $(`<ul>`);
  
  var rightTrue = keepDataLangugae["rightTrue"];
  var rightFalse = keepDataLangugae["rightFalse"];
  var relationOne = keepDataLangugae["relationOne"];
  var relationTwo = keepDataLangugae["relationTwo"];
  var relationThree = keepDataLangugae["relationThree"];

  ul.append(`<li> ${keepDataLangugae["property"]} : <input type="text" name="showPropertyName${inputproperty}"></li>`)
    .append(`<li> ${keepDataLangugae["date"]} : <input type="text" name="showPropertyDate${inputproperty}"></li>`)
  .append(`<li> ${keepDataLangugae["right"]} : <span class="sortOptions"><input type="radio" name="propertyRelase${inputproperty}" value="${rightTrue}" checked><label for="${rightTrue}">${rightTrue}</label><input type="radio" name="propertyRelase${inputproperty}" value="${rightFalse}"><label for="${rightFalse}">${rightFalse}</label></span></li>`)
    .append(`<li> ${keepDataLangugae["relation"]} : <span class="sortOptions"><input type="radio" name="propertyRelation${inputproperty}" value="${relationOne}" checked><label for="${relationOne}">${relationOne}</label><input type="radio" name="${relationTwo}" value="${relationTwo}"><label for="${relationTwo}">${relationTwo}</label><input type="radio" name="propertyRelation${inputproperty}" value="${relationThree}"><label for="${relationThree}">${relationThree}</label></span></li>`)
    .append(`<li> ${keepDataLangugae["seller"]} : <input type="text" name="sellerCommission${inputproperty}"></li>`)
    .append(`<li> ${keepDataLangugae["user"]} : <input type="text" name="buyerCommission${inputproperty}"></li>`)
    .append(`<li><button type="button" class="deletebtn" title="Remove row">X</button></li>`);
  div.append(ul);

  $("#myTable").append(div);

  var formDataObject = formData[language][form_id];

  formDataObject[`showPropertyName${inputproperty}`] = keepDataLangugae['showPropertyNameString'];
  formDataObject[`showPropertyDate${inputproperty}`] = keepDataLangugae['showPropertyDateString'];
  formDataObject[`propertyRelase${inputproperty}`]   = keepDataLangugae['propertyRelaseString'];
  formDataObject[`propertyRelation${inputproperty}`] = keepDataLangugae['propertyRelationString'];
  formDataObject[`sellerCommission${inputproperty}`] = keepDataLangugae['sellerCommissionString'];
  formDataObject[`buyerCommission${inputproperty}`]  = keepDataLangugae['buyerCommissionString'];
  inputproperty += 1;
}

/**
 * delete property by self X buttons
 */
$(document).on('click', 'button.deletebtn', function () {
    if(inputproperty > 0)
    {
        inputproperty -= 1;
    }

    var radioButtonIndex = Number($('#radioUpdate1').val());
    if(radioButtonIndex >= 10)
    {
        radioButtonIndex -= 5;
        $('#radioUpdate1')[0].value   = radioButtonIndex;
        $('#radioUpdate2')[0].htmlFor = radioButtonIndex;
        $('#radioUpdate3')[0].value   = radioButtonIndex + 1
        $('#radioUpdate4')[0].htmlFor = radioButtonIndex + 1;

    }
    $(this)[0].parentNode.parentNode.parentNode.parentNode.removeChild($(this)[0].parentNode.parentNode.parentNode);
    return false;
});
