import React, {useState} from "react";
import {useHistory} from "react-router-dom";
import "./MainContent.css";
import MainMenu from "./menu/MainMenu";
import {IoPersonCircleOutline} from "@react-icons/all-files/io5/IoPersonCircleOutline";
import {MenuItem} from "@szhsin/react-menu";
import {MenuIcon} from "./menu/Menu";
import urlPrefix from "../misc/UrlPrefix";
import {AiOutlinePoweroff} from "@react-icons/all-files/ai/AiOutlinePoweroff";
import {FiShare2} from "@react-icons/all-files/fi/FiShare2";
import {FaFacebookSquare} from "@react-icons/all-files/fa/FaFacebookSquare";
import {IoLogoYoutube} from "@react-icons/all-files/io/IoLogoYoutube";
import {VscTwitter} from "@react-icons/all-files/vsc/VscTwitter";
import {VscGithubInverted} from "@react-icons/all-files/vsc/VscGithubInverted";
import {VscSettingsGear} from "@react-icons/all-files/vsc/VscSettingsGear";
import {VscInfo} from "@react-icons/all-files/vsc/VscInfo";
import {FiMoreHorizontal} from "@react-icons/all-files/fi/FiMoreHorizontal";
import Modal from "@material-ui/core/Modal";
import SocialButton from "./elements/misc/SocialButton";
import {Facebook, Twitter, YouTube} from "@material-ui/icons";
import {VscBook} from "@react-icons/all-files/vsc/VscBook";
import version from "../misc/version";
import {apiUrl} from "../remote_api/entrypoint";

export default function MainContent({children, style}) {

    const [openAbout, setOpenAbout] = useState(false);

    const history = useHistory();
    const go = (url) => {
        return () => history.push(urlPrefix(url));
    }

    const external = (url, newWindow=false) => {
        if(newWindow===true) {
            return () => window.open(url, '_blank', 'location=yes,scrollbars=yes,status=yes')
        } else {
            return () => window.location.href = url;
        }

    }

    const Brand = () => {
        return <span className="Brand">TRACARDI
            <span className="BrandTag">Home for your Customer Data</span>
            <span className="Version"> v. {version()}</span>
        </span>
    }

    const About = () => {
        return <Modal
            open={openAbout}
            onClose={() => setOpenAbout(false)}
            aria-labelledby="about-modal-title"
            aria-describedby="about-modal-description"
        >
            <div className="About">
                <Brand />

                <section>
                    <p>If you would like to help developing TRACARDI join us <a style={{color: "white"}} href="http://github.com/atompie/tracardi">GitHub</a></p>

                    <h1>Follow us</h1>
                    <SocialButton icon={<Facebook size={15}/>} title="Facebook" link="https://www.facebook.com/TRACARDI/"/>
                    <SocialButton icon={<Twitter size={15}/>} title="Twitter" link="https://twitter.com/tracardi"/>
                    <SocialButton icon={<YouTube size={15}/>} title="Youtube" link="https://www.youtube.com/channel/UC0atjYqW43MdqNiSJBvN__Q"/>

                    <h1>License</h1>
                    <p>Tracardi is available under MIT with Common Clause license.</p>
                </section>
            </div>

        </Modal>
    }

    return <div className="MainContent" style={style}>
        <MainMenu/>
        <div className="MainPane">
            <div className="Top">
                
            </div>
            <div className="Bottom">
                {children}
            </div>
        </div>
        <About />
    </div>
}