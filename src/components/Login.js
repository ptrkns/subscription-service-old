import "../styles/Main.css";

import React, { useState } from 'react';
import { ethers } from "ethers";
import axios from 'axios';

import SubscriptionContract from "./SubscriptionContract.js";
import services from "../assets/services.json";
import DateHandler from "./DateHandler.js";
import PackageAssembler from "./PackageAssembler.js";

export default function Login(props) {

    /**
    * VARRIABLES, STATES
    */
    const [userData, setUserData] = useState({ id: '', email: '', password: '' });
    const [errors, setErrors] = useState({});
    const [validEmail, setValidEmail] = useState(true);
    const [validPassword, setValidPassword] = useState(true);
    const { getContract } = SubscriptionContract();
    const { formatDate } = DateHandler();
    const { recreatePackage } = PackageAssembler();

    /*
    *   FUNCTIONS
    */
    async function getPackages(userID) {
        if (typeof window.ethereum !== 'undefined') {
            const contract = await getContract("provider");
      
            try { 
                const getPackages = await contract.getPackages(userID);
                    const recreatedPackages = [];
                    getPackages.forEach(pkg => {                    
                        const includedServices = [];
                        pkg.serviceIDs.forEach(sID => {
                            const selectedService = services.find(s => Number(s.serviceID) === Number(sID));
                            if(selectedService){ includedServices.push(selectedService); }
                        });
                        
                        const priceInETH = ethers.formatEther(Number(pkg.price));
                        
                        const sDate = formatDate(pkg.sDate, "date");
                        const eDate = formatDate(pkg.eDate, "date");
                        //console.log( "pkg.sDate: ", pkg.sDate, "\npkg.eDate: ", pkg.eDate);
                        //console.log( "sDate: ", sDate, "\neDate: ", eDate);

                        const recreatedPackage = recreatePackage(Number(pkg.packageID), props.userData.id, pkg.isActive, includedServices, priceInETH, Number(pkg.duration), sDate, eDate);
                        recreatedPackages.push(recreatedPackage);
                    });
                    props.setPackages([...props.packages, ...recreatedPackages]);
            }
            catch (error) { console.log(error); }
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        let isEmailValid = true;
        let isPasswordValid = true;
        let validationErrors = {};

        if (userData.email === "" || userData.email === null) {
            isEmailValid = false;
            validationErrors.email = "Email field is required!";
        } else if (!/\S+@\S+\.\S+/.test(userData.email)) {
            isEmailValid = false;
            validationErrors.email = "Invalid email format!";
        }

        if (userData.password === "" || userData.password === null) {
            isPasswordValid = false;
            validationErrors.password = "Password field is required!";
        } else if (userData.password.length < 6) {
            isPasswordValid = false;
            validationErrors.password = "Password must be at least 6 characters long!";
        }

        axios.get('http://localhost:8000/users')
            .then(result => {
                result.data.map(user => {
                    if (user.email === userData.email) {
                        isEmailValid = true;
                        if (user.password === userData.password) {
                            isPasswordValid = true;
                            props.setUserData(user);
                            getPackages(user.id); // Get packages from contract
                            props.handleClick(true);
                        }
                        else {
                            isPasswordValid = false;
                            validationErrors.password = "Invalid password!";
                        }

                    } else {
                        isEmailValid = false;
                        validationErrors.email = "This email address is not registered!"
                    }
                })
                setErrors(validationErrors);
                setValidEmail(isEmailValid);
                setValidPassword(isPasswordValid);
            })
            .catch(error => console.log(error));
    };

    /**
    * RETURN, HTML ELEMENTS
    */
    return (
        <div>
            <div className="Shading" onClick={() => props.handleClick(false)}></div>

            <form className="LRP-Body" onSubmit={handleSubmit}>

                <div className="LRP-Input-Container">

                    <p className="Own-Text-Title">Please fill your credentials!</p>

                    <div className="LRP-Inputs">
                        <label className="Own-Label">Email address:</label>
                        {validEmail ? <></> : <span className="LRP-Input-Error">{errors.email}</span>}
                        <input
                            className="Own-Input"
                            type="email"
                            name="email"
                            onChange={(event) => setUserData({ ...userData, email: event.target.value })}
                        ></input>

                        <label className="Own-Label" type="password">Password:</label>
                        {validPassword ? <></> : <span className="LRP-Input-Error">{errors.password}</span>}
                        <input
                            className="Own-Input"
                            type="password"
                            name="password"
                            onChange={(event) => setUserData({ ...userData, password: event.target.value })}
                        ></input>

                    </div>

                    <button className="LRP-Button" type="submit">Sign in</button>

                </div>

            </form>
        </div>
    );
};