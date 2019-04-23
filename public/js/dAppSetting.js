var contract = undefined;
var CONTRACT_ADDRESS = '0x305565831c1a07b9f2bec1a79aa046bbe385e9ed';
var WALLET_ADDRESS = '0xdbbb39074052dc17dc7755452a2d6c359dad9f99';
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:5000"));
var abi = [
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
                "name": "_id",
                "type": "string"
            },
            {
                "name": "_num",
                "type": "uint256"
            },
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
        "inputs": [
            {
                "name": "id",
                "type": "string"
            },
            {
                "name": "num",
                "type": "uint256"
            }
        ],
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
    }
];
web3.eth.defaultAccount = web3.eth.accounts[0];
contract = new web3.eth.Contract(abi, CONTRACT_ADDRESS);
console.log(contract);