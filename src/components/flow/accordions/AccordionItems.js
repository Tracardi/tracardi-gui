import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

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
    }
}));

export default function AccordionItems({items=[]}) {
    const classes = useStyles();
    const [expanded, setExpanded] = React.useState("item0");

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };
    console.log(items);
    return (
        <div className={classes.root}>
            {Array.isArray(items) && items.length>0 && items.map((item, idx)=>{
                return <Accordion key={idx} expanded={expanded === item.id} onChange={handleChange(item.id)}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1bh-content"
                        id="panel1bh-header"
                    >
                        <Typography className={classes.heading}>{item.title}</Typography>
                        <Typography className={classes.secondaryHeading}>{item.description}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        {item.content}
                    </AccordionDetails>
                </Accordion>
            })}
        </div>
    );
}