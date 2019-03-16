var formData = {
    //original Array with for form 3/4/5/6
    'textAreaArray'             :   ['additionalLaw', 'agencySignNameLicenseNumber', 'referenceForCompany', 'userAddress', 'agencyAddress', 'reference'],
    'radioButtonArray'          :   ['opening', 'exclusive', 'relationship', 'included', 'showProperty', 'keepProperty', 'watchProperty', 'distributProperty', 'advertisements', 'showRightInterests', 'moneyIncrease'],
    'signatureArray'            :   ['svgUser','svgAgency'],
    //additional Array for from 4,6
    'tableAddKeyTextArea'       :   ['showPropertyName', 'showPropertyDate', 'sellerCommission','buyerCommission'],
    'tableAddKeyRadioButton'    :   ['propertyRelase', 'propertyRelation'],
    'signatureAddKey'           :   ['signature'],
    //not check array for form 3/4/5/6
    'numberFieldArray'          :   ['dollarHK', 'agencyFax', 'agencyPhone', 'userFax', 'userPhone', 'toAgencyMoney', 'propertyPercentage'],
    'DataFieldArray'            :   ['createDay', 'expiresDay', 'userSignDate', 'agencySignDate'],
    'inputFieldArray'           :   ['userEng', 'userChi', 'agency', 'property', 'dollar', 'iDNumber', 'iDBRNumber', 'agencyName', 'agencyNumber', 'user', 'agencyBDN', 'userPosition', 'userBDN'],
    'checkboxArray'             :   ['fiveAgreement', 'propertyFinished', 'salePurchaseAgreement', 'signatureCheck'],
    'selectFieldArray'          :   ['userAgreeSeeProperty', 'userAgreeKeepKey']
}

module.exports = formData;