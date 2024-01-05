import Popover from "@mui/material/Popover";
import PopupState, {bindPopover, bindTrigger} from "material-ui-popup-state";
import Button from "../forms/Button";
import React from "react";
import "./NeedHelpButton.css";
import {IoLogoYoutube, IoDocumentTextOutline, IoLogoTwitter} from "react-icons/io5";
import {AiOutlineSlack} from "react-icons/ai";
import {BsGithub, BsFillQuestionCircleFill} from "react-icons/bs";
import useTheme from "@mui/material/styles/useTheme";
import IconButton from "./IconButton";

export default function NeedHelpButton() {

    const theme = useTheme()

    const external = (url, newWindow=false) => {
        if(newWindow===true) {
            return () => window.open(url, '_blank', 'location=yes,scrollbars=yes,status=yes')
        } else {
            return () => window.location.href = url;
        }
    }

    const style = {
        backgroundColor: theme.palette.primary.light
    }

    return (
        <PopupState variant="popover" popupId="demo-popup-popover">
            {(popupState) => (
                <>
                    <IconButton label="Need help?"
                                {...bindTrigger(popupState)} >
                        <BsFillQuestionCircleFill size={20}/>
                    </IconButton>

                    <Popover
                        {...bindPopover(popupState)}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        style={{marginTop:10}}
                    >
                        <div className="NeedHelpButton" style={style}>
                            <div>
                                Mention us on Twitter @tracardi. We will respond as quickly as possible.
                                <div style={{display: "flex", justifyContent: "center", marginTop: 10}}>
                                    <Button label="Twitter"
                                            onClick={external("https://twitter.com/tracardi", true)}
                                            icon={<IoLogoTwitter size={20}/>}
                                    />
                                </div>

                            </div>

                            <div>
                                Don't want to bother us? View the documentation page.
                                <div style={{display: "flex", justifyContent: "center", marginTop: 10}}>
                                    <Button label="Documentation"
                                            onClick={external("http://docs.tracardi.com", true)}
                                            icon={<IoDocumentTextOutline size={20}/>}
                                    />
                                </div>
                            </div>

                            <div>
                                You don't like reading? Visit our video tutorials on YouTube.
                                <div style={{display: "flex", justifyContent: "center", marginTop: 10}}>
                                    <Button label="YouTube tutorials"
                                            icon={<IoLogoYoutube size={20}/>}
                                            onClick={external("https://www.youtube.com/channel/UC0atjYqW43MdqNiSJBvN__Q", true)}
                                    />
                                </div>

                            </div>

                            <div >
                                Need help from the community? Join our public Slack channel! We are happy to help.
                                <div style={{display: "flex", justifyContent: "center", marginTop: 10}}>
                                    <Button label="Join slack channel"
                                            icon={<AiOutlineSlack size={20}/>}
                                            onClick={external("https://join.slack.com/t/tracardi/shared_invite/zt-10y7w0o9y-PmCBnK9qywchmd1~KIER2Q", true)}
                                            />
                                </div>

                            </div>

                            <div>
                                You would like to report an issue. Visit us on github.
                                <div style={{display: "flex", justifyContent: "center", marginTop: 10}}>
                                <Button label="Visit github"
                                        icon={<BsGithub size={20}/>}
                                        onClick={external("https://github.com/tracardi/tracardi", true)}
                                        />
                                </div>
                            </div>
                        </div>

                    </Popover>
                </>
            )}
        </PopupState>
    );
}