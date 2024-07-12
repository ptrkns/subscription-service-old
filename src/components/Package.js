import "../styles/Main.css";

import React, { useState } from "react";

import ConfirmationWindow from "./ConfirmationWindow.js";
import DateHandler from "./DateHandler.js";

function Package(props) {

    /**
    * VARRIABLES, STATES
    */
    const { formatDate } = DateHandler();
    const servicesNames = props.p.services ? props.p.services.map(s => s.name).join(', ') : [];
    const [selectedOption, setSelectedOption] = useState("none");
    const packageStatus = props.p.isActive ? "Active" : "Expired";
    const packageName = () => {
        switch (props.p.duration) {
            case 1: { return "Monthly"; }
            case 6: { return "Six months"; }
            case 12: { return "Annual"; }
            default: { return; }
        }
    };
    const packageDuration = () => {
        switch (props.p.duration) {
            case 1: { return "MONTH"; }
            case 6: { return "6 MONTHS"; }
            case 12: { return "YEAR"; }
            default: { return; }
        }
    };

    /**
    * RETURN, HTML ELEMENTS, REACT COMPONENTS
    */
    return (
        <>
            {props.p.isActive == true && <div className="Period-Container">
                <p className="Date">{formatDate(props.p.startDate, "format")}</p>
                <p className="Date">{formatDate(props.p.endDate, "format")}</p>
            </div>}

            <div className={`Package-Body-${packageStatus}`}>
                <div className="Name-Container">
                    <p className="Package-Text">{packageName()} package</p>
                    <p className="Package-Content">Includes: <b>{servicesNames}</b></p>
                    <p className={`Package-Content-ID-${packageStatus}`}>Package ID: {props.p.packageID}</p>
                </div>
                <div className="Price-Container">
                    <p className="Price-Text">{props.p.price} ETH<br></br>per {packageDuration()}</p>
                </div>
            </div>

            <div className="Package-Button-Container">
                {props.p.isActive == true && <button className="S-Button" onClick={() => setSelectedOption("Cancel")}>Cancel subscription</button>}
                {props.p.isActive == false && <button className="S-Button" onClick={() => setSelectedOption("Renew")}>Renew package</button>}
                {props.p.isActive == false && <button className="S-Button" onClick={() => setSelectedOption("Remove")}>Remove package</button>}
            </div>

            {selectedOption === "Cancel" && <ConfirmationWindow
                question={"you want to cancel your subscription"}
                button={"Confirm"}
                setSelectedOption={setSelectedOption}
                currentPackage={props.p}
                updatePackageStatus={props.updatePackageStatus}
                updateSubscr={props.updateSubscr}
                setUpdateSubscr={props.setUpdateSubscr}
            />}

            {selectedOption === "Renew" && <ConfirmationWindow
                question={"you want to renew your subscription"}
                button={"Renew"}
                setSelectedOption={setSelectedOption}
                currentPackage={props.p}
                updatePackageStatus={props.updatePackageStatus}
                updateSubscr={props.updateSubscr}
                setUpdateSubscr={props.setUpdateSubscr}
            />}
            {selectedOption === "Remove" && <ConfirmationWindow
                question={"you want to delete this package"}
                button={"Remove"}
                setSelectedOption={setSelectedOption}
                currentPackage={props.p}
                updatePackageStatus={props.updatePackageStatus}
                updateSubscr={props.updateSubscr}
                setUpdateSubscr={props.setUpdateSubscr}
            />}
        </>
    );
}

export default Package