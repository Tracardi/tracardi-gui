import React from "react";
import {FiMail} from "react-icons/fi";
import './PiiDetails.css';
import {BiPhoneCall} from "react-icons/bi";
import {FaBirthdayCake, FaFacebookSquare} from "react-icons/fa";
import {VscTwitter, VscPerson} from "react-icons/vsc";
import {FaWhatsapp} from "react-icons/fa";

const PiiDetails = ({data}) => {

    return <div className="PiiDetails">
        <div className="PiiBox">
            <div className="PiiNameSurname">
                <div className="PiiIcon">
                    <VscPerson size={40}/>
                </div>
                <div>
                    <header className="Name">
                        {data?.pii?.name} {data?.pii?.last_name ? data?.pii?.last_name : "Anonymous"}
                    </header>
                    <div>
                        Last event: {data?.metadata?.time?.lastVisit ? data?.metadata?.time?.lastVisit : "not available"}
                    </div>

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