import React from "react";
import {BsQuestionCircle} from "react-icons/bs";
import useTheme from "@mui/material/styles/useTheme";

function generateInitials(firstName, lastName) {

    let firstNameInitial = (firstName) ? firstName.charAt(0) : "";
    let surnameInitial = (lastName) ? lastName.charAt(0) : "";

    if (firstNameInitial || surnameInitial) {
        return firstNameInitial + surnameInitial;
    }

    return <BsQuestionCircle size={42}/>;
}

export function ProfileImage({profile}) {

    const theme = useTheme()

    let style = {minWidth: 120, maxWidth: 120, minHeight: 120, maxHeight: 120, borderRadius: 25}
    const initials = generateInitials(profile?.data?.pii?.firstname, profile?.data?.pii?.lastname)
    let bg = theme.palette.primary.main
    if(typeof initials === 'string') {
        bg = "rgb(121, 126, 246)"
    }

    if(!profile?.data?.media?.image) {
        style = {...style,
            backgroundColor: bg,
            color: "#FFFFFF",
            display: "grid",
            placeItems: "center",
            fontSize: "200%"
        }
        return <div style={style}>{initials}</div>
    }

    return <img alt="Profile Image" src={profile?.data?.media?.image} style={style}/>
}