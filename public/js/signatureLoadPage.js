var dSign = {
    "chi": {
        "save-png": "儲存電子簽署",
        "clear": "重新簽署"
    },
    "eng": {
        "save-png": "save digital signature",
        "clear": "reset"
    }
};
/**
 * display message with language
 */

function displayLanguage() {
    var url = new URL(window.location.href);
    var language = url.searchParams.get("language");
    var dsObj = dSign[language];

    for (var key in dsObj) {
        $("#".concat(key)).text(dsObj[key]);
    }
}