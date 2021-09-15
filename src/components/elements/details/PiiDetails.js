import React from "react";
import {FiMail} from "@react-icons/all-files/fi/FiMail";
import './PiiDetails.css';
import {BiPhoneCall} from "@react-icons/all-files/bi/BiPhoneCall";
import {FaBirthdayCake} from "@react-icons/all-files/fa/FaBirthdayCake";
import {FaFacebookSquare} from "@react-icons/all-files/fa/FaFacebookSquare";
import {VscTwitter} from "@react-icons/all-files/vsc/VscTwitter";
import {FaWhatsapp} from "@react-icons/all-files/fa/FaWhatsapp";

const PiiDetails = ({pii}) => {

    pii = {
        name: "Risto",
        surname: "Kowaczewski",
        birthDate: "1972.09.01",
        email: "risto.kowaczewski@gmail.com",
        telephone: "+48 045 3435 232",
        twitter: "@risto",
        facebook: "Ri stonowicz",
        whatsapp: "+48 045 3435 232"
    }

    return <div className="PiiDetails">
        <div className="PiiBox">
            <div className="PiiCard">
                <header className="Name">
                    {pii.name} {pii.surname}
                </header>
                <div className="PiiData">
                    <section>
                        <div>
                            <FaBirthdayCake style={{marginRight: 5}}/> {pii.birthDate}
                        </div>
                        <div>
                            <FiMail style={{marginRight: 5}}/> {pii.email}
                        </div>
                        <div>
                            <BiPhoneCall style={{marginRight: 5}}/>{pii.telephone}
                        </div>
                    </section>
                    <aside>
                        <div>
                            <FaFacebookSquare size={20} style={{marginRight: 8}}/> {pii.facebook}
                        </div>
                        <div>
                            <VscTwitter size={20} style={{marginRight: 8}}/> {pii.twitter}
                        </div>
                        <div>
                            <FaWhatsapp style={{marginRight: 5}}/>{pii.whatsapp}
                        </div>
                    </aside>
                </div>


            </div>

        </div>
    </div>
}

export default PiiDetails;