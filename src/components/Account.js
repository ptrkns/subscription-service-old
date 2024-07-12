import "../styles/Main.css";

import React, { useState } from "react";
import axios from 'axios'

function Account(props) {

    /**
    * VARRIABLES, STATES
    */
    const [registeredEmails, setRegisteredEmails] = useState([]);
    const [currPassword, setCurrPassword] = useState('');
    const [confPassword, setConfPassword] = useState('');
    const [formData, setFormData] = useState({
        id: props.userData.id,
        email: '',
        newPassword: '',
        address: props.userData.address
    })

    /**
    * FUNCTIONS
    */
    /* Axios */
    function axiosPutRequest(datatype, newData, userID) {
        let url = "http://localhost:8000/users/" + userID;
        let updatedData;
        switch (datatype) {
            case "email": {
                updatedData = { id: userID, email: newData, password: props.userData.password, address: props.userData.address };
                break;
            }
            case "password": {
                updatedData = { id: userID, email: props.userData.email, password: newData, address: props.userData.address };
                break;
            }
            case "address": {
                updatedData = { id: userID, email: props.userData.email, password: props.userData.password, address: newData };
                break;
            }
            default: { break; }
        }
        axios.put(url, updatedData)
            .then(
                props.showMessage("Update successful!", "Green"),
                props.setUserData(updatedData)
            )
            .catch(error => { console.log(error) });
    }

    /* Email validation */
    function validateEmail(email) {
        let result = true;
        registeredEmails.forEach(regEmail => {
            if (regEmail === email) { result = false; }
        });
        return result;
    }

    const handleEmailChange = (event) => {
        event.preventDefault();

        axios.get('http://localhost:8000/users').then(result => {
            result.data.forEach(data => { setRegisteredEmails([...registeredEmails, data.email]) });
        })
            .catch(error => console.log(error))

        setFormData({ ...formData, email: event.target.value })
    }

    const updateEmail = (event) => {
        event.preventDefault();

        let isEmailValid = validateEmail(formData.email);

        if (formData.email === "" || formData.email === null) {
            props.showMessage("Warning: Email field is required!", "Yellow");
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            props.showMessage("Error: Invalid email format!", "Red");
        } else if (isEmailValid === false) {
            props.showMessage("Error: This email address is already registered!", "Red");
        } else {
            axiosPutRequest("email", formData.email, props.userData.id);
        }
    }

    /* Password validation */
    const updatePassword = (event) => {
        event.preventDefault();
        let currPasswordChecked = false;
        let newPasswordChecked = false;
        let confPasswordChecked = false;
        if (currPassword === '' || currPassword === null) {
            props.showMessage("Warning: Current password is empty!", "Yellow");
        }
        else if (currPassword !== props.userData.password) {
            props.showMessage("Error: Incorrect value for current password!", "Red");
        } else { currPasswordChecked = true; }

        if (formData.newPassword === "" || formData.newPassword === null) {
            props.showMessage("Warning: New password has no value!", "Yellow");
        }
        else if (formData.newPassword.length < 6) {
            props.showMessage("Error: Password must be at least 6 characters long!", "Red");
        } else { newPasswordChecked = true; }

        if (confPassword !== formData.newPassword) {
            props.showMessage("Error: Passwords do not match!", "Red");
        } else { confPasswordChecked = true; }

        if (currPasswordChecked === true && newPasswordChecked === true && confPasswordChecked === true) {
            axiosPutRequest("password", formData.newPassword, props.userData.id);
        }
    }

    /* MetaMask extension */
    async function requestAccount() {
        if (window.ethereum) {
            try {
                const accounts = await window.ethereum.request({ method: "eth_requestAccounts", });
                console.log("requestAccount: accounts[0]: " + accounts[0]);
                setFormData({ ...formData, address: accounts[0] });
            } catch (error) {
                props.showMessage('An error occured while connecting: ' + error, 'Red');
            }

        } else {
            props.showMessage('Error: MetaMask extension is missing!', 'Red');
        }
    }

    const handleClick = (event) => {
        event.preventDefault();
        console.log("handleClick: formData.address: " + formData.address);

        axiosPutRequest("address", formData.address, props.userData.id);
    }

    /**
    * RETURN, HTML ELEMENTS
    */
    return (
        <div className="Account-Body">
            <form className="Email-Form" onSubmit={updateEmail}>
                <h1 className="Page-Name">Account management</h1>
                <p className="Account-Text-Warning">User ID: {props.userData.id}</p>
                <p className="Own-Text-Title">Update email address</p>

                <p className="Own-Text-Simple">Current email address</p>
                <div className="Account-Inactive-Input">{props.userData.email}</div>

                <label className="Account-Label">New email address</label>
                <input
                    className="Account-Active-Input"
                    type="email"
                    name="email"
                    onChange={(event) => handleEmailChange(event)}
                ></input>

                <div className="Button-Container">
                    <button className="Own-Button" type="submit">Save changes</button>
                </div>
            </form>


            <form className="Password-Form" onSubmit={updatePassword}>
                <p className="Own-Text-Title">Update password</p>

                <p className="Own-Text-Simple">Passwords must be at least 6 characters long!</p>
                <label className="Account-Label">Current password</label>
                <input
                    className="Account-Active-Input"
                    type="password"
                    name="currPassword"
                    onChange={(event) => setCurrPassword(event.target.value)}
                ></input>

                <label className="Account-Label">New password</label>
                <input
                    className="Account-Active-Input"
                    type="password"
                    name="newPassword"
                    onChange={(event) => setFormData({ ...formData, newPassword: event.target.value })}
                ></input>

                <label className="Account-Label">Confirm new password</label>
                <input
                    className="Account-Active-Input"
                    type="password"
                    name="confPassword"
                    onChange={(event) => setConfPassword(event.target.value)}
                ></input>

                <div className="Button-Container">
                    <button className="Own-Button" type="submit">Save changes</button>
                </div>
            </form>

            <p className="Own-Text-Title">Update wallet address</p>

            <p className="Own-Text-Simple">Open the MetaMask extension, select the wallet you want to use, then click the address below to load the new address into the app</p>
            <div className="Account-Address-Field" onClick={requestAccount}>{formData.address}</div>
            <p className="Own-Text-Simple">Save your changes by pressing the "update address" button!</p>
            <div className="Button-Container">
                <button className="Own-Button" onClick={(event) => handleClick(event)}>Update address</button>
            </div>
        </div>
    );
}

export default Account