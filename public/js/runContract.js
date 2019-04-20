/**
 * load form with form 3, 4, 5, 6, 8 and english
 * @param {Number} formType   form id
 * @param {String} returnUrl  return url
 * @param {Object} params     users old data
 */
function loadForm(formType, returnUrl, params)
{
    var url = undefined;
    if(formType == 7)
    {
        url = `/show/contract`;
    }
    else
    {
        url = `/contract/${formType}/form?`;
        if(params)
        {
            url += `seller=${params.seller}`
                    +`&agency=${params.agency}`
                    +`&property=${params.property}`;
        }
        url += `&returnUrl=${returnUrl}`;
    }
    window.location.href = url;
}

/**
 * event Listener with drop down button
 */
var dropdownC = document.getElementsByClassName("dropdown-content")[0].children;
for (let i = 0; i < dropdownC.length; i++) {
    dropdownC[i].addEventListener("click", function() {
        loadForm(this.id, '', null);
    });
}