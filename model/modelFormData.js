'use strict';
let _formData = require(base_path+'/enum/formData.js');
let _formDataEight = require(base_path+'/enum/formDataEight.js');
let _pdfData = require(base_path+'/enum/pdfData.js');
let _pdfDataEight = require(base_path+'/enum/pdfDataEight.js');

class modelFormData
{
    /**
     * 
     */
    constructor()
    {
        
    }

    /**
     * general the data with html id setting form
     * @param {object} formObject   contract data
     * @param {Number} tableRecord  table record of contract data
     */
    getFormData(formObject, tableRecord)
    {
        var formData = {};
        formData.form_id                = formObject.form_id;
        formData.action                 = formObject.action;
        formData.tableRecord            = formObject.tableRecord;
        if(formData.form_id == 8)
        {
            formData.selectFieldObject      = null;
            formData.inputDateFieldObject   = _.generalFormObject(_formDataEight.DataFieldArray, formObject);
            formData.inputNumberFieldObject = _.generalFormObject(_formDataEight.numberFieldArray, formObject);
            formData.inputTextFieldObject   = _.generalFormObject(_formDataEight.inputFieldArray, formObject);
            formData.checkboxObject         = _.generalFormObject(_formDataEight.checkboxArray, formObject);
            formData.textareaObject         = null;
            formData.radioButtonObject      = _.generalFormObject(_formDataEight.radioButtonArray, formObject);
            formData.signatureObject        = _.generalFormObject(_formDataEight.signatureArray, formObject);
        }
        else
        {
            formData.selectFieldObject      = _.generalFormObject(_formData.selectFieldArray, formObject);
            formData.inputDateFieldObject   = _.generalFormObject(_formData.DataFieldArray, formObject);
            formData.textareaObject         = _.generalFormObject(_formData.textAreaArray, formObject);
            formData.checkboxObject         = _.generalFormObject(_formData.checkboxArray, formObject);

            formData.inputNumberFieldObject = _.generalFormObject(_.generalFormArray(tableRecord, _formData.tableAddKeyNumberField, _formData.numberFieldArray), formObject);
            formData.inputTextFieldObject   = _.generalFormObject(_.generalFormArray(tableRecord, _formData.tableAddKeyTextField, _formData.inputFieldArray), formObject);
            formData.radioButtonObject      = _.generalFormObject(_.generalFormArray(tableRecord, _formData.tableAddKeyRadioButton, _formData.radioButtonArray), formObject);
            formData.signatureObject        = _.generalFormObject(_formData.signatureArray, formObject);
        }
        
        return formData;
    }
    
    /**
     * general the data with pdf id setting form
     * @param {object} formObject   contract data
     * @param {Number} tableRecord  table record of contract data
     */
    getPDFData(formObject, tableRecord)
    {
        var formData = {};
        formData.form_id                = formObject.form_id;
        formData.action                 = formObject.action;
        formData.tableRecord            = formObject.tableRecord;
        if(formData.form_id == 8)
        {
            formData.selectFieldObject      = null;
            formData.checkboxObject         = _.generalFormObject(_pdfDataEight.checkboxArray, formObject);
            formData.radioButtonObject      = _.generalFormObject(_pdfDataEight.radioButtonArray, formObject);
            formData.signatureObject        = _.generalFormObject(_pdfDataEight.signatureArray, formObject);
            formData.textFieldObject        = _.generalFormObject(_pdfDataEight.textFieldArray, formObject);
        }
        else
        {
            formData.selectFieldObject      = _.generalFormObject(_pdfData.selectFieldArray, formObject);
            formData.checkboxObject         = _.generalFormObject(_pdfData.checkboxArray, formObject);
            formData.signatureObject        = _.generalFormObject( _pdfData.signatureArray, formObject);
            formData.radioButtonObject      = _.generalFormObject(_.generalFormArray(tableRecord, _pdfData.radioAddKeyTextField, _pdfData.radioButtonArray), formObject);
            formData.textFieldObject        = _.generalFormObject(_.generalFormArray(tableRecord, _pdfData.textAddKeyTextField, _pdfData.textFieldArray), formObject);
        }
        
        return formData;
    }
    
    
    
    
}

module.exports = modelFormData;

