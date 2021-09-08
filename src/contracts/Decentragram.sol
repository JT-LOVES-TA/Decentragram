pragma solidity ^0.5.0;

contract Decentragram {
  string public name = "Decentragram";

  //Initiate the image counter
  uint public imageCount = 0 ;


  mapping(uint => Image) public images;

  struct Image{
    uint id;
    string hash;
    string description;
    uint tipamount;
    address payable author;
  }

  event ImageCreated(
    uint id,
    string hash,
    string description,
    uint tipamount,
    address payable author
  );

  function uploadImage(string memory _imageHash, string memory _description) public {

    // Increment the global count of images
    imageCount++; 

    //Store the image and map it with the the global image count as an id
    images[imageCount] = Image(imageCount, _imageHash, _description, 0, msg.sender);

    emit ImageCreated(imageCount, _imageHash, _description, 0, msg.sender);
  }

}