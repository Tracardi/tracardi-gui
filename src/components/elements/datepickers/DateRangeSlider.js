import * as React from 'react';
import Slider from '@mui/material/Slider';
import Stack from "@mui/material/Stack";
import Tag from "../misc/Tag";

const max = 364+24+60
function valueLabelFormat(value, index) {
    if (value === max) {
        return "now";
    } else if (value >= 364 + 24 && value < max) {
        return `-${(max - value)} minutes`
    } else if (value >= 364 && value < 364 + 24) {
        return `-${(max - value - 60)} hours`
    } else {
        return `-${(max - value - 60 - 24)} day`
    }
}

const minDistance = 1;
const marks = [

    {
        value: 0,
        label: '-1 year',
    },
    {
        value: 364 - 182,
        label: '-6 month',
    },
    {
        value: 364-90,
        label: '-3 months',
    },
    {
        value: 364-30,
        label: '-1 month',
    },
    {
        value: 364,
        label: '-1 day',
    },
    {
        value: 364+24,
        label: '-1 hour',
    },
    {
        value: 364+24+60-15,
        label: '-15 min',
    },
];

export default function DateRangeSlider({value: _value, onChange}) {

    const [value, setValue] = React.useState(_value || [364, max]);

    const handleChange = (event, newValue, activeThumb) => {
        if (!Array.isArray(newValue)) {
            return;
        }
        let _newValue;
        if (newValue[1] - newValue[0] < minDistance) {
            if (activeThumb === 0) {
                const clamped = Math.min(newValue[0], max - minDistance);
                _newValue= [clamped, clamped + minDistance]
            } else {
                const clamped = Math.max(newValue[1], minDistance);
                _newValue= [clamped - minDistance, clamped]
            }
        } else {
            _newValue = newValue
        }

        setValue(_newValue)
    };

    const handleCommit = (event, newValue) => {
        if(onChange instanceof Function) {
            onChange(newValue)
        }
    };

    return <Stack spacing={2} direction="row" sx={{ mb: 1, px: 1 }} alignItems="center">
            <Tag>1 year</Tag>
            <Slider
                getAriaLabel={() => 'Date Slider'}
                value={value}
                onChange={handleChange}
                valueLabelDisplay="auto"
                valueLabelFormat={valueLabelFormat}
                onChangeCommitted={handleCommit}
                disableSwap
                color="primary"
                marks={marks}
                max={max}
                style={{width: "calc(100% - 20px)"}}
            />
            <Tag>now</Tag>
        </Stack>
}
