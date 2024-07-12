import "../styles/Main.css";
import React, { useState } from "react";
import ConfirmationWindow from "./ConfirmationWindow";

function Menu(props) {

    /**
    * STATE
    */
    const [selectedOption, setSelectedOption] = useState("none");

    /**
    * FUNCTION
    */
    function handleOptionClicked(value) {
        props.setMenuClicked(!props.menuClicked);
        props.checkPackageExpiration();
        switch (value) {
            case "Home": {
                setSelectedOption("logout");
                break;
            }
            case "PackageCreation": {
                props.setNewPackage('');
                props.setCurrentPage(value);
                break;
            }
            case "Account": {
                props.setNewPackage('');
                props.setCurrentPage(value);
                break;
            }
            case "Subscriptions": {
                props.setNewPackage('');
                props.setCurrentPage(value);
                //props.checkPackageExpiration();
                break;
            }
            default: { break; }
        }

    }

    /**
    * RETURN, HTML ELEMENTS
    */
    return (
        <div>
            {props.menuClicked == true && <div className="Menu">
                <p className="Item-Left" onClick={() => handleOptionClicked("PackageCreation")}>Package creation</p>
                <p className="Item" onClick={() => handleOptionClicked("Account")}>Account management</p>
                <p className="Item" onClick={() => handleOptionClicked("Subscriptions")}>Subscriptions</p>
                <p className="Item-Right" onClick={() => handleOptionClicked("Home")}>Log out</p>
            </div>}
            {selectedOption === "logout" && <ConfirmationWindow
                question={"you want to log out"}
                button={"Yes"}
                setCurrentPage={props.setCurrentPage}
                setSelectedOption={setSelectedOption}
                setLoggedIn={props.setLoggedIn}
                setPackages={props.setPackages}
            />}
        </div>
    )
}

export default Menu