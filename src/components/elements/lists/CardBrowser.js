import React, {useEffect, useState} from "react";
import './CardBrowser.css';
import CenteredCircularProgress from "../../elements/progress/CenteredCircularProgress";
import FormDrawer from "../../elements/drawers/FormDrawer";
import FilterAddForm from "../../elements/forms/inputs/FilterAddForm";
import {TuiForm, TuiFormGroup, TuiFormGroupContent, TuiFormGroupField, TuiFormGroupHeader} from "../tui/TuiForm";
import ErrorsBox from "../../errors/ErrorsBox";
import {asyncRemote, getError} from "../../../remote_api/entrypoint";
import {isEmptyObjectOrNull} from "../../../misc/typeChecking";
import NoData from "../misc/NoData";

const CardBrowser = ({
                         label,
                         description,
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
                         className,
                         refresh: forceRefresh
                     }) => {

    const Content = ({query, onClick, urlFunc, refresh, forceRefresh}) => {

        const [cards, setCards] = useState(null);
        const [loading, setLoading] = useState(false);
        const [errors, setErrors] = useState(null);

        useEffect(() => {
                setCards(null);
                const url = urlFunc(query)
                setLoading(true);
                let isSubscribed = true
                asyncRemote({url})
                    .then((response) => {
                        if (response && isSubscribed) {
                            setCards(response.data);
                        }
                    })
                    .catch((e) => {
                        if (e && isSubscribed) {
                            setErrors(getError(e))
                        }
                    })
                    .finally(() => {
                            if (isSubscribed) {
                                setLoading(false);
                            }
                        }
                    )
                return () => {
                    isSubscribed = false
                }
            }
            , [query, refresh, urlFunc, forceRefresh])

        if (loading) {
            return <div style={{height: 300}}><CenteredCircularProgress/></div>
        }

        if (!loading && isEmptyObjectOrNull(cards?.grouped)) {
            return <NoData header="There is no data here.">
                <p>Please click create button in the upper right corner.</p>
            </NoData>
        }

        if (!loading && !isEmptyObjectOrNull(cards?.grouped))
            return <TuiForm style={{margin: 20, marginTop: 0}}>
                <TuiFormGroup fitHeight={true}>
                    <TuiFormGroupHeader header={label} description={description}/>
                    <TuiFormGroupContent>
                        <TuiFormGroupField>
                            <section className={className} style={{display: "flex", flexWrap: "wrap", width: "100%"}}>
                                {cards && cardFunc(cards, onClick)}
                                {errors && <ErrorsBox errorList={errors}/>}
                            </section>
                        </TuiFormGroupField>
                    </TuiFormGroupContent>
                </TuiFormGroup>
            </TuiForm>
    }

    const Container = ({forceRefresh}) => {

        const [cardId, setCardId] = useState(null);
        const [displayAddForm, setDisplayAddForm] = useState(false);
        const [refresh, setRefresh] = useState(forceRefresh || 0);
        const [query, setQuery] = useState(null);

        const handleFilter = (query) => {
            setQuery(query);
        }

        const handleCloseAdd = () => {
            setDisplayAddForm(false);
            setRefresh(refresh + 1);
        }

        const handleOpenAdd = () => {
            setDisplayAddForm(true)
        }

        const handleCloseDetails = () => {
            setCardId(null);
            setRefresh(refresh + 1);
        }

        return <div className="CardBrowser">

            <FilterAddForm
                style={{margin: "0 20px", marginTop: 5}}
                textFieldLabel="Type to filter"
                buttonLabel={buttomLabel}
                buttonIcon={buttonIcon}
                onFilter={handleFilter}
                onAdd={handleOpenAdd}/>

            <Content
                query={query}
                onClick={(id) => setCardId(id)}
                urlFunc={urlFunc}
                refresh={refresh}
                forceRefresh={forceRefresh}
            />

            <FormDrawer
                width={drawerDetailsWidth}
                label={drawerDetailsTitle}
                onClose={handleCloseDetails}
                open={cardId !== null}>
                {cardId && detailsFunc(cardId, handleCloseDetails)}
            </FormDrawer>

            <FormDrawer
                width={drawerAddWidth}
                label={drawerAddTitle}
                onClose={handleCloseAdd}
                open={displayAddForm}>
                {addFunc && buttomLabel && addFunc(handleCloseAdd)}
            </FormDrawer>

        </div>
    }

    return <Container forceRefresh={forceRefresh}/>

}

export default CardBrowser;