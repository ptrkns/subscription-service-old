import "../styles/Main.css";
import React from 'react'

function Message(props) {
    /**
     * FUNCTIONS
     */
    function closeMessage() { props.setMessageVisibility(false); }

    /**
     * RETURN, HTML ELEMENTS
     */
    return (
        <div className={`Message-Body-${props.type}`}>
            <p className="Message-Text">{props.value}</p>
            <div className="Message-Close" onClick={() => closeMessage()}>X</div>
        </div>
    );
}

export default Message