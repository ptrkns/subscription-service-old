import "../styles/Main.css";

import React, { useState } from "react";

import DateHandler from "./DateHandler.js";
import Service from "./Service.js";
import ConfirmationWindow from "./ConfirmationWindow.js";
import SubscriptionContract from "./SubscriptionContract.js";

function Payment(props) {

    /**
    * VARRIABLES, STATES
    */
    const [disableButtons, setDisableButtons] = useState(false);
    const [selectedOption, setSelectedOption] = useState("none");
    const serviceData = props.newPackage.services.map(s => {
        return <Service
            key={s.serviceID}
            {...s}
            type={"Payment"}
        />
    });
    const { formatDate } = DateHandler();
    const { getContract } = SubscriptionContract();

    /**
    * FUNCTIONS
    */
    /* Buttons */
    function discardPackage() {
        if(props.newPackage.isActive === false){
            /*
            * Ha a csomag korábban már lejárt, akkor az a megújítás esete,
            * így vissza kell tenni a csomagok közé.
            */
            props.addToPackages(props.newPackage);
        };

        setSelectedOption("discard");
    };

    /* Transaction */
    async function beginTransaction() {
        props.showMessage("Transaction is in progress...", "Yellow");
        setDisableButtons(true);

        const contract = await getContract("signer");
        let transactionConfirmed = false;

        if(props.newPackage.isActive === false){    // Renewing a package
            props.removePackage(props.newPackage.packageID);
            await props.renewSubscription(props.newPackage);
            transactionConfirmed = true;
        }
        else if(props.newPackage.isActive === true){    // After package creation           
            await props.executeTransaction(contract);
            transactionConfirmed = true;
        }

        if (transactionConfirmed === true) {
            props.addToPackages(props.newPackage);
            props.showMessage("Transaction succesful!", "Green");
        }
        else if(transactionConfirmed === false) {  props.showMessage("Transaction failed!", "Red"); }
    };

    /**
    * RETURN, HTML ELEMENTS
    */
    return (
        <div className="P-Body">
            <h1 className="Page-Name">Payment</h1>
            <p className="Own-Text-Title">Subscription period</p>
            <div className="PB-Period">
                <p className="PBP-Start">{formatDate(props.newPackage.startDate, "format")}</p>
                <p className="PBP-End">{formatDate(props.newPackage.endDate, "format")}</p>
            </div>

            <p className="Own-Text-Title">Your chosen services</p>
            <div className="PB-Package">
                {serviceData}
            </div>
            <p className="Own-Text-Simple">Total cost of the package:</p>
            <div className="Own-Inactive-Input">{props.newPackage.price} ETH</div>

            {disableButtons == false && <div className="Button-Container">
                <button className="Own-Button" onClick={() => discardPackage()}>Discard package</button>
            </div>}
            {disableButtons == true && <div className="Button-Container">
                <button className="Own-Button-Inactive">Discard package</button>
            </div>}

            <p className="Own-Text-Title">Your connected MetaMask wallet</p>
            <p className="Own-Text-Simple">You can switch wallets at the "Account management" page.</p>
            <div className="Own-Inactive-Input">{props.userData.address}</div>

            {disableButtons == false && <div className="Button-Container">
                <button className="Own-Button" onClick={() => beginTransaction()}>Begin transaction</button>
            </div>}
            {disableButtons == true && <div className="Button-Container">
                <button className="Own-Button-Inactive">Begin transaction</button>
            </div>}
            {selectedOption == "discard" && <ConfirmationWindow
                question={"you want to discard the package"}
                button={"Discard"}
                setSelectedOption={setSelectedOption}
                setCurrentPage={props.setCurrentPage}
            />}
        </div>
    );
};

export default Payment;