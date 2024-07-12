import "../styles/Main.css";
import React from 'react'

function ConfirmationWindow(props) {

    /**
    * FUNCTIONS
    */
    async function handleClick(action) {
        switch (action) {
            // Menu: Log out
            case "Yes": {
                props.setSelectedOption("none");
                props.setLoggedIn(false);
                props.setPackages([]);
                props.setCurrentPage("LandingPage");
                break;
            }
            // Payment: Discard package
            case "Discard": {
                props.setSelectedOption("none");
                props.setCurrentPage("PackageCreation");
                break;
            }
            // Subscriptions: Cancel subscription
            case "Confirm": {
                props.setSelectedOption("none");
                await props.updatePackageStatus(props.currentPackage.packageID, "Cancel");
                props.setUpdateSubscr(!props.updateSubscr);
                break;
            }
            // Subscriptions: Renew package
            case "Renew": {
                props.setSelectedOption("none");
                await props.updatePackageStatus(props.currentPackage.packageID, "Renew");
                props.setUpdateSubscr(!props.updateSubscr);
                break;
            }
            // Subscriptions: Delete package
            case "Remove": {
                props.setSelectedOption("none");
                props.updatePackageStatus(props.currentPackage.packageID, "Remove");
                props.setUpdateSubscr(!props.updateSubscr);
                break;
            }
            // Every "Cancel" option
            case "Cancel": {
                props.setSelectedOption("none");
                break;
            }
            // Default: "Cancel" option
            default: {
                props.setSelectedOption("none");
                break;
            }
        }
    }

    /**
    * RETURN, HTML ELEMENTS
    */
    return (
        <div>
            <div className="CW-Shading" onClick={() => handleClick("Cancel")}></div>
            <div className="Window-Body">
                <div className="Window-Text-Container">
                    <p className="Window-Text">Are you sure {props.question}?</p>
                </div>
                <div className="Window-Button-Container">
                    <button className="Own-Button" onClick={() => handleClick(props.button)}>{props.button}</button>
                    <button className="Own-Button" onClick={() => handleClick("Cancel")}>Cancel</button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmationWindow