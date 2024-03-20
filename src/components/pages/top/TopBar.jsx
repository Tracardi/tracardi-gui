import SponsorButton from "../../elements/misc/SponsorButton";
import ReadOnlyInput from "../../elements/forms/ReadOnlyInput";
import {getApiUrl, resetApiUrlConfig} from "../../../remote_api/entrypoint";
import NeedHelpButton from "../../elements/misc/NeedHelpButton";
import React, {useContext} from "react";
import "./TopBar.css";
import useTheme from "@mui/material/styles/useTheme";
import {KeyCloakContext} from "../../context/KeyCloakContext";
import DarkThemeButton from "../../elements/misc/DarkTheme";
import PopOverIconButton from "../../elements/forms/buttons/PopOverIconButton";
import {BsPersonCircle} from "react-icons/bs";
import UserAccount from "../UserAccount";

export default function TopBar({children, onDarkMode}) {

    const theme = useTheme();
    const authContext = useContext(KeyCloakContext)

    const handleEndpointReset = () => {
        resetApiUrlConfig();
        authContext.logout()
        window.location.replace("/");
    }

    const style = {
        // backgroundColor: theme.palette.primary.light,
        color: theme.palette.common.black
    }

    return <div className="TopBar" style={style}>
        <h1 className="Title">{children}</h1>
        <span className="Info">
            <SponsorButton/>
            <ReadOnlyInput
                label="Tracardi API"
                value={getApiUrl()}
                onReset={handleEndpointReset}/>
            <NeedHelpButton/>
            <DarkThemeButton onDarkMode={onDarkMode}/>
            <PopOverIconButton icon={<BsPersonCircle size={20}/>} transform = {{
                vertical: 'top',
                horizontal: 'left',
            }}>
                <div style={{minWidth: 800}}>
                    <UserAccount/>
                </div>
            </PopOverIconButton>
        </span>
    </div>
}