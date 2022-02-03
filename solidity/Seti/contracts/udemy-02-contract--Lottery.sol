// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

contract Lottery {
    address public manager;
    address[] private players;

    constructor () {
        manager = msg.sender;
    }

    modifier onlyModerator() {
        require(msg.sender == manager, "Only manager can execute the random winner generator");
        _;
    }
    modifier moneyRequired() {
        require(msg.value >= 0.01 ether, "Minimum amount required for entering is 0.01 ether");
        _;
    }
    modifier notEmpty() {
        require(players.length > 0, "No lottery users yet");
        _;
    }

    function enroll () public payable moneyRequired {
        players.push(msg.sender);
    }

    function pickWinner () public onlyModerator notEmpty {
        if (players.length == 1) { // optimization of non needed random
            payable(players[0]).transfer(address(this).balance);
        } else {
            payable(players[random() % players.length]).transfer(address(this).balance);
        }
        delete players; // = new address[](0);
    }

    function random() private view returns (uint) {
        return uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp, players)));
    }

    function getEntriesCount() public view returns (uint) {
        return players.length;
    }
    function getPlayers() public view returns (address[] memory) {
        return players;
    }
}
