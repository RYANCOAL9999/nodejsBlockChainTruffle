/**
 * concurrenc with , input
 */
(function($, undefined){
    "use strict";
    $(function() {
        var $concurrenc = $(".amount");
        $concurrenc.on("keyup", function(event){
            // alert('Hello');
            var selection = window.getSelection().toString();
            if ( selection !== '' ) {
                return;
            }
            if ( $.inArray( event.keyCode, [38,40,37,39] ) !== -1 ) {
            return;
            }
            var $this = $( this );
            // Get the value.
            var input = $this.val();
                
            var input = input.replace(/[\D\s\._\-]+/g, "");
            input = input ? parseInt( input, 10 ) : 0;

            $this.val( function() {
            return ( input === 0 ) ? "" : input.toLocaleString( "en-US" );
            });
        })
        var $idNumber = $(".iDNumberT");
        $idNumber.on("keyup", function(event){
            var str = $(this).val();
            if(str.length < 8)
            {
                return;
            }
            var hkidPat = /^([A-Z]{1,2})([0-9]{6})$/;
            var matchArray = str.match(hkidPat);
            if(matchArray == null)
            {
                $(this).val(null);    
            }
        });
        var $idBRNumber = $(".iDBRNumberT");
        $idBRNumber.on("keyup", function(event){
            var str = $(this).val();
            if(str.length < 1)
            {
                return;
            }
            var hkidPat = /^([A0-9])$/;;
            var matchArray = str.match(hkidPat);
            if(matchArray == null)
            {
                $(this).val(null);    
            }
            var lastStr = $idNumber.val() + "(" + str + ")";
            if(!IsHKID(lastStr))
            {
                $idNumber.val(null);
                $idBRNumber.val(null);
            }
        });
    });
})(jQuery);

$('.datepick').each(function(){
    $(this).datepicker();
});

function IsHKID(str) {
    var strValidChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

    // handling bracket
    if (str.charAt(str.length-3) == '(' && str.charAt(str.length-1) == ')')
    str = str.substring(0, str.length - 3) + str.charAt(str.length -2);

    // regular expression to check pattern and split
    var hkidPat = /^([A-Z]{1,2})([0-9]{6})([A0-9])$/;
    var matchArray = str.match(hkidPat);

    // not match, return false
    if (matchArray == null){
        return false;
    }

    // the character part, numeric part and check digit part
    var charPart = matchArray[1];
    var numPart = matchArray[2];
    var checkDigit = matchArray[3];

    // calculate the checksum for character part
    var checkSum = 0;
    if (charPart.length == 2) {
        checkSum += 9 * (10 + strValidChars.indexOf(charPart.charAt(0)));
        checkSum += 8 * (10 + strValidChars.indexOf(charPart.charAt(1)));
    } else {
        checkSum += 9 * 36;
        checkSum += 8 * (10 + strValidChars.indexOf(charPart));
    }

    // calculate the checksum for numeric part
    for (var i = 0, j = 7; i < numPart.length; i++, j--)
        checkSum += j * numPart.charAt(i);

    // verify the check digit
    var remaining = checkSum % 11;
    var verify = remaining == 0 ? 0 : 11 - remaining;

    return verify == checkDigit || (verify == 10 && checkDigit == 'A');
}
  
  
