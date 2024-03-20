import {BsPlusCircle, BsStar} from "react-icons/bs";
import Button from "../../elements/forms/Button";
import {VscSignIn} from "react-icons/vsc";
import React from "react";

const ProEntryPoint = ({onClick}) => {

    const handleClick = (stage) => {
        if (onClick instanceof Function) {
            onClick(stage)
        }
    }

    return <div style={{display: "flex", alignItems: "center", flexDirection: "column", padding: 30}}>
        <BsStar size={80} style={{color: "gray", margin: 20}}/>
        <header style={{fontSize: "150%", fontWeight: 300, maxWidth: 600, textAlign: "center"}}>Please join Tracardi
            Pro for more free and premium connectors and services. No credit card required. It is a free lifetime
            membership.
        </header>
        <nav style={{display: "flex", marginTop: 20}}>
            <Button label="Sign-in" icon={<VscSignIn size={20}/>} onClick={() => handleClick(2)}></Button>
            <Button label="Sign-up" icon={<BsPlusCircle size={20}/>} onClick={() => handleClick(1)}
                    selected={true}></Button>
        </nav>

    </div>
}

export default ProEntryPoint;