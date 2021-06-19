import React from "react";
import "./SocialSplash.css";
import {Facebook, PlayCircleOutline, Twitter, YouTube} from "@material-ui/icons";
import SocialButton from "./SocialButton";

export default function SocialSplash({onClick}) {

    return <div className="SocialSplashRoot">
        <div className="SocialSplash">
            <div className="Image"><img src={process.env.PUBLIC_URL + "/splash.svg"} alt="Splash"/></div>
            <div className="Content">
                <div className="Title">Welcome to <span className="Brand">Tracardi</span></div>
                <div className="Tag">Graphic User Interface for Apache Unomi</div>
                <div className="Message">
                    <p>Tracardi is still very early, but we would love to see what you can do with it at this stage!</p>
                    <p>If you would like to support us please follow us on <SocialButton icon={<Facebook/>} title="Facebook" link="https://www.facebook.com/TRACARDI/"/> or <SocialButton icon={<Twitter/>} title="Twitter" link="https://twitter.com/tracardi"/>
                        tag us and leave your comments. Subscribe to our <SocialButton icon={<YouTube/>} title="Youtube" link="https://www.youtube.com/channel/UC0atjYqW43MdqNiSJBvN__Q"/> channel
                        to see development process and new upcoming features.</p>
                </div>
                <div className="Continue">
                    <SocialButton icon={<PlayCircleOutline/>} title="Continue" onClick={onClick}/>
                </div>
            </div>

        </div>
    </div>


}