/*asyc*/
var inputproperty = 0;

function playSubmit(form_id)
{
    var action = 'submit';
    var url = '/process';
    var data = $(`#form${form_id}Letter`).serialize();
    if(validation(formData[form_id]))
    {
        // var svgUser = $userSign.jSignature('getData', "svgbase64");
        // var svgAgency = $agencySign.jSignature("getData", "svgbase64"); 
        // data += `&svgUser=${JSON.stringify(svgUser)}&svgAgency=${JSON.stringify(svgAgency)}`;
        // if(form_id == 4 || form_id == 6 && inputproperty > 0)
        // {
        //     for(let i = 0; i < inputproperty;i++)
        //     {
        //         var svgSingature= $inputSign.jSignature('getData', "svgbase64");
        //         data += `&svgSingature${i}=${JSON.stringify(svgSingature)}`;
        //     }
        // }
        var correct = confirm("是否要放上Blockchain?")
        if(!correct)
        {
            return;
        }
        playSave(form_id, url, data, action, async function(data)
        {
            var hash = data.hash;
            if(contract){
                //var unloadTrue = await contract.methods.UploadHash(hash).send({from: '0x3a70567b94e81d2a07504e678726a46a4a4537ab'});
                if(1)
                {
                    location.href = data.returnUrl == '' || data.returnUrl == undefined ? '../../../' : data.returnUrl;
                }
            }
            else
            {
                alert("Error: Uploading hash");
            }
        });
    }
}

function validation(data)
{
    var correct = true;
    for(var name in data)
    {
        if(name == 'iDNumber')
        {
            if(!document.forms["formNewsLetter"][name].value || typeof document.forms["formNewsLetter"][name].value == "number")
            {
                correct = false;
                alert(data[name]);
                break;
            }
        }
        else
        {
            var formName = document.forms["formNewsLetter"][name];
            if(formName)
            {
                if(formName.value == "")
                {
                    correct = false;
                    alert(data[name]);
                    break;
                }
            }
        }
    }
    return correct;
}

function playSave(form_id, url, data, action, callback)
{
    // var data = document.getElementById('txtName').value;
    // var img = new Image();
    // img.src = data;
    // document.body.append(img);
    callback = callback == null || callback == undefined ? null : callback;

    if(callback == null)
    {
        var correct = confirm("需要儲存 ?")
        if(!correct)
        {
            return;
        }
    }

    var form = $(`#form${form_id}Letter`);

    if(!url)
    {
        url = form.attr('action');
    }

    if(!data)
    {
        data = form.serialize();
    }

    if(inputproperty != 0)
    {   
        data += `&tableRecord=${inputproperty}`;
    }
       
    if(!action)
    {
        action = 'save';
    }

    data += `&form_id=${form_id}`;
    
    data += `&action=${action}`;

    console.log(data);
    
    $.ajax({
        type: form.attr('method'),
        url: url,
        data: data,
        success: function (data) {
            console.log('Submission was successful.');
            data = JSON.parse(data);
            if(action == 'submit')
            {
                callback(data);
            }
            else
            {
                location.href = data.returnUrl == '' || data.returnUrl == undefined ? '../../../' : data.returnUrl;
            }
        },
        error: function (data) {
            console.log('An error occurred.');
            console.log(data);
        },
    });
}

function playReset()
{

    var correct = confirm("是否需要重新輸入 ?")
    if(!correct)
    {
        return;
    }

    window.location.reload();
}