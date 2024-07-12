import "../styles/Main.css";
import React, { useState, useEffect } from "react";

import Package from "./Package.js";

function Subscriptions(props) {

    /*
    *   VARRIABLES, USE_EFFECT
    */
    /* Updating page */
    const [updateSubscr, setUpdateSubscr] = useState(true);
    useEffect(() => { }, [props.packages, updateSubscr]);

    /* Rendering packages */
    const activePackages = props.packages.filter(p => p.isActive === true).map(p => {
        return <Package
            key={p.packageID}
            p={p}
            updatePackageStatus={props.updatePackageStatus}
            updateSubscr={updateSubscr}
            setUpdateSubscr={setUpdateSubscr}
        />
    });

    const expiredPackages = props.packages.filter(p => p.isActive === false).map(p => {
        return <Package
            key={p.packageID}
            p={p}
            updatePackageStatus={props.updatePackageStatus}
            updateSubscr={updateSubscr}
            setUpdateSubscr={setUpdateSubscr}
        />
    });

    /*
    *   RETURN, HTML ELEMENTS
    */
    return (
        <div className="S-Body">
            <h1 className="Page-Name">Subscriptions</h1>
            <p className="Own-Text-Simple">Cancel active subscriptions or renew expired ones.</p>
            {activePackages.length === 0 && expiredPackages.length === 0 && <>
                <p className="Own-Text-Title">*_*</p>
                <p className="Own-Text-Simple">There are currently no active or expired subscriptions on this account.</p>
            </>}

            {activePackages.length !== 0 && <>
                <p className="Own-Text-Title">Active subscriptions</p>
                <p className="Own-Text-Warning">Warning: Cancellation of the subscriptions is immediate! By performing this action, you will lose access to the services!</p>
                <div>{activePackages}</div>
            </>}

            {expiredPackages.length !== 0 && <>
                <p className="Own-Text-Title">Expired subscriptions</p>
                <p className="Own-Text-Simple">By clicking the "Renew subscription" button, you can regain access to the services in the package after payment.</p>
                <div>{expiredPackages}</div>
            </>}
        </div>
    );
};

export default Subscriptions;