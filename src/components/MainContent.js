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
            <span className="Version"> v. 0.6.0</span>
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
                <Brand/>
                <aside className="User">
                    <MenuIcon icon={<FiShare2 size={25}/>} label="Share" direction="bottom">
                        <MenuItem onClick={external("https://twitter.com/tracardi" , true)}>
                            <VscTwitter size={20} style={{marginRight: 8}}/> Twitter
                        </MenuItem>
                        <MenuItem onClick={external("https://www.facebook.com/TRACARDI/", true)}>
                            <FaFacebookSquare size={20} style={{marginRight: 8}}/> Facebook
                        </MenuItem>
                        <MenuItem onClick={external("https://www.youtube.com/channel/UC0atjYqW43MdqNiSJBvN__Q", true)}>
                            <IoLogoYoutube size={20} style={{marginRight: 8}}/> Youtube
                        </MenuItem>
                        <MenuItem onClick={external("https://github.com/atompie/tracardi", true)}>
                            <VscGithubInverted size={20} style={{marginRight: 8}}/> GitHub
                        </MenuItem>
                    </MenuIcon>
                    <MenuIcon icon={<FiMoreHorizontal size={30}/>} label="Settings" direction="bottom">
                        <MenuItem onClick={go("/settings")}>
                            <VscSettingsGear size={20} style={{marginRight: 8}}/>Settings
                        </MenuItem>
                        <MenuItem onClick={external(`${window._env_.API_URL}/manual/en/site`, true)}>
                            <VscBook size={20} style={{marginRight: 8}}/>Manual
                        </MenuItem>
                        e
                        <MenuItem onClick={() => setOpenAbout(true)}>
                            <VscInfo size={20} style={{marginRight: 8}}/>About
                        </MenuItem>
                    </MenuIcon>

                    <MenuIcon icon={<IoPersonCircleOutline size={30}/>} label="Profile" direction="bottom">
                        <MenuItem onClick={go("/logout")}>
                            <AiOutlinePoweroff size={20} style={{marginRight: 8}}/>Logout
                        </MenuItem>
                    </MenuIcon>
                </aside>
            </div>
            <div className="Bottom">
                {children}
            </div>
        </div>
        <About />
    </div>
}