// import RightPaperHeader from "../RightPaperHeader";
// import Drawer from "@material-ui/core/Drawer";
// import React from "react";
// import SourceAddForm from "../forms/SourceAddForm";
//
// export default function SourceFormDrawer(
//     {
//         init,
//         width,
//         label,
//         open,
//         onClose
//     }) {
//
//     const onSourceClose = (ev) => {
//         onClose(ev);
//     }
//
//     return <Drawer anchor="right" open={open} onClose={onSourceClose}>
//         <div style={{width: (width) ? width : 1200, overflowX: "hidden"}}>
//             <RightPaperHeader onClose={onSourceClose}>
//                 <span style={{fontWeight: 600}}>{label}</span>
//             </RightPaperHeader>
//             {open && <SourceAddForm init={init}/>}
//         </div>
//     </Drawer>
// }
