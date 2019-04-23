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
    });
})(jQuery);

$('.datepick').each(function(){
    $(this).datepicker();
});
  
  
