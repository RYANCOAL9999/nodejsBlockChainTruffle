'use strict';
let _formData = require(base_path+'/enum/formData.js');

class modelFormData
{
    constructor(formObject)
    {
        this.form_id                = formObject.form_id;
        this.action                 = formObject.action;
        this.tableRecord            = formObject.tableRecord;
        this.inputDateFieldObject   = _.generalFormObject(_formData.DataFieldArray, formObject);
        this.inputNumberFieldObject = _.generalFormObject(_formData.numberFieldArray, formObject);
        this.inputTextFieldObject   = _.generalFormObject(_formData.inputFieldArray, formObject);
        this.checkboxObject         = _.generalFormObject(_formData.checkboxArray, formObject);
        this.textareaObject         = _.generalFormObject(_.generalFormArray(formObject.tableRecord, _formData.tableAddKeyTextArea, _formData.textAreaArray), formObject);
        this.radioButtonObject      = _.generalFormObject(_.generalFormArray(formObject.tableRecord, _formData.tableAddKeyRadioButton, _formData.radioButtonArray), formObject);
        this.signatureObject        = _.generalFormObject(_.generalFormArray(formObject.tableRecord, _formData.signatureAddKey, _formData.signatureArray), formObject);
    }
}

module.exports = modelFormData;

