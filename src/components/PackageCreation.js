import "../styles/Main.css";

import React, { useState, useEffect } from "react";
import DateHandler from "./DateHandler.js";
import PackageAssembler from "./PackageAssembler.js";
import Service from "./Service.js";
import services from "../assets/services.json";

function PackageCreation(props) {

    /**
    * VARRIABLES, STATES
    */
    const [isPackageCreated, setIsPackageCreated] = useState(false);
    const { calculatePrice, assemblePackage } = PackageAssembler();
    const {getCurrentDate, getEndDate} = DateHandler();

    /* Dates */
    const [duration, setDuration] = useState(1);
    const handleDropdownChange = (e) => {
        const optionValue = Number(e.target.value);
        setDuration(optionValue);
    };
    const sDate = getCurrentDate();
    const eDate = getEndDate(duration);

    /* Services */
    const [selectedServices, setSelectedServices] = useState([]);
    
    /* Price */
    const price = calculatePrice(selectedServices);
    
    /* New Package */
    const assembledPackage = assemblePackage(props.userData.id, true, selectedServices, price, duration, sDate, eDate);
    const [newPackage, setNewPackage] = useState(assembledPackage);
    
    /**
    * FUNCTIONS
    */
    /* Services */
    const handleServiceSelection = (newService, operation) => {
        switch (operation) {
            case "Add": {
                props.packages.forEach((p) => {
                    if (p.services.some((s) => s.serviceID === newService.serviceID)) {
                        props.showMessage(`Warning: You already have an active subscription to ${newService.name}!`, "Yellow");
                    }
                });
                setSelectedServices([...selectedServices, newService]);
                break;
            }
            case "Remove": {
                const updatedServices = selectedServices.filter((s) => s.serviceID !== newService.serviceID);
                setSelectedServices(updatedServices);
                break;
            }
            default: { break; }
        }
    };

    const filteredServices = services.filter(s => s.duration === duration);
    const serviceData = filteredServices.map(s => { 
        return <Service key={s.serviceID} {...s} type={"Creation"} handleServiceSelection={handleServiceSelection}/>
    });
    
    const isServiceSelected = () => {
        if (selectedServices && selectedServices.length !== 0) { return true; }
        return false;
    };
    useEffect(() => {}, [selectedServices]);
    
    /* Page change */
    function handleClick() {
        //props.createRandomPackage(); // ADDING RANDOM PACKAGE (testing checkPackageExpiration)
        setNewPackage({
            ...newPackage,
            services: selectedServices,
            price: price,
            duration: duration,
            eDate: eDate
        });
        props.showMessage("Package created, you can now proceed to payment!", "Green");
        setIsPackageCreated(true);
    };

    function continueToPayment() {
        props.addNewPackage(newPackage);
        props.setCurrentPage("Payment");
    };

    /**
    * RETURN, HTML ELEMENTS
    */
    return (
        <div className="PC-Body">
            <h1 className="Page-Name">Package creation</h1>
            <p className="Own-Text-Title">Subscription period</p>
            <p className="Own-Text-Simple">Filter available services by subscription period! The filter you choose will determine the subscription period of your package.</p>
            <select className="PCB-Dropdown" id="filter" disabled={isServiceSelected()} value={props.duration} onChange={handleDropdownChange}>
                <option value="1">Monthly subscriptions</option>
                <option value="6">Six months subscriptions</option>
                <option value="12">Annual subscriptions</option>
            </select>
            <p className="Own-Text-Title">Create your package</p>
            <p className="Own-Text-Simple">Choose from the listed services! The selected service will be included in your package after pressing the "Continue to payment" button.</p>
            <div className="PCB-Services">
                {serviceData}
            </div>
            <div className="Button-Container-PC">
                {isServiceSelected() === true && <button className="Button-Active" onClick={() => handleClick()}>Create package</button>}
                {isServiceSelected() === false && <button className="Button-Inactive">Create package</button>}

                {isPackageCreated === true && <button className="Button-Active" onClick={() => continueToPayment()}>Continue to payment</button>}
                {isPackageCreated === false && <button className="Button-Inactive">Continue to payment</button>}
            </div>
        </div>
    )
};

export default PackageCreation;