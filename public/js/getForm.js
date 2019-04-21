var dbFormData = undefined;

/**
 * api request with ajax
 * @param {Object} data data with access Users
 */
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

/**
 * submit hash with data
 */
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

/**
 * render html
 * @param {Object} data  data with submit 
 * @param {String} hash  submit data with hash
 */
async function render(data, hash)
{
    var dataHash = await hashQuery(data);
    var blockHash = hash;
    dbFormData = data;
    $("#formHash").val(dataHash);
    $("#blockChainHash").val(blockHash);
}

/**
 * 
 * @param {String} url   url for pdf
 * @param {Object} data  data with submit 
 * @param {String} hash  submit data with hash
 */
function formTest(url, data, hash)
{
    window.open(url, '_blank');
    if(data && hash){
        render(data, hash);
    }
}
/**
 * read the contract with api balance
 */
function readContract()
{
    var uniqueNumber = $('input[name="uniqueNumber"]').val();
    document.getElementById("spanOPText").innerHTML = "";
    $.ajax({
        type: 'get',
        url: `/api/users/balance`,
        data:`uniqueNumber=${uniqueNumber}`,
        success: function (result) {
            var json = JSON.parse(result);
            if(json.url)
            {
                formTest(json.url, json.data, json.hash);
            }
            else
            {
                $("#spanOPText").append(`<br>`);
                $("#spanOPText").append(`<br>`);
                $("#spanOPText").html(json.html);
            }
        },
        error: function (data) {
            alert(data.responseJSON.error);
        },
    });
}

/**
 * add data to input field to get contract
 * @param {String} uniqueNumber contract uniqueNumber
 */
function addField(uniqueNumber)
{
    $('input[name="uniqueNumber"]').val(uniqueNumber);
}

/**
 * submit agency to get the uniqueNumber
 */
function agencySubmit()
{
    var form = $(`#dataForm`);
    document.getElementById("spanOPT").innerHTML = "";
    document.getElementById("spanOPText").innerHTML = "";
    $.ajax({
        type: form.attr('method'),
        url: form.attr('action'),
        data: form.serialize(),
        success: function (data) {
            data = JSON.parse(data);
            var contract = data.contract;
            var spendOptions = $(`<span class="sortOptions" id="resolutionSpan">`);
            for(var i of contract)
            {
                spendOptions.append(`&emsp;<input type="radio" name="name" value=${i} onclick="addField('${i}')" >合約編號: <label for=${i}>${i}</label>`);
            }
            $("#spanOPT").append(spendOptions);
        },
        error: function (data) {
            alert(data.responseJSON.error);
        },
    });
}

