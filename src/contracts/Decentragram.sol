pragma solidity ^0.5.0;

contract Decentragram {
    string public name = "Decentragram";

    //Initiate the image counter
    uint256 public imageCount = 0;

    mapping(uint256 => Image) public images;

    struct Image {
        uint256 id;
        string hash;
        string description;
        uint256 tipamount;
        address payable author;
    }

    event ImageCreated(
        uint256 id,
        string hash,
        string description,
        uint256 tipamount,
        address payable author
    );

    event ImageTipped(
        uint256 id,
        string hash,
        string description,
        uint256 tipamount,
        address payable author
    );

    function uploadImage(string memory _imageHash, string memory _description)
        public
    {
        //Check if there is an existing description and image passed to the function
        require(
            bytes(_description).length > 0,
            "You need to write a description"
        );
        require(bytes(_imageHash).length > 0, "You need to pass an imageHash");

        // Increment the global count of images
        imageCount++;

        //Store the image and map it with the the global image count as an id
        images[imageCount] = Image(
            imageCount,
            _imageHash,
            _description,
            0,
            msg.sender
        );

        emit ImageCreated(imageCount, _imageHash, _description, 0, msg.sender);
    }

    function tipImageOwner(uint256 _id) public payable {
        require(_id > 0 && _id <= imageCount, "You need to pass an imageHash");

        Image memory _image = images[_id];
        address payable _author = _image.author;
        _author.transfer(msg.value);
        _image.tipamount = _image.tipamount + msg.value;
        images[_id] = _image;

        emit ImageTipped(
            _id,
            _image.hash,
            _image.description,
            _image.tipamount,
            _image.author
        );
    }
}
