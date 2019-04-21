var popup;
/**
 * 
 * @param {String} felid    which felid need to use sign
 * @param {String} language language
 */
function openPopUp(felid, language)
{
	popup = window.open(`../../../popUpSign.html?felid=${felid}&language=${language}`, 'Popup', 'width=400,height=270,toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=no,copyhistory=no,resizable=yes');
	popup.focus();
}