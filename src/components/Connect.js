import "../styles/Main.css";
import React, { useState } from 'react'
import axios from 'axios'

function Connect(props) {

    /**
    * VARRIABLES, STATES
    */
    const [extensionFound, setExtensionFound] = useState(true);
    const [connected, setConnected] = useState(false);

    /**
    * FUNCTIONS
    */
    async function requestAccount() {
        if (window.ethereum) {    // Check if MetaMask Extension exists
            try {
                const accounts = await window.ethereum.request({ method: "eth_requestAccounts", });
                props.setUserData({ ...props.userData, address: accounts[0] });
                setConnected(true);
            } catch (error) { console.log('Error connecting: ' + error) }

        } else {
            console.log('MetaMask extension is missing!');
            setExtensionFound(false);
        }
    }

    const finishRegistration = (event) => {
        event.preventDefault();
        axios.post('http://localhost:8000/users', props.userData)
            .then(() => { props.handleClick(true) })
            .catch(error => console.log(error))
    }

    /**
    * RETURN, HTML ELEMENTS
    */
    return (
        <>
            <div className="Shading" onClick={() => props.handleClick(false)}></div>
            <div className="LRP-Body">
                <div className="RC-Input-Container">
                    <p className="Own-Text-Title">Connect your MetaMask wallet!</p>
                    <div className="SIP-Inputs">
                        <p className="Own-Label">Connecting a MetaMask wallet is mandatory to use the app, since it's the only way to make transactions.</p>
                        {extensionFound === false && <p className="LRP-Input-Error-2">Error: MetaMask extension is missing!</p>}
                        <div className="SIP-Address">{props.userData.address}</div>
                    </div>
                    <div className="RC-Button-Container">
                        {connected === false && <button className="LRP-Button" onClick={() => requestAccount()}>Connect</button>}
                        {connected === true && <button className="LRP-Button-Inactive">Connect</button>}

                        {connected === true && <button className="LRP-Button" onClick={finishRegistration}>Finish</button>}
                        {connected === false && <button className="LRP-Button-Inactive">Finish</button>}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Connect