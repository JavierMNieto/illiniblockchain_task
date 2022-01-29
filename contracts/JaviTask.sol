//SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "./IlliniBlockchainDevTask.sol";

/**
 * @title JaviTask
 * @dev This contract is used to send an application to
 *      complete the IlliniBlockchain developer task.
 */
contract JaviTask {
    address public owner;
    IlliniBlockchainDevTask _illini;

    /**
     * @dev Sets the sender as the owner of the contract and casts given
     *      address to the IlliniBlockchainDevTask contract at {_illini}.
     */
    constructor(address _i) {
        owner = msg.sender;
        _illini = IlliniBlockchainDevTask(_i);
    }

    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    /**
     * @dev Sends application data to the IlliniBlockchain
     *      developer task contract and self destructs once sent.
     * @param data The application to be sent.
     */
    function sendApplication(string memory data) public onlyOwner {
        _illini.sendTask(data);
        selfdestruct(payable(owner));
    }
}
