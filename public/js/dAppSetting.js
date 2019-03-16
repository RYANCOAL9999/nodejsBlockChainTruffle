var contract = undefined;
if (typeof web3 !== 'undefined') 
{
  console.log("use MetaMask");
  web3 = new Web3(web3.currentProvider);
  web3.eth.defaultAccount = web3.eth.accounts[0];
      var abi = [
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
    contract = new web3.eth.Contract(abi);
    
    contract.options.address = '0xcb23f695e92994ced13deabbc071753b82b43076';
} 
else 
{
    // set the provider you want from Web3.providers
    //web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
    alert("Error: No MetaMask, Please use others browser or install the plugIn for MetaMask");

}

