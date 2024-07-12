import "../styles/Main.css";
import React, { useState } from "react";
import { customAlphabet } from "nanoid";
import axios from 'axios'

function Registration(props) {

    /**
    * VARRIABLES, STATES
    */
    const [errors, setErrors] = useState({});
    const [valid, setValid] = useState(true);
    const [cpassword, setCpassword] = useState('');
    const [registeredEmails, setRegisteredEmails] = useState([]);

    /**
    * FUNCTIONS
    */
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

        props.setUserData({ ...props.userData, email: event.target.value });
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        let isValid = true;
        let validationErrors = {};
        let isEmailValid = validateEmail(props.userData.email);

        if (props.userData.email === "" || props.userData.email === null) {
            isValid = false;
            validationErrors.email = "Email field is required!";
        } else if (isEmailValid === false) {
            isValid = false;
            validationErrors.email = "This email address is already registered!";
        } else if (!/\S+@\S+\.\S+/.test(props.userData.email)) {
            isValid = false;
            validationErrors.email = "Invalid email format!";
        }

        if (props.userData.password === "" || props.userData.password === null) {
            isValid = false;
            validationErrors.password = "Password field is required!"
        } else if (props.userData.password.length < 6) {
            isValid = false;
            validationErrors.password = "Password must be at least 6 characters long!";
        }

        if (cpassword === "" || cpassword === null) {
            isValid = false;
            validationErrors.cpassword = "Password confirmation field is required!"
        } else if (cpassword !== props.userData.password) {
            isValid = false;
            validationErrors.cpassword = "Passwords do not match!";
        }

        setErrors(validationErrors);
        setValid(isValid);

        if (Object.keys(validationErrors).length === 0) {
            const generateRandomID = customAlphabet('0123456789', 5);
            props.userData.id = generateRandomID();
            props.setSelectedOption("connect");
        }
    }

    /**     
    * RETURN, HTML ELEMENTS
    */
    return (
        <div>
            <div className="Shading" onClick={() => props.handleClick(false)}></div>

            <form className="LRP-Body" onSubmit={handleSubmit}>
                <div className="LRP-Input-Container">
                    <p className="Own-Text-Title">Fill your credentials!</p>

                    <div className="LRP-Inputs">

                        <label className="Own-Label">Email address:</label>
                        {valid ? <></> : <span className="LRP-Input-Error">{errors.email}</span>}
                        <input className="Own-Input"
                            type="email"
                            name="email"
                            onChange={(event) => handleEmailChange(event)}
                        ></input>

                        <label className="Own-Label">Password:</label>
                        {valid ? <></> : <span className="LRP-Input-Error">{errors.password}</span>}
                        <input className="Own-Input"
                            type="password"
                            name="password"
                            onChange={(event) => props.setUserData({ ...props.userData, password: event.target.value })}
                        ></input>

                        <label className="Own-Label">Confirm password:</label>
                        {valid ? <></> : <span className="LRP-Input-Error">{errors.cpassword}</span>}
                        <input className="Own-Input"
                            type="password"
                            name="cpassword"
                            onChange={(event) => setCpassword(event.target.value)}
                        ></input>
                    </div>
                    <button className="LRP-Button" type="submit">Continue</button>
                </div>
            </form>
        </div>
    )
}

export default Registration