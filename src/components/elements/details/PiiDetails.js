import React, {useContext} from "react";
import {FiMail} from "react-icons/fi";
import './PiiDetails.css';
import {BiPhoneCall} from "react-icons/bi";
import {FaBirthdayCake, FaFacebookSquare} from "react-icons/fa";
import {VscTwitter, VscPerson} from "react-icons/vsc";
import {FaWhatsapp} from "react-icons/fa";
import useTheme from "@mui/material/styles/useTheme";
import {LocalDataContext} from "../../pages/DataAnalytics";
import {profileName} from "../../../misc/formaters";

const PiiDetails = ({data}) => {

    const localContext = useContext(LocalDataContext)
    const theme = useTheme()
    const style = {backgroundColor: localContext ? "#f3e5f5": theme.palette.primary.light}

    return <div className="PiiDetails" style={style}>
        <div className="PiiBox">
            <div className="PiiNameSurname">
                <div className="PiiIcon">
                    <VscPerson size={40}/>
                </div>
                <div>
                    <header className="Name">
                        {profileName(data)}
                    </header>
                </div>

            </div>

            <div className="PiiData">
                <section>
                    <div>
                        <FaBirthdayCake style={{marginRight: 5}}/> {data?.pii?.birth_date ? data?.pii?.birth_date : "not available"}
                    </div>
                    <div>
                        <FiMail style={{marginRight: 5}}/> {data?.pii?.email ? data?.pii?.email : "not available"}
                    </div>
                    <div>
                        <BiPhoneCall style={{marginRight: 5}}/>{data?.pii?.telephone ? data?.pii?.telephone : 'not available'}
                    </div>
                </section>
                <aside>
                    <div>
                        <FaFacebookSquare size={20} style={{marginRight: 8}}/> {data?.pii?.facebook ? data?.pii?.facebook : "not available"}
                    </div>
                    <div>
                        <VscTwitter size={20} style={{marginRight: 8}}/> {data?.pii?.twitter ? data?.pii?.twitter: "not available"}
                    </div>
                    <div>
                        <FaWhatsapp style={{marginRight: 5}}/>{data?.pii?.whatsapp ? data?.pii?.whatsapp : "not available"}
                    </div>
                </aside>
            </div>
        </div>
    </div>
}

export default PiiDetails;