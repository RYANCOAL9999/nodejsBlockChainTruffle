pragma solidity ^0.5.0;

contract HashBlock
{
	address public OwnerAddress = msg.sender;								//Set the contract owner when deploy
	
	struct Record
	{
		string[1000000]	A_hash;
	}
	
	mapping(string => Record) _Record;

	modifier OnlyOwner {
		if(msg.sender == OwnerAddress)_;									//Only The contract owner
	}

	function ChangeOwner(address _newOwner) public OnlyOwner				//Transfer the ownership to other address
	{
		if(_newOwner == address(0))revert("The new address is null.");		//Check the address is not null(0x0)
		OwnerAddress = _newOwner;
	}

	function UploadHash(string memory _id, uint _num, string memory _hash) public OnlyOwner									//Upload the hash
	{
	        _Record[_id].A_hash[_num] = _hash;
	}
	
	function Get(string memory id, uint num) public view OnlyOwner returns (string memory) {
        return _Record[id].A_hash[num];
    }
}