import React, {useState} from "react";
import Tabs, {TabCase} from "../tabs/Tabs";
import "./DateTimePicker.css";
import Popover from "@mui/material/Popover";
import Button from "../forms/Button";
import RelativePicker from "./RelativePicker";
import {IoCalendarOutline} from "react-icons/io5";
import NowDateTime from "./NowDateTime";
import PropTypes from "prop-types";
import useTheme from "@mui/material/styles/useTheme";

export default function DataTimePickerNew({type, initValue, onChange}) {

    const theme = useTheme()

    const activeTab = (value) => {
        if (value?.delta?.value) {
            return 0;
        }

        return 1;
    }

    const [selected, setSelected] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [value, setValue] = useState(initValue);
    const [tab, setTab] = useState(activeTab(initValue));

    const handleDisplay = (event) => {
        setAnchorEl(event.currentTarget);
        setSelected(true)
    };

    const handleClose = () => {
        setAnchorEl(null);
        setSelected(false)
    };

    const handleTabChange = (v) => {
        setTab(v);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'datetime-popover' : undefined;


    const isNow = () => {
        return (value == null || (value?.absolute === null && value?.delta === null))
    }

    const datetimeString = (value) => {
        if ((value == null || (value?.absolute === null && value?.delta === null))) {
            return 'now';
        }

        if (value?.delta?.value) {
            return value?.delta?.type + " " + value?.delta?.value + " " + value?.delta?.entity
        }

        if (value?.absolute) {
            return value?.absolute
        }

        return 'Error'
    }

    const handleDateChange = (v) => {
        setValue(v);
        if(onChange instanceof Function) {
            onChange(v)
        }
    }

    return <div>
        <Button
            id="picker"
            icon={<IoCalendarOutline size={24} style={{marginRight: 5}}/>}
            style={{margin: 0,
                marginLeft: 5,
                color: (selected || !isNow()) ? "white" : theme.palette.primary.main,
                backgroundColor: (selected || !isNow()) ? theme.palette.primary.main : "transparent"}}
            label={datetimeString(value)}
            onClick={handleDisplay}
            variant="standard"
            size="small"
        />
        <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
        >
            <div className="DateTimePicker">
                <Tabs tabs={["Relative", "Now"]} defaultTab={tab} onTabSelect={handleTabChange}>
                    <TabCase id={0}>
                        <RelativePicker type={type} onChange={handleDateChange} datetime={value}/>
                    </TabCase>
                    <TabCase id={1}>
                        <NowDateTime onDateSelect={handleDateChange}/>
                    </TabCase>
                </Tabs>
            </div>
        </Popover>
    </div>


}

DataTimePickerNew.propTypes = {
    datetime: PropTypes.object,
    onDatetimeSelect: PropTypes.func,
    type: PropTypes.string,
};