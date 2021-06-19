// import Toolbar from "@material-ui/core/Toolbar";
// import Typography from "@material-ui/core/Typography";
// import {Divider} from "@material-ui/core";
// import List from "@material-ui/core/List";
// import {Link} from "react-router-dom";
// import ListItem from "@material-ui/core/ListItem";
// import ListItemIcon from "@material-ui/core/ListItemIcon";
// import {FindInPageOutlined, TouchAppOutlined} from "@material-ui/icons";
// import ListItemText from "@material-ui/core/ListItemText";
// import Drawer from "@material-ui/core/Drawer";
// import React from "react";
// import {makeStyles} from "@material-ui/core/styles";
// import urlPrefix from "../misc/UrlPrefix";
//
// const useStyles = makeStyles((theme) => ({
//     title: {
//         color: 'black',
//         display: 'none',
//         [theme.breakpoints.up('sm')]: {
//             display: 'block',
//         },
//     },
//     drawerPaper: {
//         width: "280px",
//         color: theme.palette.background.default
//     }
// }));
//
// export default function LeftMenu({drawerState, toggleDrawer}) {
//     const classes = useStyles()
//     return <Drawer variant="temporary" anchor="left" open={drawerState} onClose={toggleDrawer(false)}
//                    classes={{
//                        paper: classes.drawerPaper,
//                    }}>
//         <div
//             className="drawer"
//             role="presentation"
//             onClick={toggleDrawer(false)}
//             onKeyDown={toggleDrawer(false)}
//         >
//             <Toolbar>
//                 <Typography className={classes.title} variant="h6" noWrap>
//                     Tracardi <span className="thin">for Unomi</span> <span className="small">ver. 0.1.0</span>
//                 </Typography>
//             </Toolbar>
//             <Divider/>
//             <List>
//                 <Link to={urlPrefix("/sources")} className="listItem">
//                     <ListItem button key="1">
//                         <ListItemIcon><FindInPageOutlined
//                             style={{color: "black", fontWeight: 300}}/></ListItemIcon>
//                         <ListItemText>
//                             Sources
//                         </ListItemText>
//                     </ListItem>
//                 </Link>
//                 <Link to={urlPrefix("/events")} className="listItem">
//                     <ListItem button key="1">
//                         <ListItemIcon><FindInPageOutlined
//                             style={{color: "black", fontWeight: 300}}/></ListItemIcon>
//                         <ListItemText>
//                             Events
//                         </ListItemText>
//                     </ListItem>
//                 </Link>
//                 <Link to={urlPrefix("/rules")} className="listItem">
//                     <ListItem button key="1">
//                         <ListItemIcon><FindInPageOutlined
//                             style={{color: "black", fontWeight: 300}}/></ListItemIcon>
//                         <ListItemText>
//                             Rules
//                         </ListItemText>
//                     </ListItem>
//                 </Link>
//                 <Link to={urlPrefix("/segments")} className="listItem">
//                     <ListItem button key="1">
//                         <ListItemIcon><FindInPageOutlined
//                             style={{color: "black", fontWeight: 300}}/></ListItemIcon>
//                         <ListItemText>
//                             Segments
//                         </ListItemText>
//                     </ListItem>
//                 </Link>
//                 <Link to={urlPrefix("/profiles")} className="listItem">
//                     <ListItem button key="1">
//                         <ListItemIcon><FindInPageOutlined
//                             style={{color: "black", fontWeight: 300}}/></ListItemIcon>
//                         <ListItemText>
//                             Profiles
//                         </ListItemText>
//                     </ListItem>
//                 </Link>
//                 <Link to={urlPrefix("/console")} className="listItem">
//                     <ListItem button key="1">
//                         <ListItemIcon><FindInPageOutlined
//                             style={{color: "black", fontWeight: 300}}/></ListItemIcon>
//                         <ListItemText>
//                             QUL <span className="thin">console</span>
//                         </ListItemText>
//                     </ListItem>
//                 </Link>
//                 <Link to={urlPrefix("/manual")} className="listItem">
//                     <ListItem button key="2">
//                         <ListItemIcon><TouchAppOutlined style={{color: "black"}}/></ListItemIcon>
//                         <ListItemText>
//                             UQL <span className="thin">documentation</span>
//                         </ListItemText>
//                     </ListItem>
//                 </Link>
//             </List>
//         </div>
//     </Drawer>
// }
