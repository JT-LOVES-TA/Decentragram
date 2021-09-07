pragma solidity ^0.5.0;

contract Decentragram {
  string public name = "Decentragram";

  mapping(uint => Image) public images;

  struct Image{
    uint id;
    string hash;
    string description;
    uint tipamount;
    address payable author;
  }

  function uploadImage() public {
    images[1] = Image(1, 'abc123', 'Hello world', 0, address(0x0));
  }
}