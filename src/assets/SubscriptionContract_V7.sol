//SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

//import "@openzeppelin/contracts/access/Ownable.sol";

contract SubscriptionService_V7 {
    uint256 public balance = 0;

    struct Package {
        uint256 packageID;
        bool isActive;
        uint256[] serviceIDs;
        uint256 price;
        uint256 duration;
        string sDate;
        string eDate;
    }
    
    struct Subscription {
        uint256 userID;
        Package package;
    }

    Subscription[] public subscriptions;
    address public contractOwner;

    constructor() { contractOwner = msg.sender; }

    event actionEvent(uint256 userID, uint256 packageID, string message);

    function paySubscription(uint256 _userID, uint256 _packageID, bool _isActive, uint256[] memory _serviceIDs, uint256 _price, uint256 _duration, string memory _sDate, string memory _eDate) public payable {        
        require(msg.value == _price, "ERROR");
        balance += msg.value;
        Package memory  _package = Package(_packageID, _isActive, _serviceIDs, _price, _duration, _sDate, _eDate);
        Subscription memory newSub = Subscription(_userID, _package);
        subscriptions.push(newSub);
        emit actionEvent(_userID, _packageID, "Transaction successfull");
    }

    function renewSubscription(uint256 _userID, uint256 _packageID, uint256 _price) public payable {        
        require(msg.value == _price, "ERROR");
        balance += msg.value;
        
        for(uint256 i = 0; i < subscriptions.length; i++){
            if(subscriptions[i].userID == _userID && subscriptions[i].package.packageID == _packageID){
                subscriptions[i].package.isActive = true;
            }
        }
        emit actionEvent(_userID, _packageID, "Subscription has been renewed!");
    }

    function getPackages(uint256 _userID) public view returns (Package[] memory) {
        uint256 arrayLength = 0;
        
        for(uint256 i = 0; i < subscriptions.length; i++) { // Count how many subscriptions are there with the given userID!
            if(subscriptions[i].userID == _userID){ arrayLength += 1; }
        }
        
        Package[] memory storedPackages = new Package[](arrayLength); // Initialize an array with the same length!
        uint256 currentIndex = 0;
        
        for (uint256 i = 0; i < subscriptions.length; i++) {
            if (subscriptions[i].userID == _userID) {
                storedPackages[currentIndex] = subscriptions[i].package;
                currentIndex++;
            }
        }
        return  storedPackages;
    }

    function updatePackageStatus(uint256 _packageID) public {
        for(uint256 i = 0; i < subscriptions.length; i++) {
            if(subscriptions[i].package.packageID == _packageID){
                subscriptions[i].package.isActive = !(subscriptions[i].package.isActive);
                emit actionEvent(subscriptions[i].userID, subscriptions[i].package.packageID, "The package with the given ID has been updated!");
            }
        }
    }

    function removePackage(uint256 _userID, uint256 _packageID) public {

        uint256 currentIndex = 0;

        for (uint256 i = 0; i < subscriptions.length; i++) {
            if (subscriptions[i].userID == _userID && subscriptions[i].package.packageID == _packageID) {
                emit actionEvent(0, _packageID, "The subscription with the given user ID and package ID has been removed!");
                continue;
            }
            subscriptions[currentIndex] = subscriptions[i];
            currentIndex++;
        }

        while (subscriptions.length > currentIndex) { subscriptions.pop(); }

    }
}