import {connect} from "react-redux";
import React from "react";
import {request} from "../../remote_api/uql_api_endpoint";
import ListDetailView from "../elements/ListDetailView";
import FilterListWrapper from "../elements/FilterListWrapper";
import RuleCard from "../elements/lists/cards/RuleCard";
import RuleDetails from "../elements/details/RuleDetails";
import CenteredCircularProgress from "../elements/progress/CenteredCircularProgress";
import TopInfoBar from "../TopInfoBar";
import Breadcrumps from "../elements/misc/Breadcrumps";
import {showAlert} from "../../redux/reducers/alertSlice";
import RuleFormDrawer from "../elements/drawers/RuleFormDrawer";
import Button from "../elements/forms/Button";
import {BsFolderPlus} from "@react-icons/all-files/bs/BsFolderPlus";

const Rules = ({showAlert}) => {

    const [editInitData, setEditInitData] = React.useState(null);
    const [formToggle, setFormToggle] = React.useState(false);
    const [loadingDetails, setLoadingDetails] = React.useState(false);
    const [errorDetails, setErrorDetails] = React.useState(false);
    const [ready, setReady] = React.useState(false);

    const none = () => {
    }

    const onDeleteOk = (data) => {
        setReady(false);
    }

    const onClick = (id) => {
        request({
                url: '/rule/' + id,
                method: "get"
            },
            setLoadingDetails, setErrorDetails, setReady
        )
    }

    const onAdd = () => {
        setEditInitData(null);
        setFormToggle(true);
    }

    const onDelete = (id) => {
        request({
                url: '/rule/' + id,
                method: "delete"
            },
            none, none, onDeleteOk
        )
    }

    const onEdit = (data) => {
        const editData = JSON.parse(JSON.stringify(data));
        editData.event['name'] = editData.event.type
        editData.event['id'] = editData.event.type
        setEditInitData(editData);
        setFormToggle(true);
    }

    const details = () => {
        if (ready !== false) {
            return <RuleDetails data={ready.data}
                                onDelete={onDelete}
                                onEdit={onEdit}
            />
        } else if (loadingDetails === true) {
            return <CenteredCircularProgress/>
        } else if (errorDetails !== false) {
            showAlert({message: errorDetails[0].msg, type: "error", hideAfter: 2000});
            return ""
        }
    }

    const blocks = () => {
        return <FilterListWrapper
            endPoinyUrl="/rule/select"
            renderList={
                (data) => {
                    return data.result.map((row, index) => (
                        <RuleCard key={index} data={row} onClick={onClick}/>
                    ))
                }
            }
            filterLabel="Type condition to filter rules"
            filterKey="filterRuleQuery"
        />
    }

    return <React.Fragment>
        <TopInfoBar buttons={[<Button
            label="New rule"
            onClick={onAdd}
            icon={<BsFolderPlus size={24} style={{marginRight: 10}}/>}/>]}>
            <Breadcrumps/>
        </TopInfoBar>
        <ListDetailView list={blocks} detail={details}/>
        <RuleFormDrawer
            init={editInitData}
            label="Create Rule"
            open={formToggle}
            onClose={() => setFormToggle(false)}
        />
    </React.Fragment>
}

const mapProps = (state) => {
    return {}
}
export default connect(
    mapProps,
    {showAlert}
)(Rules)
