// import React, {useEffect, useState} from "react";
// import {asyncRemote, getError} from "../../../remote_api/entrypoint";
// import "./TracardiProRunningServicesList.css";
// import CenteredCircularProgress from "../progress/CenteredCircularProgress";
// import RunningServiceCard from "../cards/RunningServiceCard";
// import ErrorsBox from "../../errors/ErrorsBox";
//
// const TracardiProRunningServicesList = ({onEditClick, refresh}) => {
//
//     const [services, setServices] = useState(null);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);
//
//     useEffect(() => {
//         if (services === null) {
//             setLoading(true);
//         }
//         asyncRemote({
//             url: '/tracardi-pro/services',
//             method: "GET",
//         }).then((response) => {
//             setServices(response.data)
//         }).catch((e) => {
//             setError(getError(e))
//         }).finally(() => {
//             setLoading(false);
//         })
//
//     }, [refresh, services])
//
//     const handleServiceEditClick = (service) => {
//         if (onEditClick) {
//             onEditClick(service)
//         }
//     }
//
//     const handleDelete = async () => {
//         try {
//             // Load again services
//             const newresponse = await asyncRemote({
//                 url: '/tracardi-pro/services',
//                 method: "GET",
//             })
//             setServices(newresponse.data);
//         } catch (e) {
//             alert("Could not refresh services")
//         }
//     }
//
//     return <div className="TracardiProAddedServicesList">
//         {loading && <CenteredCircularProgress/>}
//         {error && <ErrorsBox errorList={error}/>}
//         {Array.isArray(services) && services.map((service, key) => {
//             return <RunningServiceCard key={key}
//                                        service={service}
//                                        onEditClick={handleServiceEditClick}
//                                        onDelete={handleDelete}
//             />
//         })}
//     </div>
// }
//
// export default TracardiProRunningServicesList;