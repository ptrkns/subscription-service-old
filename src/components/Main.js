import "../styles/Main.css";

import React, { useState, useEffect } from "react";

import SubscriptionContract from "./SubscriptionContract.js";
import Home from "./Home";
import Payment from "./Payment.js";
import Account from "./Account.js";
import Subscriptions from "./Subscriptions.js";
import PackageCreation from "./PackageCreation.js";
import Menu from "./Menu.js";
import DateHandler from "./DateHandler.js";
import Message from "./Message.js";
import menu from '../assets/menu.png';
import { ethers } from "ethers";

function Main() {

  /**
  * VARRIABLES, STATES
  */
  /* Pages */
  const [currentPage, setCurrentPage] = useState('Home');
  const [loggedIn, setLoggedIn] = useState(false);
  const [menuClicked, setMenuClicked] = useState(false);

  /* User data */
  const [userData, setUserData] = useState({
    id: '',
    email: '',
    password: '',
    address: ''
  });

  /* Contract data */
  const { getContract, getDataFromEvent } = SubscriptionContract();
  const { formatDate } = DateHandler();

  /* Packages */
  const [packages, setPackages] = useState([]);
  const [newPackage, setNewPackage] = useState('');
  useEffect(() => { }, [packages]);

  /* Messages */
  const [messageVisibility, setMessageVisibility] = useState(false);
  const [messageText, setMessageText] = useState();
  const [messageType, setMessageType] = useState();

  /**
  * FUNCTIONS
  */
  /* Handling pages */
  function renderPage(currentPage) {
    switch (currentPage) {
      case "PackageCreation": return (
        <PackageCreation
          userData={userData}
          packages={packages}
          newPackage={newPackage}
          addNewPackage={addNewPackage}
          setCurrentPage={setCurrentPage}
          showMessage={showMessage}
        /*createRandomPackage={createRandomPackage}*/
        />);
      case "Payment": return (
        <Payment
          userData={userData}
          newPackage={newPackage}
          setNewPackage={setNewPackage}
          setPackages={setPackages}
          addToPackages={addToPackages}
          removePackage={removePackage}
          removePackageOnContract={removePackageOnContract}
          setCurrentPage={setCurrentPage}
          showMessage={showMessage}     
          executeTransaction={executeTransaction}
          renewSubscription={renewSubscription}

        />);
      case "Account": return (<Account showMessage={showMessage} userData={userData} setUserData={setUserData}/>);
      case "Subscriptions": return (<Subscriptions packages={packages} updatePackageStatus={updatePackageStatus} setCurrentPage={setCurrentPage} showMessage={showMessage}/>);
      case "Home": return (<Home />);
      default: return (<></>);
    }
  }

  function handleHeaderClicked(value) {
    setMessageVisibility(false);
    switch (value) {
      case "menu": { setMenuClicked(!menuClicked); break; }
      case "name": { setCurrentPage("PackageCreation"); break; }
      default: { break; }
    };
  };

  /* Contract interaction */
  async function executeTransaction(contract) {
    if (typeof window.ethereum !== 'undefined') {

      try {
        let serviceIDs = [];
        newPackage.services.forEach(srv => {serviceIDs.push(srv.serviceID);});
        const priceInWei = ethers.parseEther(newPackage.price.toString());
        const sDate = formatDate(newPackage.startDate, "string");
        const eDate = formatDate(newPackage.endDate, "string");

        const transaction = await contract.paySubscription(
          userData.id,
          newPackage.packageID,
          newPackage.isActive,
          serviceIDs,
          priceInWei,
          newPackage.duration,
          sDate,
          eDate,
          {value: priceInWei}
        );
        
        await transaction.wait();
      }
      catch (error) { console.log(error); }
    }
  };

  async function renewSubscription(_package) {
    if (typeof window.ethereum !== 'undefined') {
      const contract = await getContract("signer");

      try {
        const priceInWei = ethers.parseEther(_package.price.toString());
        const renewal = await contract.renewSubscription(userData.id, _package.packageID, priceInWei, {value: priceInWei});
        await renewal.wait(); 
      }
      catch (error) { console.log(error); }
    }
  }

  async function updatePackageStatusOnContract(packageID) {
    if (typeof window.ethereum !== 'undefined') {
      const contract = await getContract("signer");

      try {
        const update = await contract.updatePackageStatus(packageID);
        await update.wait();
      }
      catch (error) { console.log(error); }
    }
  };

  async function removePackageOnContract(userID, packageID) {
    if (typeof window.ethereum !== 'undefined') {
      const contract = await getContract("signer");

      try {
        const remove = await contract.removePackage(userID, packageID);
        await remove.wait();
      }
      catch (error) { console.log(error); }
    }
  };

  /* Handling packages */
  function addNewPackage(NewPackage) { setNewPackage(NewPackage); }

  function addToPackages(newPackage) { setPackages([...packages, newPackage]); }

  function removePackage(packageID) {
    if (packageID !== '') {
      const newPackages = packages.filter(p => p.packageID !== packageID);
      setPackages(newPackages);
    }
  };

  async function updatePackageStatus(packageID, action) {
    switch (action) {
      case "Cancel": {
        packages.forEach(pkg => {
          if (pkg.packageID === packageID) { 
            pkg.isActive = false;
            updatePackageStatusOnContract(pkg.packageID);
          }
        });
        break;
      }
      case "Renew": {
        // Take the package we want to renew and store it in NewPackage
        const NewPackage = packages.find((pkg) => pkg.packageID === packageID);
        setNewPackage(NewPackage);
        removePackage(packageID);
        setCurrentPage("Payment");
        break;
      }
      case "Remove": {
        removePackage(packageID);
        removePackageOnContract(userData.id, packageID);
        break;
      }
      default: { break; }
    };
  };

  function createRandomPackage() {
    const newService = {
      serviceID: 4,
      name: "HBO Go",
      description: "Some description",
      duration: 1,
      price: 10
    };

    const newEndDate = new Date();
    const newStartDate = new Date();
    newEndDate.setMonth(newEndDate.getMonth() - 1);
    newStartDate.setMonth(newStartDate.getMonth() - 2);

    const newPackage = {
      packageID: 131313,
      userId: userData.id,
      isActive: true,
      services: [newService],
      price: 10,
      duration: 1,
      startDate: newStartDate,
      endDate: newEndDate,
    };
    addToPackages(newPackage);
  };

  function checkPackageExpiration() {

    const currentDate = new Date();
    currentDate.setMonth(currentDate.getMonth());
    const oneDay = 24 * 60 * 60 * 1000;

    const updatedPackages = packages.map(pkg => {
      let remainingDays = (pkg.endDate - currentDate) / (oneDay);
      if (remainingDays < 1) { 
        updatePackageStatus(pkg.packageID);
        return { ...pkg, isActive: false }; 
      }
      else { return pkg; }
    });

    setPackages(updatedPackages);
  };

  /* Messages */
  function showMessage(text, type) {
    setMessageVisibility(true);
    setMessageText(text);
    setMessageType(type);
  };

  /**
  * RETURN, HTML ELEMENTS
  */
  return (<>
    {loggedIn === false && (
      <Home
        loggedIn={loggedIn}
        setLoggedIn={setLoggedIn}
        userData={userData}
        setUserData={setUserData}
        setCurrentPage={setCurrentPage}
        packages={packages}
        setPackages={setPackages}
      />
    )}
    {loggedIn === true && (
      <div className="Main">
        <header className="Main-Header">
          <div className="Header-Contents">
            <div className="HC-App-Name" onClick={() => handleHeaderClicked("name")}>
              <p className="App-Name">SUBS-3</p>
            </div>

            <div className="Menu-Container" onClick={() => handleHeaderClicked("menu")}>
              <img className="Menu-Logo" src={menu} alt=""></img>
            </div>
          </div>
        </header>
        <div className="Main-Body">
          <Menu
            setPackages={setPackages}
            setLoggedIn={setLoggedIn}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            menuClicked={menuClicked}
            setMenuClicked={setMenuClicked}
            setNewPackage={setNewPackage}
            checkPackageExpiration={checkPackageExpiration}
          />
          {renderPage(currentPage)}
          {messageVisibility === true && <Message value={messageText} type={messageType} setMessageVisibility={setMessageVisibility} />}
        </div>
        <footer className="Main-Footer">
          <p className="Footer-Content"></p>
        </footer>
      </div>
    )}
  </>);
}

export default Main