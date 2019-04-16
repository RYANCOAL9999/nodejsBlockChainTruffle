function playAjax(formType, returnUrl, params)
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

var dropdownC = document.getElementsByClassName("dropdown-content")[0].children;
for (let i = 0; i < dropdownC.length; i++) {
    dropdownC[i].addEventListener("click", function() {
        playAjax(this.id, '', null);
    });
}