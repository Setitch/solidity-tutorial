// pragma solidity ^0.4.17;
pragma solidity ^0.8.11;

// SPDX-License-Identifier: MIT
contract Inbox {
    string private message;

    constructor(string memory initialMessage) {
        message = initialMessage;
    }

    function setMessage(string memory newMessage) public returns (string memory) {
        message = newMessage;

        return message;
    }

    function getMessage() public view returns (string memory) {
        return message;
    }
}
