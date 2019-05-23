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
        $("#formHash").val(hash);
        $("#blockChainHash").val(data.documentHash);
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
        headers:generalHeader("kconsultingpro", "admin", "ASDsuki123"),
        success: function (data) {
            var json = JSON.parse(data); 
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
        headers:generalHeader("kconsultingpro", "admin", "ASDsuki123"),
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

