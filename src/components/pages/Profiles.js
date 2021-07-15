// import {connect} from "react-redux";
// import React from "react";
// import {getData} from "../../remote_api/uql_api_endpoint";
// import ListDetailView from "../elements/ListDetailView";
// import FilterListWrapper from "../elements/FilterListWrapper";
// import ProfileCard from "../elements/lists/cards/ProfileCard";
// import ProfileDetails from "../elements/details/ProfileDetails";
// import TopInfoBar from "../TopInfoBar";
// import Breadcrumps from "../elements/misc/Breadcrumps";
//
// const Profiles = () => {
//
//     const [loading, setLoading] = React.useState(false);
//     const [error, setError] = React.useState(false);
//     const [ready, setReady] = React.useState(false);
//
//
//     const onClick = (id) => {
//         getData('/profile/'+id, setLoading, setError, setReady)
//     }
//
//     const details = () =>  {
//         if (ready !== false) {
//             return <ProfileDetails data={ready.data}/>
//         }
//     }
//
//     const blocks = () => (<FilterListWrapper
//         endPoinyUrl="/profile/select"
//         renderList={
//             (data) => {
//                 return data.map((row, index) => (
//                     <ProfileCard key={index} data={row} onClick={onClick}/>
//                 ))
//             }
//         }
//         filterLabel="Type condition to filter profiles"
//         filterKey="filterProfileQuery"
//     />);
//
//     return <React.Fragment>
//
//         <TopInfoBar>
//             <Breadcrumps/>
//         </TopInfoBar>
//         <ListDetailView list={blocks} detail={details}/>
//
//     </React.Fragment>
// }
//
// const mapProps = (state) => {
//     return {
//         notification: state.notificationReducer,
//     }
// }
// export default connect(
//     mapProps,
// )(Profiles)
