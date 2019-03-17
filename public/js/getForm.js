var dbFormData = undefined;

function hashQuery(data)
{
    return new Promise((resolve)=>{
        $.ajax({
            type: 'post',
            url: '/api/encryption',
            data: data,
            success: function (data) {
                resolve(data);
            }
        });
    })
}


async function playHash()
{
    if(dbFormData)
    {
        var form_id = dbFormData.form_id;
        var form = $(`#form${form_id}Letter`);
        var data = form.serialize();
        data += `&tableRecord=${dbFormData.inputproperty}`;
        data += `&form_id=${form_id}`;
        data += `&action=${dbFormData.action}`;
        data += `&svgUser=${dbFormData.svgUser}`;
        data += `&svgAgency=${dbFormData.svgAgency}`;
        var hash = await hashQuery(data);
        $("#formHash").val(hash);
    }
}

async function render(data, hash)
{
    var dataHash = await hashQuery(data);
    var blockHash = hash;
    dbFormData = data;
    $("#formHash").val(dataHash);
    $("#blockChainHash").val(blockHash);
}

function formTest(data, hash)
{
    var textareaObject = data.textareaObject;
    var signatureObject = data.signatureObject;
    for(var textarea in textareaObject)
    {
        $(`#${textarea}T`).val(textareaObject[textarea]);
    }

    for(var signature in signatureObject)
    {
        var image = new Image();
        image.src = signatureObject[signature];
        document.body.append(image);
    }
    render(data, hash);

}
function readContract()
{
    var value = $('input[name="date"]:checked').val();
    var agency = $('input[name="account"]').val();
    $.ajax({
        type: 'get',
        url: `/api/users/balance`,
        data:`agency=${agency}&createDay=${value}`,
        success: function (data) {
            data = JSON.parse(data);
            // console.log(data);
            $("#spanOPT").append(`<br>`);
            $("#spanOPT").append(`<br>`);
            $("#spanOPT").append(data.html);
            formTest(data.json, data.hash);
        },
        error: function (data) {
            alert(data.responseJSON.error);
        },
    });
}
function clickSubmit()
{
    
    var form = $(`#dataForm`);
    $.ajax({
        type: form.attr('method'),
        url: form.attr('action'),
        data: form.serialize(),
        success: function (data) {
            data = JSON.parse(data);
            var spendOptions = $(`<span class="sortOptions" id="resolutionSpan">`);
            var date = data.date;
            for(let i of date)
            {
                var date = new Date(i);
                spendOptions.append(`<br><input type="radio" name="date" value=${i} ><label for=${i}>${date}</label>`);
            }
            $("#spanOPT").append(`<br>`);
            $("#spanOPT").append(spendOptions);
            $("#spanOPT").append(`<br>`);
            $("#spanOPT").append(`<br>`);
            $("#spanOPT").append(`<button class="dropbtn" onclick="readContract()">觀看智能合約</button>`)
        },
        error: function (data) {
            alert(data.responseJSON.error);
        },
    });
}