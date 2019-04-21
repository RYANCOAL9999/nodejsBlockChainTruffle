var canvas = document.getElementById('signature-pad');
/*
* Adjust canvas coordinate space taking into account pixel ratio,
* to make it look crisp on mobile devices.
* This also causes canvas to be cleared.
**/
function resizeCanvas() {
    /* 
    * When zoomed out to less than 100%, for some very strange reason,
    * some browsers report devicePixelRatio as less than 1
    * and only part of the canvas is cleared then.
    **/
    var ratio = Math.min(window.devicePixelRatio || 1, 1);
    canvas.width = canvas.offsetWidth * ratio;
    canvas.height = canvas.offsetHeight * ratio;
    canvas.getContext("2d").scale(ratio, ratio);
}
/*
* resize the canvas  
*/
window.onresize = resizeCanvas;
resizeCanvas();

/**
 * set field with preious page
 */
function SetName(data, felid) {
    if (window.opener != null && !window.opener.closed) {
        var txtName = window.opener.document.getElementById("".concat(felid, "ID"));
        txtName.value = data;
    }

    window.close();
}

var signaturePad = new SignaturePad(canvas, {
    backgroundColor: 'rgb(255, 255, 255)' // necessary for saving image as JPEG; can be removed is only saving as PNG or SVG
});

/**
 * event Listener with save data
 */
document.getElementById('save-png').addEventListener('click', function () {
    if (signaturePad.isEmpty()) {
        return alert("Please provide a signature first.");
    }
    var url = new URL(window.location.href);
    var felid = url.searchParams.get("felid");
    var data = signaturePad.toDataURL('image/png');
    SetName(data, felid);
});
/**
 * event Listener with clear data
 */
document.getElementById('clear').addEventListener('click', function () {
    signaturePad.clear();
});