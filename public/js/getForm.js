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

async function render(data)
{
    var dataHash = await hashQuery(data);
    var blockHash = undefined;
    if(contract){
        console.log("calling Get()");
        //blockHash = await TheContract.methods.Get().call({from: _Setting.WALLET_ADDRESS});
        var from_addr = "0x49a6cAAfd2fD3821D511b7A937FE7A35A2D88077";
        var contract_abi = 
[
    {
      "constant": true,
      "inputs": [],
      "name": "hash",
      "outputs": [
        {
          "name": "",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "OwnerAddress",
      "outputs": [
        {
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_newOwner",
          "type": "address"
        }
      ],
      "name": "ChangeOwner",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_hash",
          "type": "string"
        }
      ],
      "name": "UploadHash",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "Get",
      "outputs": [
        {
          "name": "",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    }
];
        var contract_addr = "0xcb23f695e92994ced13deabbc071753b82b43076";

        var TheContract = new this.web3.eth.Contract(contract_abi, contract_addr);

        blockHash = await TheContract.methods.Get().call({from: "0x49a6cAAfd2fD3821D511b7A937FE7A35A2D88077"});
        console.log(blockHash);
    }
    dbFormData = data;
    $("#formHash").val(dataHash);
    $("#blockChainHash").val(blockHash);
}

function formTest(data)
{
    var textareaObject = data.textareaObject;
    var signatureObject = data.signatureObject;
    // console.log(signatureObject);

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
    render(data);

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
            formTest(data.json);
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