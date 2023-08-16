import * as React from 'react';
import PropTypes from 'prop-types';
import { IMaskInput } from 'react-imask';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

const TimeMaskCustom = React.forwardRef(function TimeMaskCustom(props, ref) {
    const { onChange, ...other } = props;

    return (
        <IMaskInput
            {...other}
            mask="00:00:00"
            definitions={{
                '0': /[0-9]/,
            }}
            inputRef={ref}
            onAccept={(value) => onChange({ target: { name: props.name, value } })}
            overwrite
        />
    );
});

TimeMaskCustom.propTypes = {
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
};

export default function TimeTextField(props) {
    const { onChange, value, style, ...other } = props;

    const timeToSeconds = (timeString) => {
        const [hours, minutes, seconds] = timeString.split(':').map(Number);
        return hours * 3600 + minutes * 60 + seconds;
    };

    const secondsToTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleTimeChange = (event) => {
        const timeInSeconds = timeToSeconds(event.target.value);
        onChange(timeInSeconds);
    };

    return (
        <Box
            sx={{
                '& > :not(style)': {
                    m: 1,
                },
            }}
        >
            <TextField
                {...other}
                variant="outlined"
                size="small"
                value={secondsToTime(value || 0)}
                label="hh:mm:ss"
                placeholder="00:00:00"
                onChange={handleTimeChange}
                name="timeInSeconds"
                style={{width: 90, ...style}}
                InputProps={{
                    inputComponent: TimeMaskCustom,
                }}
            />
        </Box>
    );
}

TimeTextField.propTypes = {
    onChange: PropTypes.func.isRequired,
};
