import {connect} from "react-redux";
import React from "react";
import {getData} from "../../remote_api/uql_api_endpoint";
import EventCard from "../elements/lists/cards/EventCard";
import FilterListWrapper from "../elements/FilterListWrapper";
import ListDetailView from "../elements/ListDetailView";
import EventDetails from "../elements/details/EventDetails";
import CenteredCircularProgress from "../elements/progress/CenteredCircularProgress";
import Breadcrumps from "../elements/misc/Breadcrumps";
import TopInfoBar from "../TopInfoBar";
import {showAlert} from "../../redux/reducers/alertSlice";


const Events = ({showAlert}) => {

    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(false);
    const [ready, setReady] = React.useState(false);

    const onClick = (id) => {
        console.log(id);
        getData('/event/' + id, setLoading, setError, setReady)
    }

    const eventDetails = () => {
        if (ready !== false) {
            return <EventDetails data={ready.data}></EventDetails>
        } else if(loading === true) {
            return <CenteredCircularProgress/>
        } else if (error!== false) {
            showAlert({message: error[0].msg, type: "error", hideAfter:2000});
            return ""
        }
    }

    const blocks = () => (<FilterListWrapper
        endPoinyUrl="/event/select"
        renderList={
            (data) => {
                return data.map((row, index) => (
                    <EventCard key={index} data={row} onClick={onClick}/>
                ))
            }
        }
        filterLabel="Type condition to filter events"
        filterKey="filterEventQuery"
    />);

    return <React.Fragment>
        <TopInfoBar>
            <Breadcrumps/>
        </TopInfoBar>
        <ListDetailView list={blocks} detail={eventDetails}/>
    </React.Fragment>


}

const mapProps = (state) => {
    return {
        notification: state.notificationReducer,
    }
};
export default connect(
    mapProps,
    {showAlert}
)(Events)

