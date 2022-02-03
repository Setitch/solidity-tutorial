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

    error OnlyManagerError();
    error NoPlayersError();

    function enroll () public payable moneyRequired {
        players.push(msg.sender);
    }

    function pickWinner () public onlyModerator notEmpty {
        payable(players[random() % players.length]).transfer(address(this).balance);
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
