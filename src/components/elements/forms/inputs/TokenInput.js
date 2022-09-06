import InputAdornment from "@mui/material/InputAdornment";
import React, {useState} from "react";
import {BsEye, BsEyeSlashFill, BsKeyFill} from "react-icons/bs";
import {VscLock, VscUnlock} from "react-icons/vsc";
import TextField from "@mui/material/TextField";
import Button from "../Button";
import CircularProgress from "@mui/material/CircularProgress";
import {asyncRemote, getError} from "../../../../remote_api/entrypoint";

export default function TokenInput({label = "Api Key", apiKey = "", token = "", getTokenUrl, onTokenChange,fullWidth = false, error, style, required}) {

    apiKey = apiKey || ""
    token = token || ""

    const hasToken = (token) => {
        return token !== "" && token !== null && typeof token !== 'undefined'
    }

    const [showPassword, setShowPassword] = useState(false);
    const [disabled, setDisabled] = useState(hasToken(token))
    const [loading, setLoading] = useState(false)
    const [apiKeyValue, setApiKeyValue] = useState(apiKey)
    const [tokenValue, setTokenValue] = useState(token)
    const [inputLabel, setInputLabel] =  useState(label)
    const [errorMessage, setErrorMessage] =  useState(error)

    const handleGetToken = async () => {
        try {
            setErrorMessage(null)
            setLoading(true)
            const response = await asyncRemote(getTokenUrl(apiKeyValue))
            if(response.data) {
                const generatedToken = response?.data?.access_token

                if (onTokenChange) {
                    onTokenChange(generatedToken)
                }
                return generatedToken
            }

            return ""

        } catch (e) {
            const err = getError(e)
            setErrorMessage(err[0].msg)
            // Reset token
            if (onTokenChange) {
                onTokenChange("")
            }
            return ""
        } finally {
            setLoading(false)
        }
    }

    const handleDisable = async (state) => {
        if(state) {
            await handleGenerateToken()
        } else {
            setApiKeyValue(apiKeyValue)
            setInputLabel("Api Key")
            setErrorMessage(null)
            setDisabled(state)
        }

    }

    const handleChange = (event) => {
        const value = event.target.value
        setApiKeyValue(value)
    };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword)
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleGenerateToken = async () => {
        const generatedToken = await handleGetToken()
        const isTokenCorrect = hasToken(generatedToken)
        setDisabled(isTokenCorrect)
        if(isTokenCorrect) {
            setTokenValue(generatedToken)
            setInputLabel("Secret Token")
            setShowPassword(false)
        } else {
            setShowPassword(true)
            setTokenValue("")
        }

    }

    return <div style={{display: "flex", alignItems: "start"}}><TextField
        required={required}
        fullWidth={fullWidth}
        size="small"
        style={style}
        type={showPassword ? 'text' : 'password'}
        value={disabled ? tokenValue : apiKeyValue}
        onChange={handleChange}
        error={errorMessage !== null}
        disabled={disabled}
        helperText={errorMessage}
        InputProps={{
            startAdornment: <InputAdornment position="start" style={{cursor: "pointer"}}>
                {
                    loading
                    ? <CircularProgress color="inherit" size={20}/>
                    : disabled
                        ? <VscLock size={20} onClick={async ()=>await handleDisable(false)} style={{color: "green"}}/>
                        : <VscUnlock size={20} onClick={async ()=>await handleDisable(true)} style={{color: errorMessage === null ? "inherit": "#d81b60"}}/>
                }

            </InputAdornment>,
            endAdornment: <InputAdornment position="end">
                <span
                    style={{display: "flex", alignItems: "center", cursor: "pointer"}}
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                >
                {showPassword ? <BsEyeSlashFill size={20}/> : <BsEye size={20}/>}
                </span>
            </InputAdornment>
        }}
        label={inputLabel}
        variant="outlined"
    /><Button label="Get Secret"
              disabled={disabled}
              style={{height: 38}}
              onClick={handleGenerateToken}
              icon={<BsKeyFill size={20}/>}
    />
    </div>
}
