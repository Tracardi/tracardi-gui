import React from "react";
import SquareCard from "../elements/lists/cards/SquareCard";
import "../elements/lists/CardBrowser.css";
import CardBrowser from "../elements/lists/CardBrowser";
import {BsShieldLock} from "@react-icons/all-files/bs/BsShieldLock";
import CredentialDetails from "../elements/details/CredentialsDetails";


export default function Credentials() {

    const credentials = (data, onClick) => {
        return data?.grouped && Object.entries(data?.grouped).map(([category, plugs], index) => {
            return <div className="CardGroup" key={index}>
                <header>{category}</header>
                <div>
                    {plugs.map((row, subIndex) => {
                        return <SquareCard key={index + "-" + subIndex}
                                           id={row?.id}
                                           icon={<BsShieldLock size={45}/>}
                                           status={row?.enabled}
                                           name={row?.type}
                                           description={row?.name}
                                           onClick={() => onClick(row?.id)}/>
                    })}
                </div>
            </div>
        })
    }

    return <CardBrowser
        urlFunc={(query) => ('/credentials/by_type' + ((query) ? "?query=" + query : ""))}
        cardFunc={credentials}
        drawerDetailsTitle="Credential details"
        drawerDetailsWidth={800}
        detailsFunc={(id, close) => <CredentialDetails id={id}/>}
    />
}
