import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import theme from "../../../themes/inspector_light_theme";
import {ObjectInspector} from "react-inspector";

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        flexBasis: '33.33%',
        flexShrink: 0,
    },
    secondaryHeading: {
        fontSize: theme.typography.pxToRem(15),
        color: theme.palette.text.secondary,
    },
}));

export default function DebugContextAccordions({profile, event, session}) {
    const classes = useStyles();
    const [expanded, setExpanded] = React.useState(false);

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    return (
        <div className={classes.root}>
            <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1bh-content"
                    id="panel1bh-header"
                >
                    <Typography className={classes.heading}>Profile data</Typography>
                    <Typography className={classes.secondaryHeading}>Profile data is mutable</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <ObjectInspector data={profile} theme={theme} expandLevel={5}/>
                </AccordionDetails>
            </Accordion>
            <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel2bh-content"
                    id="panel2bh-header"
                >
                    <Typography className={classes.heading}>Event data</Typography>
                    <Typography className={classes.secondaryHeading}>
                        Event data is NOT mutable
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <ObjectInspector data={event} theme={theme} expandLevel={5}/>
                </AccordionDetails>
            </Accordion>
            <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel3bh-content"
                    id="panel3bh-header"
                >
                    <Typography className={classes.heading}>Session</Typography>
                    <Typography className={classes.secondaryHeading}>
                        Session data is NOT mutable
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <ObjectInspector data={session} theme={theme} expandLevel={5}/>
                </AccordionDetails>
            </Accordion>
        </div>
    );
}