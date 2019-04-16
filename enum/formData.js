var formData = {
    //original Array with for form 3/4/5/6
    'inputFieldArray'           :   ['userEng',
                                     'userChi',
                                     'agency',
                                     'property',
                                     'dollar',
                                     'dollarTenThoursand', 
                                     'dollarThoursand',
                                     'dollarHK',
                                     'iDNumber',
                                     'iDBRNumber',
                                     'agencyName',
                                     'agencyNumber',
                                     'user',
                                     'userPosition',
                                     'userBDN',
                                     'agencyBDN',
                                     'toAgencyMoney',
                                     'createDay', 'expiresDay', 'userSignDate', 'agencySignDate'
                                     ],
    'numberFieldArray'          :   ['userPhone',
                                     'userFax',
                                     'agencyPhone',
                                     'agencyFax',
                                     'propertyPercentage'],
    'radioButtonArray'          :   ['opening', 'exclusive','agencyContract', 'relationship', 'included', 'showProperty', 'keepProperty', 'watchProperty', 'distributProperty', 'advertisements', 'showRightInterests', 'moneyIncrease'],
    'signatureArray'            :   ['svgUser','svgAgency'],
    //additional Array for from 4,6
    'tableAddKeyTextField'      :   ['showPropertyName', 'showPropertyDate', 'sellerCommission', 'buyerCommission'],
    'tableAddKeyNumberField'    :   [],
    'tableAddKeyRadioButton'    :   ['propertyRelase', 'propertyRelation'],
    'signatureAddKey'           :   ['signature'],
    //not check array for form 3/4/5/6
    'textAreaArray'             :   ['additionalLaw', 'referenceForCompany', 'userAddress', 'agencyAddress', 'reference'],
    'DataFieldArray'            :   [],
    'checkboxArray'             :   ['fiveAgreement', 'propertyFinished', 'salePurchaseAgreement', 'signatureCheck'],
    'selectFieldArray'          :   ['userAgreeSeeProperty', 'userAgreeKeepKey']
}

module.exports = formData;
