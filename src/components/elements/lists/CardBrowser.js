import React, {useEffect, useState} from "react";
import './CardBrowser.css';
import {request} from "../../../remote_api/uql_api_endpoint";
import CenteredCircularProgress from "../../elements/progress/CenteredCircularProgress";
import FormDrawer from "../../elements/drawers/FormDrawer";
import FilterAddForm from "../../elements/forms/inputs/FilterAddForm";
import {showAlert} from "../../../redux/reducers/alertSlice";
import {connect} from "react-redux";

const CardBrowser = ({
                         label,
                         showAlert,
                         urlFunc,
                         cardFunc,
                         buttomLabel = null,
                         buttonIcon,
                         drawerDetailsTitle = "Details",
                         drawerDetailsWidth = 600,
                         detailsFunc = () => {},
                         drawerAddWidth = 600,
                         drawerAddTitle = "New",
                         addFunc = () => {},
                         className
                     }) => {

    const [cards, setCards] = useState(null);
    const [cardId, setCardId] = useState(null);
    const [query, setQuery] = useState(null);
    const [loading, setLoading] = useState(false);
    const [displayAddForm, setDisplayAddForm] = useState(false);
    const [refresh, setRefresh] = useState(Math.random);

    useEffect(() => {
        setCards(null);
        setLoading(true);
        const url = urlFunc(query)
        request({
                url
            },
            setLoading,
            (e) => {
                if (e) {
                    showAlert({message: e[0].msg, type: "error", hideAfter: 3000});
                }
            },
            (response) => {
                if (response) {
                    setCards(response.data);
                }
            }
        )
    }, [query, refresh, showAlert, urlFunc])

    const onClick = (id) => {
        setCardId(id);
    }

    const closeEdit = (data) => {
        setDisplayAddForm(false);
        setRefresh(Math.random());
    }

    const closeDetails = () => {
        setCardId(null);
        setRefresh(Math.random());
    }

    const onFilter = (query) => {
        setQuery(query);
    }

    const onAdd = () => {
        setDisplayAddForm(true)
    }

    const Label = ({children}) => {
        return <h3>{children}</h3>
    }

    return <div className="CardBrowser">
        <FilterAddForm
            textFieldLabel="Type to filter"
            buttonLabel={buttomLabel}
            buttonIcon={buttonIcon}
            onFilter={onFilter}
            onAdd={onAdd}/>
        {label && <Label>{label}</Label>}
        <section className={className}>
            {loading && <CenteredCircularProgress/>}
            {cards && cardFunc(cards, onClick)}
        </section>


        <FormDrawer
            width={drawerDetailsWidth}
            label={drawerDetailsTitle}
            onClose={() => {
                closeDetails();
            }}
            open={cardId !== null}>
            {cardId && detailsFunc(cardId, closeDetails)}
        </FormDrawer>

        {addFunc && buttomLabel && <FormDrawer
            width={drawerAddWidth}
            label={drawerAddTitle}
            onClose={() => {
                closeEdit();
            }}
            open={displayAddForm}>
            {addFunc(closeEdit)}
        </FormDrawer>}

    </div>
}

const mapProps = (state) => {
    return {}
}
export default connect(
    mapProps,
    {showAlert}
)(CardBrowser)