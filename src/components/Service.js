import "../styles/Main.css";
import React, { useState } from "react";

function Service(props) {

    /**
    * VARRIABLES, STATES
    */
    const [selected, setSelected] = useState(false);
    const newService = { serviceID: props.serviceID, name: props.name, description: props.description, duration: props.duration, price: props.price };

    /**
    * FUNCTIONS
    */
    function handleClick() {
        setSelected((prevSelected) => {
            const newSelected = !prevSelected;
            if (newSelected) { props.handleServiceSelection(newService, "Add"); }
            else { props.handleServiceSelection(newService, "Remove"); }
            return newSelected;
        });
    }

    /**
    * RETURN, HTML ELEMENTS
    */
    return (
        <>
            {props.type == "Creation" && <div className={`${selected == false ? "Service-Body" : "Service-Body-Selected"}`} onClick={() => handleClick()}>
                <div className="Name-Container">
                    <p className="Service-Text">{props.name}</p>
                    <p className="Service-Desc">{props.description}</p>
                </div>
                <div className="Price-Container">
                    {props.duration == 1 && <p className="Price-Text">{props.price} ETH<br></br>per MONTH</p>}
                    {props.duration == 6 && <p className="Price-Text">{props.price} ETH<br></br>per {props.duration} MONTHS</p>}
                    {props.duration == 12 && <p className="Price-Text">{props.price} ETH<br></br>per YEAR</p>}
                </div>
            </div>}
            {props.type == "Payment" && <div className="Service-Body-Payment">
                <div className="Name-Container">
                    <p className="Service-Text">{props.name}</p>
                    <p className="Service-Desc">{props.description}</p>
                </div>
                <div className="Price-Container">
                    {props.duration == 1 && <p className="Price-Text">{props.price} ETH<br></br>per MONTH</p>}
                    {props.duration == 6 && <p className="Price-Text">{props.price} ETH<br></br>per {props.duration} MONTHS</p>}
                    {props.duration == 12 && <p className="Price-Text">{props.price} ETH<br></br>per YEAR</p>}
                </div>
            </div>}
        </>
    );
}

export default Service