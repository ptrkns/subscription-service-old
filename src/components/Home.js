import "../styles/Main.css";

import React, { useState } from "react";

import Login from "./Login.js";
import Registration from "./Registration.js";
import Connect from "./Connect.js";

function Home(props) {

    /**
    * STATE
    */
    const [selectedOption, setSelectedOption] = useState("none");

    /**
    * FUNCTIONS
    */
    const handleClick = (value) => {
        if (value === true) {
            props.setCurrentPage("PackageCreation");
            props.setLoggedIn(true);
        }
        else { setSelectedOption("none"); }
    };

    /**
    * RETURN, HTML ELEMENTS
    */
    return (
        <div className="LP-Body">
            <div className="LPB-Background">
                <div className="LPB-Text-Container">
                    <p className="LPBTC-Name">SUBS-3</p>
                    <p className="LPBTC-Text">Subscribe to various services through a unified web3 application, with the help of smart contracts!</p>
                </div>
            </div>
            <div className="LPB-Button-Container">
                <button className="Sign-in-Button" onClick={() => setSelectedOption("login")}>Log in</button>
                <button className="Sign-in-Button" onClick={() => setSelectedOption("registration")}>Register</button>
            </div>
            {selectedOption === "none" && <></>}
            {selectedOption === "login" && <Login handleClick={handleClick} userData={props.userData} setUserData={props.setUserData} packages={props.packages} setPackages={props.setPackages}/>}
            {selectedOption === "registration" && <Registration userData={props.userData} setUserData={props.setUserData} handleClick={handleClick} setSelectedOption={setSelectedOption} />}
            {selectedOption === "connect" && <Connect handleClick={handleClick} userData={props.userData} setUserData={props.setUserData} />}
        </div>
    )
};

export default Home;