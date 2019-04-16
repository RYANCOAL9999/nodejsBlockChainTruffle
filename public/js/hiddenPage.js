function adminCorrect(data)
{
    return new Promise((resolve)=>{
        $.ajax({
            type: 'get',
            url: `/admin`,
            data:data,
            success: function (data) {
                resolve(true);
            },
            error: function (data) {
                resolve(false);
            },
        })
    })
}

function bodyOnLoad()
{
    var data = document.cookie;
    if(data)
    {
        adminLogin(data);
    }
    else
    {
        document.getElementById('id01').style.display='block';
    }
}

function adminLogin(data)
{
    if(!data)
    {
        data = $(`#loginForm`).serialize();
    }
    adminCorrect(data)
    .then((result)=>{
        if(result)
        {
            document.getElementById('id01').style.display='none';
            document.getElementById("myDIV").style.display='inline';
            document.cookie = data;
        }
    })
}